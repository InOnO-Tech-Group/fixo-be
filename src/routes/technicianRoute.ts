import express from "express"
import bodyValidation from "../middlewares/validationMiddleware";
import { userSchema } from "../modules/technician/validation/technicianValidation";
import { isAnyTechnician, isSameuserEmailRegisterd, isSameuserNameRegistered } from "../middlewares/technicianMiddleware";
import technicianController from "../modules/technician/controller/technicianController";
import { isUserAuthorized } from "../middlewares/userAuthorization";
import { isUserExistById } from "../middlewares/authMiddleware";

const technicianRoute = express.Router()
technicianRoute.post("/new",isUserAuthorized(["admin"]),bodyValidation(userSchema),isSameuserEmailRegisterd,isSameuserNameRegistered,technicianController.addNewTechnician)
technicianRoute.put("/status/:id",isUserAuthorized(["admin"]),isUserExistById,technicianController.updateTechnicianStatus)
technicianRoute.get("/",isUserAuthorized(["admin"]),isAnyTechnician,technicianController.getAllTechnicians)


export default technicianRoute;