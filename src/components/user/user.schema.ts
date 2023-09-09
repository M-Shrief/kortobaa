import { object, string } from "yup";
import { nameSchema } from "../../utils/schemas";

const passwordSchema = string().min(4).max(100);
const phoneSchema = string().min(4).max(20);

export const createSchema = object({
  name: nameSchema.required(),
  phone: phoneSchema.required(),
  password: passwordSchema.required(),
});

export const updateSchema = object({
  name: nameSchema.optional(),
  phone: phoneSchema.optional(),
  password: passwordSchema.optional(),
});
