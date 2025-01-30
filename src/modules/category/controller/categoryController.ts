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

  
  const getAllCategories = async (req: Request, res: Response) => {
    try {
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "Categories retrieved successfully!",
        data: req.categories,
      });
      return;
    } catch (error: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error", error: error.message });
    }
  };

  const getSingleCategory = async (req: Request, res: Response) => {
    try {
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "Categories retrieved successfully!",
        data: req.category,
      });
      return;
    } catch (error: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error", error: error.message });
    }
  };

  const updateCategory = async (req: Request, res: Response) => {
    try {
        const categoryData = req.body
      const category = await categoryRepository.updateCategory(req.params.id,categoryData)
  
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "Category Updated Successfully",
        data: category,
      });
    } catch (error: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error", error: error.message });
    }
  };

  const deleteCategory = async (req: Request, res: Response) => {
    try {
      await categoryRepository.deleteCategory(req.params.id)
  
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "Category deleted Successfully",
      });
    } catch (error: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error", error: error.message });
    }
  };


  export default {createCategory, getAllCategories,getSingleCategory,updateCategory,deleteCategory}