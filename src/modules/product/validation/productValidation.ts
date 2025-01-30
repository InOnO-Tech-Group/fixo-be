import Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price:Joi.number().required(),
    category: Joi.string().required().uuid(),
    stock: Joi.number().required(),
    images: Joi.array().required(),
});