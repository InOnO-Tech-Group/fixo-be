import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
}

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
}

export const generateToken = async (_id: any) => {
  return jwt.sign({ _id }, jwtSecret);
};

export const generateOTP = (): string => {
  const otp = Math.floor(Math.random() * 1000000);

  return otp.toString().padStart(6, '0');
}