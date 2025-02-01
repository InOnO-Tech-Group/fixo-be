import Joi from "joi";

export const categorySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
});
export const categoryUpdateSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
});

