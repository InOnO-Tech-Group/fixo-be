import mongoose, { Schema, Document } from "mongoose";

export interface ICallSession extends Document {
  _id: mongoose.Types.ObjectId | string;
  userId: string;
  technicianId: string;
  startedAt: Date;
  endedAt: Date;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      callSession?: ICallSession;
      callSessions?: ICallSession[];
    }
  }
}

const callSessionSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    technicianId: {
      type: String,
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const CallSession = mongoose.model<ICallSession>("CallSession", callSessionSchema);

export default CallSession;
