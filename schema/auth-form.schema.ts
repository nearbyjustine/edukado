import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email({ message: "Email must be a valid email" }),
  password: z.string({ required_error: "Email is required" }).min(8, { message: "Password must have a minimum of 8 characters" }),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
