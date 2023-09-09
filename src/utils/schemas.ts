import { string } from "yup";

export const uuidSchema = string().uuid();

export const nameSchema  = string().min(4).max(50);
export const titleSchema = nameSchema;

