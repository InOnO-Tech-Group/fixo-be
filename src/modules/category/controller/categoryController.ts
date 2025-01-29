import { Request, Response } from "express";
import httpStatus from "http-status";
import categoryRepository from "../repository/categoryRepository";

const createCategory = async (req: Request, res: Response) => {
    try {
        const categoryData = req.body
      const category = await categoryRepository.createCategory(categoryData)
  
      res.status(httpStatus.CREATED).json({
        status: httpStatus.CREATED,
        message: "Category created Successfully",
        data: category,
      });
    } catch (error: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error", error: error.message });
    }
  };
  export default {createCategory}