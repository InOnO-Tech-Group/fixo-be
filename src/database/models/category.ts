import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
    namespace Express {
      interface Request {
        category?: ICategory;
        categories:ICategory[]
      }
    }
  }

const categorySchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<ICategory>("categories", categorySchema);

export default Category;
