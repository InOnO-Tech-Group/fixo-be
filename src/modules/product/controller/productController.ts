import { Request, Response } from "express";
import httpStatus from "http-status";
import productRepository from "../repository/productRepository";

const createProduct = async (req: Request, res: Response) => {
    try {
        const productData = req.body
      const product = await productRepository.createProduct(productData)
  
      res.status(httpStatus.CREATED).json({
        status: httpStatus.CREATED,
        message: "Product created Successfully",
        data: product,
      });
    } catch (error: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error", error: error.message });
    }
  };

  const viewAvailableProducts = async (req: Request, res: Response) => {
    try {
  
      res.status(httpStatus.CREATED).json({
        status: httpStatus.CREATED,
        message: "Product retrieved Successfully",
        data: req.products,
      });
    } catch (error: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error", error: error.message });
    }
  };

  export default {createProduct, viewAvailableProducts}
