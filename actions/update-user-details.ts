"use server";

import { User } from "@/lib/collection.types";
import { FormSchemaType } from "@/schema/onboarding-form.schema";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import moment from "moment";

export const updateUser = async (values: FormSchemaType) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!error && user) {
    const date = String(moment(new Date(values.birth_date)).format("YYYY-MM-D"));
    const { error: updateUserError } = await supabase
      .from("profiles")
      .update({ ...values, birth_date: date })
      .eq("id", user.id);
    return updateUserError;
  }

  return error;
};

export const updateUserHasOnboarded = async () => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!error && user) {
    const { error: updateUserError } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        hasOnboarded: true,
      },
    });

    return updateUserError;
  }

  return error;
};
