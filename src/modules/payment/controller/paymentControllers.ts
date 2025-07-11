import { Request, Response } from 'express';
import httpStatus from 'http-status';
import paymentRepositories from '../repository/paymentRepositories';
import { paypack, PAYPACK_ENVIRONMENT } from '../../../services/paypackService';
import authRepository from '../../auth/repository/authRepository';



const BAD_REQUEST = httpStatus.BAD_REQUEST;
const INTERNAL_ERROR = httpStatus.INTERNAL_SERVER_ERROR;
const SUCCESS = httpStatus.OK;

const getTheLatestSettings = async (): Promise<any> => {
    try {
        const setting = await paymentRepositories.findLatestSetting();

        const serviceFee =
            setting?.serviceFee ?? Number(process.env.SERVICE_FEE || 0.4);
        const transactionFeeRate =
            setting?.transactionFeeRate ?? Number(process.env.TRANSACTION_FEE || 0.023);

        return { serviceFee, transactionFeeRate };
    } catch (error) {
        console.error('Failed to get settings:', error);
        return {
            serviceFee: Number(process.env.SERVICE_FEE || 0.4),
            transactionFeeRate: Number(process.env.TRANSACTION_FEE || 0.023),
        };
    }
};

let SERVICE_FEE: any;
let TRANSACTION_FEE_RATE: any;

const initPaymentSettings = async () => {
    const settings = await getTheLatestSettings();
    SERVICE_FEE = settings.serviceFee / 100;
    TRANSACTION_FEE_RATE = settings.transactionFeeRate / 100;
};


initPaymentSettings();





class PaymentTimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PaymentTimeoutError";
    }
}

const requestPaypackPayment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { payer, amount } = req.body;

        // Step 1: Initiate payment
        const paymentResponse = await paypack.cashin({ number: payer, amount });
        const transactionId = paymentResponse.data.ref;

        console.log("[INFO] Payment initiated. Waiting for confirmation...");

        // Step 2: Wait for confirmation
        const paymentResult = await waitForPaymentApproval(transactionId, amount);

        if (!paymentResult.success) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: paymentResult.message || "Payment failed or timed out"
            });
        }

        console.log("[INFO] Payment successful. Proceeding to save transaction...");

        // Step 3: Save payment info
        req.body.depositId = transactionId;
        req.body.technician = req.user?._id;
        req.body.status = "paid";
        req.body.serviceFee = SERVICE_FEE;
        req.body.requestedAmount = amount;
        req.body.receivedAmount = amount * (1 - Number(SERVICE_FEE));

        const techCurrentBalance = req.user?.balance || 0;
        const newBalance = techCurrentBalance + req.body.receivedAmount;

        const serviceFeeAmount = amount * Number(SERVICE_FEE);
        const transactionFee = amount * Number(TRANSACTION_FEE_RATE);
        const netIncome = serviceFeeAmount - transactionFee;

        const incomeData = {
            grossAmount: amount,
            serviceFee: serviceFeeAmount,
            transactionFee: transactionFee,
            netIncome: netIncome,
            type: "in",
            description: `Payment from ${payer} (${req.user?.email})`
        };

        const [newRequest, updateTechBalance, saveIncome] = await Promise.all([
            paymentRepositories.saveTechnicianPayment(req.body),
            authRepository.updateUser(req.user?._id, { balance: newBalance }),
            paymentRepositories.saveSystemIncomeTracker(incomeData)
        ]);

        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: "Payment request created successfully",
            data: { newRequest, paymentResult, saveIncome }
        });

    } catch (error: any) {
        console.error("[ERROR] Payment processing failed:", error);

        if (error instanceof PaymentTimeoutError) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: error.message || "Payment timeout"
            });
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal server error"
        });
    }
};


const waitForPaymentApproval = async (transactionId: string, amount: number): Promise<{ success: boolean; message?: string }> => {
    const maxWaitTime = 60000; // 60 seconds
    const checkInterval = 10000; // 10 seconds

    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const interval = setInterval(async () => {
            try {
                const elapsed = Date.now() - startTime;

                // Fetch recent Paypack events
                const response = await paypack.events({ offset: 0, limit: 100 });
                const transactions = response.data.transactions;

                // Look for the correct transaction
                const matchedTransaction = transactions.find(
                    (event: any) =>
                        event.data?.ref === transactionId &&
                        event.event_kind === "transaction:processed" &&
                        event.data?.status === "success" &&
                        Number(event.data?.amount) === Number(amount)
                );

                if (matchedTransaction) {
                    clearInterval(interval);
                    console.log("[SUCCESS] Confirmed payment from Paypack:", matchedTransaction);
                    resolve({ success: true });
                } else if (elapsed >= maxWaitTime) {
                    clearInterval(interval);
                    console.warn(`[TIMEOUT] Payment not confirmed for transaction: ${transactionId}`);
                    reject(new PaymentTimeoutError("Payment not confirmed by user within 60 seconds"));
                }
            } catch (err) {
                clearInterval(interval);
                console.error("[ERROR] Failed to fetch transaction events:", err);
                reject({ success: false, message: "Failed to verify payment status" });
            }
        }, checkInterval);
    });
};



const findTechniciansPayments = async (req: Request, res: Response): Promise<any> => {
    try {

        const techniciansPayments = await paymentRepositories.findTechniciansPayments()

        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Payments retrieved successfully",
            data: { techniciansPayments }
        });
    } catch (error) {
        console.error("Error in findTechniciansPayments:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error"
        });
    }
}

const technicianFindOwnPayments = async (req: Request, res: Response): Promise<any> => {
    try {
        const technicianId = req.user?._id;
        const technicianPayments = await paymentRepositories.findTechnicianPayments(technicianId);

        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Payments retrieved successfully",
            data: { technicianPayments }
        });
    } catch (error) {
        console.error("Error in findTechnicianPayments:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error"
        });
    }
}

const technicianWithdrawMoney = async (req: Request, res: Response): Promise<any> => {
    const { amount, phone } = req.body;
    const { balance, _id: technicianId } = req.user || {};

    try {
        if (!balance) {
            return res.status(BAD_REQUEST).json({
                status: BAD_REQUEST,
                message: "User balance Insufficient"
            });
        }

        if (balance < amount) {
            return res.status(BAD_REQUEST).json({
                status: BAD_REQUEST,
                message: "Insufficient balance, make sure the withdraw amount is less than your balance"
            });
        }

        const paymentResponse = await paypack.cashout({
            number: phone,
            amount,
            environment: PAYPACK_ENVIRONMENT
        });

        console.debug("Initial withdraw response:", paymentResponse.data);
        const transactionId = paymentResponse.data.ref;


        console.info("Withdraw successful! Creating order...");
        const newBalance = balance - amount;
        const withdrawData = {
            ...req.body,
            withdrawId: transactionId,
            technician: technicianId,
            status: "paid",
            oldBalance: balance,
            newBalance
        };

        const serviceFee = amount * Number(TRANSACTION_FEE_RATE);

        const incomeData = {
            grossAmount: amount,
            serviceFee,
            transactionFee: 0,
            netIncome: serviceFee,
            type: "out",
            description: `Withdraw money: ${amount} by ${req.user?.email}`
        }

        const [techWithdrawal, userBalance, saveIncome] = await Promise.all([
            paymentRepositories.techWithdrawMoney(withdrawData),
            authRepository.updateUser(technicianId, { balance: newBalance }),
            paymentRepositories.saveSystemIncomeTracker(incomeData)
        ]);

        return res.status(SUCCESS).json({
            status: SUCCESS,
            message: `You have successfully withdrawn ${amount} from your account`,
            data: { techWithdrawal, userBalance, saveIncome }
        });
    } catch (error) {
        console.error("Error in technicianWithdrawMoney:", error);
        return res.status(INTERNAL_ERROR).json({
            status: INTERNAL_ERROR,
            message: "Internal Server Error"
        });
    }
};

const technicianFindOwnWithdrawals = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log(req.user?._id)
        const withdrawals = await paymentRepositories.techFindOwnWithdrawals(req.user?._id);

        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Withdrawals retrieved successfully",
            data: { withdrawals }
        })
    }
    catch (error: any) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error.message || "An unknown error ocured"
        })
    }
}

const findTechniciansWithdraws = async (req: Request, res: Response): Promise<any> => {
    try {
        const withdrawals = await paymentRepositories.findAllTechsWithdrawals();
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Withdrawals retrieved successfully",
            data: { withdrawals }
        })
    } catch (error: any) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        })
    }
}

const findSystemIncomes = async (req: Request, res: Response): Promise<any> => {
    try {
        const systemIncomes = await paymentRepositories.findAllSystemIncomes();

        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "System incomes retrieved successfully",
            data: { systemIncomes }
        })
    } catch (error: any) {
        return res.status(INTERNAL_ERROR).json({
            status: INTERNAL_ERROR,
            message: error.message
        }
        )
    }
}

const findTechniciansBalances = async (req: Request, res: Response): Promise<any> => {
    try {
        const techniciansBalances = await paymentRepositories.findAllTechnicians();
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Technicians retrieved successfully",
            data: { techniciansBalances }
        })
    }
    catch (error: any) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        })
    }
}

const adminWithdrawMoney = async (req: Request, res: Response): Promise<any> => {
    const { amount, phone } = req.body;
    const technicianId = req.user?._id;
    try {

        const paymentResponse = await paypack.cashout({
            number: phone,
            amount,
        });

        console.debug("Initial withdraw response:", paymentResponse.data);
        const transactionId = paymentResponse.data.ref;


        console.info("Withdraw successful! Creating order...");
        const withdrawData = {
            ...req.body,
            withdrawId: transactionId,
            technician: technicianId,
            status: "paid",
            oldBalance: 0,
            newBalance: 0
        };

        const serviceFee = amount * Number(TRANSACTION_FEE_RATE);

        const incomeData = {
            grossAmount: amount,
            serviceFee,
            transactionFee: 0,
            netIncome: serviceFee,
            type: "out",
            description: `Withdraw money: ${amount} by Admin ${req.user?.email}`
        }

        const [techWithdrawal, saveIncome] = await Promise.all([
            paymentRepositories.techWithdrawMoney(withdrawData),
            paymentRepositories.saveSystemIncomeTracker(incomeData)
        ]);

        return res.status(SUCCESS).json({
            status: SUCCESS,
            message: `You have successfully withdrawn ${amount} from your account`,
            data: { techWithdrawal, saveIncome }
        });
    } catch (error) {
        console.error("Error in technicianWithdrawMoney:", error);
        return res.status(INTERNAL_ERROR).json({
            status: INTERNAL_ERROR,
            message: "Internal Server Error"
        });
    }
};

const savePaymentSettings = async (req: Request, res: Response): Promise<any> => {
    try {
        const settings = await paymentRepositories.savePaymentSettings(req.body);
        return res.status(SUCCESS).json({
            status: SUCCESS,
            message: "Payment settings saved successfully",
            data: { settings }
        })
    } catch (error) {
        console.error("Error in savePaymentSettings:", error);
        return res.status(INTERNAL_ERROR).json({
            status: INTERNAL_ERROR,
            message: "Internal Server Error" + error
        }
        )
    }
}

const getPaymentSettings = async (req: Request, res: Response): Promise<any> => {
    try {
        const settings = await paymentRepositories.findPaymentSettings();
        return res.status(SUCCESS).json({
            status: SUCCESS,
            message: "Payment settings retrieved successfully",
            data: { settings }
        })
    } catch (error) {
        console.error("Error in getPaymentSettings:", error);
    }
}

export default {
    requestPaypackPayment,
    findTechniciansPayments,
    technicianFindOwnPayments,
    technicianWithdrawMoney,
    technicianFindOwnWithdrawals,
    findTechniciansWithdraws,
    findSystemIncomes,
    findTechniciansBalances,
    adminWithdrawMoney,
    savePaymentSettings,
    getPaymentSettings
}