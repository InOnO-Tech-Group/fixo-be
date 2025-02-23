import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../helpers/auth";
import authRepository from "../modules/auth/repository/authRepository";
import { IUser } from "../database/models/user";
import { ISession } from "../database/models/session";
import technicianRepository from "../modules/technician/repository/technicianRepository";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      session?: ISession;
    }
  }
}

export const isUserAuthorized = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        res.status(httpStatus.UNAUTHORIZED).json({
          status: httpStatus.UNAUTHORIZED,
          message: "No token provided",
        });
        return;
      }

      const decoded: any = await decodeToken(token)
      const session = await authRepository.findSessionByTwoAttributes(
        "userId",
        decoded._id,
        "content",
        token
      );

      if (!session) {
        res.status(httpStatus.UNAUTHORIZED).json({
          status: httpStatus.UNAUTHORIZED,
          message: "Session expired!",
        });
        return;
      }

      const user = await authRepository.findUserById(decoded._id);

      if (!user) {
        res.status(httpStatus.UNAUTHORIZED).json({
          status: httpStatus.UNAUTHORIZED,
          message: "User not found!",
        });
        return;
      }

      if (!(user.status)) {
        res.status(httpStatus.UNAUTHORIZED).json({
          status: httpStatus.UNAUTHORIZED,
          message: "User is disabled for access, contact system admin for support!",
        });
        return;
      }

      if (!roles.includes(String(user?.role)) && !roles.includes("All")) {
        res.status(httpStatus.UNAUTHORIZED).json({
          status: httpStatus.UNAUTHORIZED,
          message: "Invalid user role!",
        });
        return;
      }

      req.user = user;
      req.session = session;
      return next();
    } catch (error: any) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  };
};
