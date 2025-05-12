import mongoose from "mongoose";

export interface IAdminWithdrawal extends mongoose.Document {
    amount: number;
    status: string;
    user: mongoose.Types.ObjectId;
    transactionId: string;
}

const AdminWithdrawalSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const AdminWithdrawal = mongoose.model<IAdminWithdrawal>("AdminWithdrawal", AdminWithdrawalSchema);

export default AdminWithdrawal;