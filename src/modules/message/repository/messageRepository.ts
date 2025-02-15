import mongoose from "mongoose";
import Message from "../../../database/models/message";
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
    .sort({ createdAt: -1 });
};
const getMyChats = async (userId: any) => {
  const allUsers = await User.find({ _id: { $ne: userId } }).select("firstName lastName username");

  const recentChats = await Message.aggregate([
    {
      $match: {
        $or: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: ["$senderId", userId] },
            then: "$receiverId",
            else: "$senderId"
          }
        },
        lastMessage: { $first: "$content" },
        lastMessageDate: { $first: "$createdAt" },
        lastMessageIsRead: { $first: "$isRead" }
      }
    }
  ]);

  const chatMap = new Map(recentChats.map(chat => [chat._id.toString(), chat]));

  const usersWithChatData = allUsers.map(user => {
    const chatData = chatMap.get(user._id.toString()) || {};
    return {
      userId: user._id,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      lastMessage: chatData.lastMessage || null,
      lastMessageDate: chatData.lastMessageDate || null,
      lastMessageIsRead: chatData.lastMessageIsRead ?? null
    };
  });

  return usersWithChatData.sort((a, b) => (b.lastMessageDate || 0) - (a.lastMessageDate || 0));
};

const getAllUsersForChat = async (userId: string) => {
  return await User.find({ _id: { $ne: userId } }).lean();
};

const markMessagesAsRead = async (senderId: string, receiverId: string) => {
  await Message.updateMany(
    { senderId: receiverId, receiverId: senderId, isRead: false },
    { $set: { isRead: true } }
  );
};



export default {
  sendMessage,
  getMessages,
  getMyChats,
  getAllUsersForChat,
  markMessagesAsRead
};
