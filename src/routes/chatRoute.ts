import express from "express";
import messageController from "../modules/message/controller/messageController";
import { isUserAuthorized } from "../middlewares/userAuthorization";
import bodyValidation from "../middlewares/validationMiddleware";
import { messageSchema } from "../modules/message/validation/messageValidation";
import { isUserExistById } from "../middlewares/authMiddleware";

const chatRoute = express.Router();

chatRoute.get("/chats",isUserAuthorized(["All"]),messageController.getMyChats)
chatRoute.post("/new",isUserAuthorized(["All"]), bodyValidation(messageSchema),messageController.sendMessage);
chatRoute.get("/:receiverId",isUserAuthorized(["All"]),messageController.getMessages);

export default chatRoute;
