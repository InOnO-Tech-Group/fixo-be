import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import categoryRepository from "../modules/category/repository/categoryRepository";

export const isSameCategoryExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name } = req.body;
    const category = await categoryRepository.findCategoryByName(name);

    if (category) {
      res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Same category already exists!",
      });
      return;
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export const isSameCategoryOverlaping = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name } = req.body;
      const category = await categoryRepository.findCategoryByNameAndId(req.params.id,name);
  
      if (category) {
        res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message: "Same category with same name!",
        });
        return;
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };

export const isCategoriesExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await categoryRepository.findAllCategories();

    if (!categories || categories.length === 0) {
     res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "No categories found!",
      });
      return ;
    }

    req.categories = categories;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const isCategoryExistById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await categoryRepository.findCategoryById(id);

    if (!category) {
      res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "Category not found!",
      });
      return;
    }

    req.category = category;
    return next();
  } catch (error) {
    return next(error);
  }
};
