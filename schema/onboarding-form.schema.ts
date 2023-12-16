import { string, z } from "zod";

export const formSchema = z.object({
  first_name: z.string({ required_error: "First name is required", invalid_type_error: "Name must be a string" }).min(1, { message: "This field is required" }),
  middle_name: z.string({ required_error: "Middle name is required", invalid_type_error: "Name must be a string" }),
  last_name: z.string({ required_error: "Last name is required", invalid_type_error: "Name must be a string" }).min(1, { message: "This field is required" }),
  gender: z.string({ required_error: "Gender is required" }).min(1, { message: "This field is required" }),
  birth_date: z.date({ required_error: "Date of birth is required" }),
});

export type FormSchemaType = z.infer<typeof formSchema>;
