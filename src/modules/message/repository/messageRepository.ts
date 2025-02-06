import mongoose from "mongoose";
import Message, { IMessage } from "../../../database/models/message";

const sendMessage = async (senderId: mongoose.ObjectId, receiverId: string, content: string) => {
    return await Message.create({ senderId, receiverId, content });
};
const getMessages = async (senderId: string, receiverId: string) => {
  return await Message.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  }).sort({ createdAt: 1 });
};

export default { sendMessage, getMessages };
