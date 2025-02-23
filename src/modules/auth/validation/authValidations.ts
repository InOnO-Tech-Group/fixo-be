import Joi from "joi";
import { mongooseToJoi } from "../../../utils/mongooseSchemaToJoi";
import User from "../../../database/models/user";

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const verifyOTPSchema = Joi.object({
    userId: Joi.string().required(),
    otp: Joi.string().required(),
})

export const updateProfileSchema = Joi.object({
    firstName: Joi.string().max(50),
    lastName: Joi.string().max(50),
    email: Joi.string().email().max(255).required().when("userId", { is: Joi.exist(), then: Joi.forbidden(), otherwise: Joi.allow() }),
    phone: Joi.string().max(20),
    role: Joi.string().max(150),
    username: Joi.string().max(50)
})

export const uploadProfileIMage = Joi.object({
    profile: Joi.string().required()
})