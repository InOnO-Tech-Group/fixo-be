import express from "express"
import bodyValidation  from "../middlewares/validationMiddleware"
import { loginSchema } from "../modules/auth/validation/auth"
import auth from "../modules/auth/controller/auth"
import { isUserPasswordValid } from "../middlewares/authMiddleware"
const authRoute = express.Router()
authRoute.post("/login",bodyValidation(loginSchema),isUserPasswordValid,auth.userLogin)
export default authRoute