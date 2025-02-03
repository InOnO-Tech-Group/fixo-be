import Joi from "joi";

export const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email:Joi.string().required().email(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
    phone: Joi.string().required(),
});