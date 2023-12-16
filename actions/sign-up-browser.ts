import { SignUpSchemaType } from "@/schema/auth-form.schema";
import { createClient } from "../utils/supabase/client";

export const signUp = async (formData: SignUpSchemaType) => {
  const supabase = createClient();

  // Sign up
  const { error } = await supabase.auth.signUp({
    ...formData,
    options: {
      data: {
        hasOnboarded: false,
        role: "teacher",
      },
    },
  });

  return error;
};
