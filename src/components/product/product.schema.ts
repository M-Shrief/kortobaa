import { number, object, string } from "yup";
import { titleSchema, uuidSchema } from "../../utils/schemas";

const priceSchema = number().moreThan(0)
const imageBase64 = string().matches(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/)

export const createSchema = object({
    title: titleSchema.required(),
    price: priceSchema.required(),
    user: uuidSchema.required(),
    image: imageBase64.required(),
});
  
export const updateSchema = object({
    title: titleSchema.optional(),
    price: priceSchema.optional(),
    user: uuidSchema.optional(),
    image: imageBase64.optional(),
});
