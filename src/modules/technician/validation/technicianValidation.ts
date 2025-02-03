import Joi from "joi";

export const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email:Joi.number().required(),
    username: Joi.string().required(),
    password: Joi.number().required(),
    role: Joi.array().required(),
    phone: Joi.number().required(),
});