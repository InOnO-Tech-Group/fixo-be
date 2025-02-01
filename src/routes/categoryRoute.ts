import express from "express"
import bodyValidation from "../middlewares/validationMiddleware";
import { categorySchema, categoryUpdateSchema } from "../modules/category/validation/categoryValidation";
import categoryController from "../modules/category/controller/categoryController";
import { isUserAuthorized } from "../middlewares/userAuthorization";
import { isCategoriesExist, isCategoryExistById, isSameCategoryExist, isSameCategoryOverlaping } from "../middlewares/categoryMiddleware";
const categoryRoute = express.Router();
categoryRoute.post("/",isUserAuthorized(["admin"]),bodyValidation(categorySchema),isSameCategoryExist,categoryController.createCategory)
categoryRoute.get("/",isCategoriesExist,categoryController.getAllCategories)
categoryRoute.get("/:id",isCategoryExistById,categoryController.getSingleCategory)
categoryRoute.put("/:id",isUserAuthorized(["admin"]),bodyValidation(categoryUpdateSchema),isCategoryExistById,isSameCategoryOverlaping,categoryController.updateCategory)
categoryRoute.delete("/:id",isUserAuthorized(["admin"]),bodyValidation(categoryUpdateSchema),isCategoryExistById,categoryController.deleteCategory)

export default categoryRoute;