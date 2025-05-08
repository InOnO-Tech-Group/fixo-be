import express from 'express';
import bodyValidation from '../middlewares/validationMiddleware';
import { requestPaymentValidation, techWithdrawValidation } from '../modules/payment/validation/paymentalidation';
import { isUserAuthorized } from '../middlewares/userAuthorization';
import paymentControllers from '../modules/payment/controller/paymentControllers';
import { isUserPasswordValid } from '../middlewares/authMiddleware';

const paymentRoute = express.Router();

paymentRoute.post("/request-payment", isUserAuthorized(["technician", "admin"]), bodyValidation(requestPaymentValidation), paymentControllers.requestPaypackPayment);
paymentRoute.get("/get-all-tech-payments", isUserAuthorized(["admin"]), paymentControllers.findTechniciansPayments)
paymentRoute.get("/get-tech-payments", isUserAuthorized(["technician", "admin"]), paymentControllers.technicianFindOwnPayments)

paymentRoute.put("/tech-withdraw-money", isUserAuthorized(["technician", "admin"]), isUserPasswordValid, bodyValidation(techWithdrawValidation), paymentControllers.technicianWithdrawMoney)
paymentRoute.get("/get-tech-withdrawals", isUserAuthorized(["technician", "admin"]), paymentControllers.technicianFindOwnWithdrawals)

paymentRoute.get("/get-all-tech-withdraws",isUserAuthorized(["admin"]), paymentControllers.findTechniciansWithdraws)
export default paymentRoute;