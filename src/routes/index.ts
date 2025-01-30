import express from "express"
import authRoute from "./authRoute";
import categoryRoute from "./categoryRoute";
import productRoute from "./productRoute";
const router = express.Router()
router.use("/auth",authRoute)
router.use("/category",categoryRoute)
router.use("/product",productRoute)

export default router;