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

  export const isProductsExist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const products = await productRepository.findAllProducts();
  
      if (!products || products.length === 0) {
       res.status(httpStatus.NOT_FOUND).json({
          status: httpStatus.NOT_FOUND,
          message: "No products found!",
        });
        return ;
      }
  
      req.products = products;
      return next();
    } catch (error) {
      return next(error);
    }
  };

  export const isProductsExistByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {categoryId} = req.params
      const products = await productRepository.findProductsByCategory(categoryId);
  
      if (!products || products.length === 0) {
       res.status(httpStatus.NOT_FOUND).json({
          status: httpStatus.NOT_FOUND,
          message: "No products found!",
        });
        return ;
      }
  
      req.products = products;
      return next();
    } catch (error) {
      return next(error);
    }
  };
  
  export const isProductExistById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const product = await productRepository.findAllProductById(req.params.id);
  
      if (!product) {
       res.status(httpStatus.NOT_FOUND).json({
          status: httpStatus.NOT_FOUND,
          message: "No product found!",
        });
        return ;
      }
  
      req.product = product;
      return next();
    } catch (error) {
      return next(error);
    }
  };

  export const isSameProductOvelap = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name , category} = req.body;
      const product = await productRepository.findProductByNameAndId(req.params.id,name,category)
  
      if (product) {
        res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message: "Same product already exists!",
        });
        return;
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };