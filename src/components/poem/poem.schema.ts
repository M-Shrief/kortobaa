import { object, boolean } from "yup";
import { uuidSchema, versesSchema, introSchema } from "../../utils/schemas";

export const createSchema = object({
  intro: introSchema.required(),
  poet: uuidSchema.required(),
  verses: versesSchema.required(),
  reviewed: boolean().default(true),
});

export const updateSchema = object({
  intro: introSchema.optional(),
  poet: uuidSchema.optional(),
  verses: versesSchema.optional(),
  reviewed: boolean().optional(),
});
