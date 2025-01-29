import express from "express"
import bodyValidation from "../middlewares/validationMiddleware"
import { loginSchema, verifyOTPSchema } from "../modules/auth/validation/auth"
import authControllers from "../modules/auth/controller/auth"
import { isOTPEnabled, isOTPValid, isUserExistByEmail, isUserPasswordValid } from "../middlewares/authMiddleware"

const authRoute = express.Router()

authRoute.post("/login", bodyValidation(loginSchema), isUserExistByEmail, isUserPasswordValid, isOTPEnabled, authControllers.userLogin)
authRoute.post("/verify-otp", bodyValidation(verifyOTPSchema), isOTPValid, authControllers.userLogin)

export default authRoute