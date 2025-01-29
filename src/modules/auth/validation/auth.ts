import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const verifyOTPSchema = Joi.object({
    userId: Joi.string().required(),
    otp: Joi.string().required(),
})