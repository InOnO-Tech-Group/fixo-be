import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const bodyValidation =
    (schema: Joi.ObjectSchema | Joi.ArraySchema) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { error } = schema.validate(req.body, { abortEarly: false });

                if (error) {
                    throw new Error(
                        error.details
                            .map((detail) => detail.message.replace(/"/g, ""))
                            .join(", ")
                    );
                }
                return next();
            } catch (error:any) {
                res
                    .status(400)
                    .json({ status: 400, message: error.message });
            }
        };

export default bodyValidation
