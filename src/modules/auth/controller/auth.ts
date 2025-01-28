import { Request, Response } from "express";
import { generateToken } from "../../../helpers/auth";
import httpStatus from "http-status";
import authRepository from "../repository/authRepository";

const userLogin = async (req: Request, res: Response) => {
  try {
    const token =await generateToken(req.user._id);
    const sessionData ={userId:req.user._id,content:token}
    const session = await authRepository.saveSession(sessionData)

    res.status(httpStatus.OK).json({
      status:httpStatus.OK,
      message: "Login successful",
      data:session,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export default { userLogin };
