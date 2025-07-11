import Joi from "joi";

export const requestPaymentValidation = Joi.object({
    amount: Joi.number().required().messages({
        "number.base": "Amount must be a number",
        "any.required": "Amount is required",
        "number.empty": "Amount cannot be empty",
        "number.min": "Amount must be greater than 0",
    }),
    payer: Joi.string().required().messages({
        "string.base": "Payer must be a string",
        "any.required": "Payer is required",
        "string.empty": "Payer cannot be empty",
    }),
    note: Joi.string().optional().messages({
        "string.base": "Note must be a string",
        "string.empty": "Note cannot be empty",
    })
})

export const techWithdrawValidation = Joi.object({
    amount: Joi.number().required().messages({
        "number.base": "Amount must be a number",
        "any.required": "Amount is required",
        "number.empty": "Amount cannot be empty",
        "number.min": "Amount must be greater than 0",
    }),
    phone: Joi.string().required().messages({
        "string.base": "Phone must be a string",
        "any.required": "Phone is required",
        "string.empty": "Phone cannot be empty",
    }),
    password: Joi.string().required().messages({
        "string.base": "Password must be a string",
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
    })
})

export const savePaymentSettingsSchema = Joi.object({
    serviceFee: Joi.number().required().messages({
        "number.base": "Service fee must be a number",
        "any.required": "Service fee is required",
        "number.empty": "Service fee cannot be empty",
    }),
    transactionFeeRate: Joi.number().required().messages({
        "number.base": "Transaction fee rate must be a number",
        "any.required": "Transaction fee rate is required",
        "number.empty": "Transaction fee rate cannot be empty",
    })
})