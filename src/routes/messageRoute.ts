import express from "express";
import messageController from "../modules/message/controller/messageController";
import { isUserAuthorized } from "../middlewares/userAuthorization";
import bodyValidation from "../middlewares/validationMiddleware";
import { messageSchema } from "../modules/message/validation/messageValidation";
const messageRoute = express.Router();
messageRoute.post("/new",isUserAuthorized(["All"]), bodyValidation(messageSchema),messageController.sendMessage);
messageRoute.get("/:receiverId",isUserAuthorized(["All"]), messageController.getMessages);
export default messageRoute;
