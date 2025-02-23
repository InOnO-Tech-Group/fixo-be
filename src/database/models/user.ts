import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
  _id?: mongoose.Types.ObjectId | string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: string;
  otpEnabled?: boolean;
  phone?: string;
  status?: boolean;
  socketId?: string;
  profile?: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      users?: IUser[]
    }
  }
}

const userSchema: Schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    otpEnabled: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    socketId: {
      type: String,
      default: false
    },
    profile: {
      type: String,
      default: null,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("users", userSchema);

export default User;
