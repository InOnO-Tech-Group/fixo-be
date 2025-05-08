import mongoose from 'mongoose';

export interface ITechniciansWithdraws {
  withdrawId: string;
  technician: mongoose.Types.ObjectId;
  amount: number;
  oldBalance: number;
  newBalance: number;
  phone: string;
  note: string;
  status: 'pending' | 'paid' | 'failed';
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      technicianWithdraw?: ITechniciansWithdraws;
      technicianWithdraws?: ITechniciansWithdraws[];
    }
  }
}

const techniciansWithdrawsSchema: mongoose.Schema = new mongoose.Schema(
  {
    withdrawId: {
      type: String,
      unique: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    oldBalance: {
      type: Number,
      required: true,
    },
    newBalance: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const TechniciansWithdraws = mongoose.model<ITechniciansWithdraws>(
  'TechniciansWithdraws',
  techniciansWithdrawsSchema
);

export default TechniciansWithdraws;