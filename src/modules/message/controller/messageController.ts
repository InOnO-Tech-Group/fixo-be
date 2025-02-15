import { Request, Response } from "express";
import messageRepository from "../repository/messageRepository";
import httpStatus from "http-status";
import { io } from "../../..";
import { users } from "../../../services/socketService";
import authRepository from "../../auth/repository/authRepository";

const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user ? req.user._id : req.body.senderId;
    const message = await messageRepository.sendMessage(senderId, receiverId, content);

    const receiverSocketId = users[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", { senderNames: `${req?.user?.firstName} ${req?.user?.lastName}`, senderId, message });
    }

    res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};


const getMessages = async (req: Request, res: Response) => {
  try {

    const { receiverId } = req.params;
    const senderId = req.user ? req.user._id : req.body.senderId;

    const messages = await messageRepository.getMessages(senderId, receiverId);

    await messageRepository.markMessagesAsRead(senderId, receiverId);

    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
    });
  }
};


const getMyChats = async (req: Request, res: Response) => {
  try {
    const chats = await messageRepository.getMyChats(
      req.user ? req.user._id : req.body.senderId
    );

    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Your Chats retrieved successfully",
      data: chats,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


const getChatsLists = async (req: any, res: Response): Promise<any> => {
  try {
    const users = await authRepository.findAllUsers();

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Users retrieved successfully",
      data: { users },
    });
  } catch (error: any) {
    console.error("Error fetching users:", error.message);

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

export default {
  sendMessage,
  getMessages,
  getMyChats,
  getChatsLists
};
