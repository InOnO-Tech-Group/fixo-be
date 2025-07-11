import { Request, Response } from "express";
import { generateToken, hashPassword } from "../../../helpers/auth";
import httpStatus from "http-status";
import authRepository from "../repository/authRepository";
import { ExtendedRequest } from "../../../types/auth";

const userLogin = async (req: ExtendedRequest, res: Response) => {
  try {
    const token = await generateToken(req?.user?._id);
    const sessionData = { userId: req?.user?._id || "", content: token || "" };

    const session = await authRepository.saveSession(sessionData)

    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Login successful",
      data: session,
    });
  } catch (error: any) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

const userViewProfile = async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "User profile retrieved successfully",
      data: req.user,
    })
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message, status: httpStatus.INTERNAL_SERVER_ERROR })
  }
}

const userUpdateProfile = async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {
    const updatedUser = await authRepository.updateUser(req.user?._id, req.body)
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "User profile updated successfully",
      data: updatedUser,
    })
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message, status: httpStatus.INTERNAL_SERVER_ERROR })
  }
}
const uploadProfilePicture = async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {
    const profile = authRepository.updateUser(req.user?._id, { profile: req.body.profile });

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Profile picture updated successfully",
      data: profile,
    })
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message, status: httpStatus.INTERNAL_SERVER_ERROR })
  }
}
const userUpdatePassword = async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {
    const hashedPassword = await hashPassword(req.body.newPassword);

    const updatedUser = await authRepository.updateUser(req.user?._id, { password: hashedPassword });

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Password updated successfully",
      data: updatedUser,
    })
  } catch (error: any) {
    console.log(error)
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message, status: httpStatus.INTERNAL_SERVER_ERROR })
  }
}


export default {
  userLogin,
  userViewProfile,
  userUpdateProfile,
  uploadProfilePicture,
  userUpdatePassword
};