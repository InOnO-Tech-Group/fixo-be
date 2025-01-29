import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"
import categoryRepository from "../modules/category/repository/categoryRepository";

export const isSameCategoryExist = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {name} = req.body
          const category = await categoryRepository.findCategoryByName(name)
          if(category){
              res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.OK,
                message: "Same category already exist!",
              });
              return;
            }
            return next();
        }
       catch (error) {
        return next(error)
      }
    }