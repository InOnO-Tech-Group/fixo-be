import express from "express"
import callSessionController from "../modules/callSession/controller/callSessionController";

const callRoute = express.Router();

callRoute.get("/session-range", callSessionController.getCallSessionsInRange);

export default callRoute;
