import mongoose from "mongoose";

export interface ISystemIncomeTracker {
    grossAmount: number;
    serviceFee: number;
    transactionFee: number;
    netIncome: number;
    type: 'in' | 'out';
    description: string;
}
const systemIncomeTrackerSchema = new mongoose.Schema<ISystemIncomeTracker>({
    grossAmount: {
        type: Number,
        required: true,
    },
    serviceFee: {
        type: Number,
        required: true,
    },
    transactionFee: {
        type: Number,
        required: true,
    },
    netIncome: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

const SystemIncomeTracker = mongoose.model<ISystemIncomeTracker>('SystemIncomeTracker', systemIncomeTrackerSchema);

export default SystemIncomeTracker;