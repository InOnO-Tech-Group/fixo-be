import Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price:Joi.number().required(),
    category: Joi.string().required(),
    stock: Joi.number().required(),
    images: Joi.array().required(),
});

export const updateProductSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    price:Joi.number(),
    category: Joi.string(),
    stock: Joi.number(),
    images: Joi.array(),
});