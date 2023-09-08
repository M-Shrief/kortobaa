import { object, boolean } from "yup";
import { nameSchema, timePeriodSchema, bioSchema } from "../../utils/schemas";

export const createSchema = object({
  name: nameSchema.required(),
  time_period: timePeriodSchema.required(),
  bio: bioSchema.required(),
  reviewed: boolean().default(true),
});

export const updateSchema = object({
  name: nameSchema.optional(),
  time_period: timePeriodSchema.optional(),
  bio: bioSchema.optional(),
  reviewed: boolean().optional(),
});
