import express from "express"
import authRoute from "./authRoute";
import categoryRoute from "./categoryRoute";
import productRoute from "./productRoute";
import technicianRoute from "./technicianRoute";
import chatRoute from "./chatRoute";
import paymentRoute from "./paymentRoute";
import callRoute from "./callRoute";

const router = express.Router()

router.use("/auth", authRoute)
router.use("/category", categoryRoute)
router.use("/product", productRoute)
router.use("/technician", technicianRoute)
router.use("/messages", chatRoute)
router.use("/payments", paymentRoute)
router.use("/call",callRoute)

export default router;