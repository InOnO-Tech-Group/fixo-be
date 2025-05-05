import express from 'express';
import bodyValidation from '../middlewares/validationMiddleware';
import { requestPaymentValidation } from '../modules/payment/validation/paymentalidation';
import { isUserAuthorized } from '../middlewares/userAuthorization';
import { paypackAuthentication } from '../middlewares/paymentMiddlewares';
import paymentControllers from '../modules/payment/controller/paymentControllers';

const paymentRoute = express.Router();

paymentRoute.post("/request-payment", isUserAuthorized(["technician", "admin"]), bodyValidation(requestPaymentValidation), paymentControllers.requestPaypackPayment);
paymentRoute.get("/get-all-tech-payments", isUserAuthorized(["admin"]), paymentControllers.findTechniciansPayments)
paymentRoute.get("/get-tech-payments", isUserAuthorized(["technician"]), paymentControllers.technicianFindOwnPayments)

export default paymentRoute;