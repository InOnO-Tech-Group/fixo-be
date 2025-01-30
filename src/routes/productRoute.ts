import express from "express"
import { isUserAuthorized } from "../middlewares/userAuthorization";
import { isSameProductExist } from "../middlewares/productMiddleware";
import bodyValidation from "../middlewares/validationMiddleware";
import { productSchema } from "../modules/product/validation/productValidation";
import productController from "../modules/product/controller/productController";
const productRoute = express.Router()
productRoute.post("/",isUserAuthorized(["admin"]),bodyValidation(productSchema),isSameProductExist,productController.createProduct)
export default productRoute;