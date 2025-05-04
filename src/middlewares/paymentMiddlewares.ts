import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import paymentRepositories from "../modules/payment/repository/paymentRepositories";
import { PAYPACK_API_ID, PAYPACK_BASE_URL, PAYPACK_SECRET } from "../services/paypackService";
import axios from "axios";
import { paypackRequest } from "../utils/paypackRequest";

declare global {
    namespace Express {
        interface Request {
            paypackAuth?: string;
        }
    }
}

export const isPaymentRequestAlreadyExists = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { depositId } = req.body;
        req.body.technician = req.user?._id;

        const existingRequest = await paymentRepositories.findTechnicianPaymentBy2Attributes({ depositId, technician: req.body.technician });

        if (existingRequest) {
            return res.status(httpStatus.CONFLICT).json({
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: "Payment request already exists for this deposit ID"
            });
        }
        return next();
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error"
        });
    }
}

export const paypackAuthentication = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const response = await axios.post(`${PAYPACK_BASE_URL}/auth/agents/authorize`, {
            client_id: PAYPACK_API_ID,
            client_secret: PAYPACK_SECRET,
        });

        const accessToken = response.data?.access;

        if (!accessToken) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: httpStatus.UNAUTHORIZED,
                message: "Paypack authentication failed",
            });
        }

        req.paypackAuth = accessToken;
        next();
    } catch (error) {
        console.error("Paypack auth error:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error",
        });
    }
};
