import { Request, Response } from "express";
import messageRepository from "../repository/messageRepository";
import httpStatus from "http-status";
import { io } from "../../..";

const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, content } = req.body;
    const message = await messageRepository.sendMessage(
      req.user ? req.user._id : req.body.senderId,
      receiverId,
      content
    );

    /* io.to(receiverId).emit("receiveMessage", message);*/

    res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getMessages = async (req: Request, res: Response) => {
  try {
    const { receiverId } = req.params;
    const messages = await messageRepository.getMessages(
      req.user ? req.user._id : req.body.senderId,
      receiverId
    );
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Message retrieved successfully",
      data: messages,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getMyChats = async (req: Request, res: Response) => {
  try {
    const chats = await messageRepository.getAllUsersForChat(
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
export default { sendMessage, getMessages, getMyChats };
