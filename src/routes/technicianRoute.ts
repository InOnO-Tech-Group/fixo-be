import express from "express"
import bodyValidation from "../middlewares/validationMiddleware";
import { userSchema } from "../modules/technician/validation/technicianValidation";
import { isSameuserEmailRegisterd, isSameuserNameRegistered } from "../middlewares/technicianMiddleware";
import technicianController from "../modules/technician/controller/technicianController";
import { isUserAuthorized } from "../middlewares/userAuthorization";

const technicianRoute = express.Router()
technicianRoute.post("/new",isUserAuthorized(["admin"]),bodyValidation(userSchema),isSameuserEmailRegisterd,isSameuserNameRegistered,technicianController.addNewTechnician)

export default technicianRoute;