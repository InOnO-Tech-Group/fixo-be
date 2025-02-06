import { Request, Response } from "express";
import messageRepository from "../repository/messageRepository";
import httpStatus from "http-status";

const sendMessage = async (req: Request, res: Response)=> {
  try {
    const { receiverId, content } = req.body;
    const message = await messageRepository.sendMessage(req.user?req.user._id:req.body.senderId, receiverId, content);

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
    const messages = await messageRepository.getMessages(req.user?req.user._id:req.body.senderId, receiverId);
    res.status(httpStatus.OK).json({
        status: httpStatus.CREATED,
        message: "Message retrieved successfully",
        data: messages,
      });
  } catch (error:any) {
    res.status(500).json({ error: error.message});
  }
};

export default { sendMessage,getMessages };
