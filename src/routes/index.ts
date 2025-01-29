import express from "express"
import authRoute from "./authRoute";
import categoryRoute from "./categoryRoute";
const router = express.Router()
router.use("/auth",authRoute)
router.use("/category",categoryRoute)

export default router;