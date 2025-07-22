import mongoose, { Schema, Document } from "mongoose";
const { ObjectId } = mongoose.Schema;
export interface ICallSession extends Document {
  _id: mongoose.Types.ObjectId | string;
  userId: string;
  technicianId: string;
  startedAt: Date;
  endedAt: Date;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ICallSessionInput {
    userId: string;
    technicianId: string;
    startedAt: Date;
    endedAt: Date;
    duration?: number;
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
        type: ObjectId,
        ref: "users",
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
