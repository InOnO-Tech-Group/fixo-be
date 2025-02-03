import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import authRepository from "../modules/auth/repository/authRepository";
import { comparePassword, generateOTP, generateToken } from "../helpers/auth";
import { ExtendedRequest } from "../types/auth";
import { sendEmail } from "../services/emailService";

export const isUserExistByEmail = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;

  try {

    const user = await authRepository.findUserByAttribute("email", email);

    if (!user) {
      res.status(httpStatus.UNAUTHORIZED).json({
        status: httpStatus.UNAUTHORIZED,
        message: "User not found",
      });
      return
    }

    req.user = user;
    return next();
  } catch (error: any) {
    return next(error)
  }
};

export const isUserExistById = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {

    const user = await authRepository.findUserById(id);

    if (!user) {
      res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "User not found",
      });
      return
    }

    req.user = user;
    return next();
  } catch (error: any) {
    return next(error)
  }
};


export const isUserPasswordValid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { password } = req.body;
  const isPasswordMatch = await comparePassword(password, req.user ? req.user.password : "");

  try {
    if (!isPasswordMatch) {
      res.status(httpStatus.UNAUTHORIZED).json({
        status: httpStatus.UNAUTHORIZED,
        message: "Incorrect Password",
      });
      return;
    }
    next();
  } catch (error: any) {
    return next(error)
  }
};


export const isOTPEnabled = async (req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.otpEnabled) {
      const otp = generateOTP()

      await sendEmail(req.user.email, "OTP Verification", "OTP Verification", `Your OTP is <b>${otp}</b>. This OTP will expire in 1 hour.`);

      const session = await authRepository.saveSession({ userId: req?.user._id, content: otp });
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "OTP sent successfully",
        data: { session },
      });
      return;
    }
    return next();
  } catch (error) {
    return next(error)
  }
}

export const isOTPValid = async (req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, otp } = req.body;
    const session = await authRepository.findSessionByTwoAttributes("userId", userId, "content", otp)

    if (!session) {
      res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Invalid OTP",
      });
      return;
    }

    const user = await authRepository.findUserByAttribute("_id", userId);

    if (!user) {
      res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "User not found",
      });
      return;
    }

    await authRepository.deleteSession(session._id)

    req.user = user
    next();
  } catch (error) {
    return next(error);
  }
}