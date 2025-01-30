import { Request, Response } from "express";
import httpStatus from "http-status";
import productRepository from "../repository/productRepository";

const createProduct = async (req: Request, res: Response) => {
    try {
        const productData = req.body
      const category = await productRepository.createProduct(productData)
  
      res.status(httpStatus.CREATED).json({
        status: httpStatus.CREATED,
        message: "Product created Successfully",
        data: category,
      });
    } catch (error: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error", error: error.message });
    }
  };

  export default {createProduct}
