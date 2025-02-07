import mongoose from "mongoose";
import Message, { IMessage } from "../../../database/models/message";
import User from "../../../database/models/user";

const sendMessage = async (
  senderId: mongoose.ObjectId,
  receiverId: string,
  content: string
) => {
  return await Message.create({ senderId, receiverId, content });
};
const getMessages = async (senderId: string, receiverId: string) => {
  return await Message.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  })
    .populate("senderId")
    .populate("receiverId")
    .sort({ createdAt: 1 });
};

const getMyChats = async (senderId: string) => {
  return await Message.find({
    $or: [{ senderId }, { receiverId: senderId }],
  })
    .populate("senderId")
    .populate("receiverId")
    .sort({ createdAt: 1 });
};

const getAllUsersForChat = async (userId: string) => {
  // Get all unique users who have chatted with the current user
  const chattedUsers = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  })
    .distinct("senderId")
    .then((senders) =>
      Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] })
        .distinct("receiverId")
        .then((receivers) => [...new Set([...senders, ...receivers])])
    );

  // Fetch all users except the current user
  const users = await User.find({ _id: { $ne: userId } }).lean();

  // Sort: Users who have chatted first
  const sortedUsers = users.sort((a:any, b:any) => {
    const aChatted = chattedUsers.includes(a._id.toString()) ? -1 : 1;
    const bChatted = chattedUsers.includes(b._id.toString()) ? -1 : 1;
    return aChatted - bChatted;
  });

  return sortedUsers;
};




export default { sendMessage, getMessages, getMyChats, getAllUsersForChat };
