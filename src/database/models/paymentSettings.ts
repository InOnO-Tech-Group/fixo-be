import mongoose, { Document, Schema } from "mongoose"

export interface IPaymentSettings extends Document {
    serviceFee: number,
    transactionFeeRate: number
}

const PaymentSettingsSchema: Schema = new Schema({
    serviceFee: {
        type: Number,
        required: true,
        default: 3.0,
    },
    transactionFeeRate: {
        type: Number,
        required: true,
        default: 2.3,
    }
}, {
    timestamps: true
})

const PaymentSettings = mongoose.model<IPaymentSettings>('PaymentSettings', PaymentSettingsSchema)

export default PaymentSettings