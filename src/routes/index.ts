import express from "express"
import authRoute from "./authRoute";
import categoryRoute from "./categoryRoute";
import productRoute from "./productRoute";
import technicianRoute from "./technicianRoute";
import chatRoute from "./chatRoute";
const router = express.Router()
router.use("/auth",authRoute)
router.use("/category",categoryRoute)
router.use("/product",productRoute)
router.use("/technician",technicianRoute)
router.use("/messages",chatRoute)
export default router;