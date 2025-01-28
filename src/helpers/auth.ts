import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}

export const generateToken = async (_id: any) => {
  return await jwt.sign({ _id }, process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
};