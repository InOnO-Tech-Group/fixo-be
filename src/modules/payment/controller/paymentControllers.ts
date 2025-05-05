import { Request, Response } from 'express';
import httpStatus from 'http-status';
import paymentRepositories from '../repository/paymentRepositories';
import { paypack, PAYPACK_ENVIRONMENT } from '../../../services/paypackService';
import authRepository from '../../auth/repository/authRepository';

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
            environment: PAYPACK_ENVIRONMENT
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

        const techCurrentBalance = req.user?.balance || 0;
        const newBalance = techCurrentBalance + req.body.amount;

        const [newRequest, updateTechBalance] = await Promise.all([
            paymentRepositories.saveTechnicianPayment(req.body),
            authRepository.updateUser(req.user?._id, { balance: newBalance })
        ]);

        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: "Payment request created successfully",
            data: {
                newRequest,
                paymentResult
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

const waitForPaymentApproval = async (transactionId: string): Promise<{ success: boolean }> => {
    const maxWaitTime = 60000;
    const checkInterval = 5000;

    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        console.log(`[INFO] Starting payment confirmation check for: ${transactionId}`);

        const interval = setInterval(async () => {
            try {
                const elapsedTime = Date.now() - startTime;

                const response = await paypack.events({
                    offset: 0,
                    limit: 100,
                    after: startTime
                });

                console.log("[DEBUG] Raw Paypack events:", response.data.transactions);

                const confirmedTransaction = response.data.transactions.find(
                    (event: any) =>
                        event.data.ref === transactionId &&
                        event.event_kind === "transaction:confirmed" &&
                        event.data.status === "successful"
                );

                if (confirmedTransaction) {
                    console.log(`[SUCCESS] User confirmed payment: ${transactionId}`);
                    clearInterval(interval);
                    resolve({ success: true });
                    return;
                }

                if (elapsedTime >= maxWaitTime) {
                    clearInterval(interval);
                    throw new PaymentTimeoutError(`Timeout waiting for confirmation: ${transactionId}`);
                }

            } catch (error) {
                clearInterval(interval);
                if (error instanceof PaymentTimeoutError) {
                    reject(error);
                } else {
                    console.error(`[ERROR] Payment check failed: ${transactionId}`, error);
                    reject(new Error("Payment verification failed"));
                }
            }
        }, checkInterval);
    });
};

const findTechniciansPayments = async (req: Request, res: Response): Promise<any> => {
    try {
        const techniciansPayments = await paymentRepositories.findTechniciansPayments()
            ;

        if (!techniciansPayments || techniciansPayments.length === 0) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "No payments found."
            });
        }

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

        if (!technicianPayments || technicianPayments.length === 0) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "No payments found."
            });
        }

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


export default {
    requestPaypackPayment,
    findTechniciansPayments,
    technicianFindOwnPayments
}