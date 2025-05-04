import { Request, Response } from 'express';
import httpStatus from 'http-status';
import paymentRepositories from '../repository/paymentRepositories';
import { paypack, PAYPACK_ENVIRONMENT } from '../../../services/paypackService';
import authRepository from '../../auth/repository/authRepository';

const BAD_REQUEST = httpStatus.BAD_REQUEST;
const INTERNAL_ERROR = httpStatus.INTERNAL_SERVER_ERROR;
const SUCCESS = httpStatus.OK;
const SERVICE_FEE = process.env.SERVICE_FEE || 0.4;
const TRANSACTION_FEE_RATE = process.env.TRANSACTION_FEE || 0.023;

class PaymentTimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PaymentTimeoutError";
    }
}

const requestPaypackPayment = async (req: Request, res: Response): Promise<any> => {
    try {
        const paymentResponse: any = await paypack.cashin({
            number: req.body.payer,
            amount: req.body.amount,
        });

        console.log("[DEBUG] Initial payment response:", paymentResponse.data);
        const transactionId = paymentResponse.data.ref;

        const paymentResult = await waitForPaymentApproval(transactionId);

        if (!paymentResult.success) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: "Payment failed or timed out"
            });
        }

        console.log("[INFO] Payment successful! Creating order...");


        req.body.depositId = transactionId;
        req.body.technician = req.user?._id;
        req.body.status = "paid";
        req.body.serviceFee = SERVICE_FEE
        req.body.requestedAmount = req.body.amount;
        req.body.receivedAmount = req.body.amount * (1 - Number(SERVICE_FEE));

        const techCurrentBalance = req.user?.balance || 0;

        const newBalance = techCurrentBalance + req.body.receivedAmount;

        const serviceFee = req.body.amount * req.body.serviceFee;
        const transactionFee = req.body.amount * Number(TRANSACTION_FEE_RATE)
        const netIncome = serviceFee - transactionFee;

        const incomeData = {
            grossAmount: req.body.amount,
            serviceFee: serviceFee,
            transactionFee: transactionFee,
            netIncome: netIncome,
            type: "in",
            description: `Payment from ${req.body.payer} (${req.user?.email})`
        };
        const [newRequest, updateTechBalance, saveIncome] = await Promise.all([
            paymentRepositories.saveTechnicianPayment(req.body),
            authRepository.updateUser(req.user?._id, { balance: newBalance }),
            paymentRepositories.saveSystemIncomeTracker(incomeData)
        ]);


        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: "Payment request created successfully",
            data: {
                newRequest,
                paymentResult,
                saveIncome
            }
        });

    } catch (error: any) {
        if (error instanceof PaymentTimeoutError) {
            console.log(`[TIMEOUT] Payment not confirmed: ${error.message}`);
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: "Payment not confirmed by user"
            });
        }
        console.error(error)
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        console.error("[ERROR] Order processing failed:", message);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal server error"
        });
    }
};

const waitForPaymentApproval = async (transactionId: any): Promise<any> => {
    const maxWaitTime = 60000;
    const checkInterval = 15000;

    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        console.log(`[INFO] Checking payment status every ${checkInterval / 1000} seconds for transaction: ${transactionId}`);

        const interval = setInterval(async () => {
            try {
                const elapsedTime = Date.now() - startTime;
                console.log(`[INFO] Checking Paypack transactions for transaction: ${transactionId}...`);

                const response = await paypack.events({ offset: 0, limit: 100 });
                const events = response.data.transactions;

                const transactionEvent = events.find(
                    (event: any) =>
                        event.data.ref === transactionId &&
                        event.event_kind === "transaction:processed"
                );

                if (transactionEvent) {
                    console.log(`[SUCCESS] Payment confirmed for transaction: ${transactionId}`);
                    clearInterval(interval);
                    resolve({ success: true, transactionId });
                    return;
                }

                if (elapsedTime >= maxWaitTime) {
                    console.log(`[ERROR] Payment timeout: No approval for transaction: ${transactionId}`);
                    clearInterval(interval);
                    reject({ success: false, message: "Payment timeout: User did not approve within 1 minute" });
                }
            } catch (error) {
                console.error(`[ERROR] Failed to check payment status for transaction: ${transactionId}`, error);
                clearInterval(interval);
                reject({ success: false, message: "Payment check failed" });
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


export default {
    requestPaypackPayment,
    findTechniciansPayments,
    technicianFindOwnPayments,
    technicianWithdrawMoney,
    technicianFindOwnWithdrawals,
    findTechniciansWithdraws,
    findSystemIncomes,
    findTechniciansBalances,
    adminWithdrawMoney
}