import mongoose, { Schema, Document, ObjectId } from "mongoose";
const { ObjectId } = mongoose.Schema;

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  description?: string;
  price: number;
  category: ObjectId;
  stock: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

declare global {
    namespace Express {
      interface Request {
        product?: IProduct;
        products?:IProduct[]
      }
    }
  }

const productSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: ObjectId,
      ref: "categories",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    images: {
      type: [String],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>("products", productSchema);

export default Product;
