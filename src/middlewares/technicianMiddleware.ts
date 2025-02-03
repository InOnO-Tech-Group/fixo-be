import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"
import technicianRepository from "../modules/technician/repository/technicianRepository";
export const isSameuserEmailRegisterd = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email} = req.body;
      const user = await technicianRepository.findUseraByEmail(email)
  
      if (user) {
        res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message: "This email already used!",
        });
        return;
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
  export const isSameuserNameRegistered = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username} = req.body;
      const user = await technicianRepository.findUserByUsername(username)
  
      if (user) {
        res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message: "This username already taken!",
        });
        return;
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };