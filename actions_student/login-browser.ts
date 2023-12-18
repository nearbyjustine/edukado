import { SignUpSchemaType } from "@/schema/auth-form.schema";
import { createClient } from "../utils/supabase/client";

export const logIn = async (formData: SignUpSchemaType) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword(formData);
  return error;
};
