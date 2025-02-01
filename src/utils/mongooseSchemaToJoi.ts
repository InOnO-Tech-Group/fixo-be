import Joi from "joi";
import { Schema } from "mongoose";

export const mongooseToJoi = (schema: Schema) => {
    const joiSchema: Record<string, any> = {};

    schema.eachPath((path, type) => {
        if (path === "_id" || path === "__v") return; // Ignore Mongoose-specific fields

        switch (type.instance) {
            case "String":
                if ((type.options as any).enum) {
                    joiSchema[path] = Joi.string().valid(...(type.options as any).enum);
                } else {
                    joiSchema[path] = Joi.string();
                }
                break;
            case "Number":
                joiSchema[path] = Joi.number();
                break;
            case "Boolean":
                joiSchema[path] = Joi.boolean();
                break;
            case "Date":
                joiSchema[path] = Joi.date();
                break;
            case "Array":
                joiSchema[path] = Joi.array();
                break;
            case "ObjectId":
                joiSchema[path] = Joi.string().hex().length(24); // Mongoose ObjectId
                break;
            default:
                joiSchema[path] = Joi.any();
        }

        if ((type.options as any).required) {
            joiSchema[path] = joiSchema[path].required();
        }
    });

    return Joi.object(joiSchema);
};
