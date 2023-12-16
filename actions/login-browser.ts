import { SignUpSchemaType } from "@/schema/auth-form.schema";
import { createClient } from "../utils/supabase/client";

export const logIn = async (formData: SignUpSchemaType) => {
  const supabase = createClient();

  // Sign in
  const { data, error } = await supabase.auth.signInWithPassword(formData);
  // console.log(data);
  // console.log(await supabase.auth.getUser());
  return error;
};
