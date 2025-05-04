import mongoose, { Schema, Document } from "mongoose";


export interface ITechniciansPayments extends Document {
    depositId: string;
    technician: mongoose.Types.ObjectId;
    amount: number;
    payer: string;
    note: string;
    status: 'pending' | 'paid' | 'failed';
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
declare global {
    namespace Express {
        interface Request {
            technicianPayment?: ITechniciansPayments;
            technicianPayments?: ITechniciansPayments[];
        }
    }
}

const techniciansPaymentsSchema: Schema = new mongoose.Schema(
    {
        depositId: {
            type: String,
            unique: true,
        },
        technician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        payer: {
            type: String,
            required: true,
        },
        note: {
            type: String,
        },
        paidAt: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const TechniciansPayments = mongoose.model<ITechniciansPayments>(
    "TechniciansPayments",
    techniciansPaymentsSchema
);

export default TechniciansPayments;
