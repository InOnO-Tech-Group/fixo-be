import mongoose, { Document } from "mongoose";
const { ObjectId } = mongoose.Schema;
export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId | string;
  senderId: mongoose.Types.ObjectId | string;
  receiverId: mongoose.Types.ObjectId | string;
  content: string;
  isRead: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      message?: IMessage;
      messages?: IMessage[];
    }
  }
}

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    receiverId: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("messages", MessageSchema);
export default Message;
