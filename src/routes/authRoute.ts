import express from "express"
import bodyValidation from "../middlewares/validationMiddleware"
import { loginSchema, updatePasswordSchema, updateProfileSchema, verifyOTPSchema } from "../modules/auth/validation/authValidations"
import authControllers from "../modules/auth/controller/authController"
import { isOTPEnabled, isOTPValid, isUserExistByEmail, isUserPasswordValid, isUserStatusValid } from "../middlewares/authMiddleware"
import { isUserAuthorized } from "../middlewares/userAuthorization"

const authRoute = express.Router()

authRoute.post("/login", bodyValidation(loginSchema), isUserExistByEmail, isUserPasswordValid, isUserStatusValid, isOTPEnabled, authControllers.userLogin)
authRoute.post("/verify-otp", bodyValidation(verifyOTPSchema), isOTPValid, authControllers.userLogin)

authRoute.get("/view-profile", isUserAuthorized(["All"]), authControllers.userViewProfile)
authRoute.put("/update-profile", isUserAuthorized(["All"]), bodyValidation(updateProfileSchema), authControllers.userUpdateProfile)

authRoute.put("/upload-profile-image", isUserAuthorized(["All"]), authControllers.uploadProfilePicture);
authRoute.put("/update-password", isUserAuthorized(["All"]), bodyValidation(updatePasswordSchema), isUserPasswordValid, authControllers.userUpdatePassword)

export default authRoute