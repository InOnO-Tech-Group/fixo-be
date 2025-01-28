import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import authRepository from "../modules/auth/repository/authRepository";
import { comparePassword } from "../helpers/auth";

export const isUserExistByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "User not found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const isUserPasswordValid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { password } = req.body;
  const isPasswordMatch = await comparePassword(password, req.user?req.user.password:"");

  try {
    if (!isPasswordMatch) {
      res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "User not found",
      });
      return;
    }
    next();
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
