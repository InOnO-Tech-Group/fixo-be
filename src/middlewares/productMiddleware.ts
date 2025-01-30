import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"
import productRepository from "../modules/product/repository/productRepository";

export const isSameProductExist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name , category} = req.body;
      const categori = await productRepository.findProductyByNameAndCategory(name,category)
  
      if (categori) {
        res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message: "Same Product already exists!",
        });
        return;
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
  