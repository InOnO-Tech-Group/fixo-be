import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  userId: string;
  Content: string;
}

const sessionSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
   
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model<ISession>("sessions", sessionSchema);

export default Session;
