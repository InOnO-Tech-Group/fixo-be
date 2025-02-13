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
    .sort({ createdAt: 1 });
};

const getMyChats = async (userId: any) => {
  const recentChats = await Message.aggregate([
    {
      $match: {
        $or: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: ["$senderId", userId] },
            then: "$receiverId", // Group by receiver if the current user is the sender
            else: "$senderId" // Group by sender if the current user is the receiver
          }
        },
        lastMessage: { $first: "$content" }, // Get the content of the last message
        lastMessageDate: { $first: "$createdAt" }, // Get the timestamp of the last message
        lastMessageIsRead: { $first: "$isRead" } // Get the read status of the last message
      }
    },
    {
      $lookup: {
        from: "users", // Assuming the users are stored in a 'users' collection
        localField: "_id", // The user you're chatting with
        foreignField: "_id", // The user's ID in the 'users' collection
        as: "userInfo"
      }
    },
    {
      $unwind: "$userInfo" // Unwind the user data to access individual fields
    },
    {
      $project: {
        userId: "$_id",
        firstName: "$userInfo.firstName",
        lastName: "$userInfo.lastName",
        username: "$userInfo.username", // Assuming there's a 'username' field
        lastMessage: 1,
        lastMessageDate: 1,
        lastMessageIsRead: 1
      }
    }, { $sort: { lastMessageDate: -1 } }
  ]);

  return recentChats;


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
