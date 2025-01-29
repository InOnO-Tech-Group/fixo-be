import express from "express"
import { isSameCategoryExist } from "../middlewares/categoryMiddleware";
import bodyValidation from "../middlewares/validationMiddleware";
import { categorySchema } from "../modules/category/validation/categoryValidation";
import categoryController from "../modules/category/controller/categoryController";
const categoryRoute = express.Router();
categoryRoute.post("/",bodyValidation(categorySchema),isSameCategoryExist,categoryController.createCategory)
export default categoryRoute;