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