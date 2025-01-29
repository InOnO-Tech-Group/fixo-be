import { Request } from "express";
import mongoose from "mongoose";


export interface ExtendedRequest extends Request {
}

export interface Sessions {
    userId: mongoose.Types.ObjectId | string;
    content: string;
}