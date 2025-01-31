import express from "express"
import { isUserAuthorized } from "../middlewares/userAuthorization";
import { isProductExistById, isProductsExist, isProductsExistByCategory, isSameProductExist, isSameProductOvelap } from "../middlewares/productMiddleware";
import bodyValidation from "../middlewares/validationMiddleware";
import { productSchema, updateProductSchema } from "../modules/product/validation/productValidation";
import productController from "../modules/product/controller/productController";
const productRoute = express.Router()
productRoute.post("/",isUserAuthorized(["admin"]),bodyValidation(productSchema),isSameProductExist,productController.createProduct)
productRoute.get("/",isProductsExist,productController.viewAvailableProducts)
productRoute.get("/:categoryId",isProductsExistByCategory,productController.viewAvailableProducts)
productRoute.get("/:id",isProductExistById,productController.viewSingleProduct)
productRoute.put("/:id",isUserAuthorized(["admin"]),bodyValidation(updateProductSchema),isProductExistById,isSameProductOvelap,productController.updateProduct)
productRoute.delete("/:id",isUserAuthorized(["admin"]),isProductExistById,productController.deleteProduct)

export default productRoute;