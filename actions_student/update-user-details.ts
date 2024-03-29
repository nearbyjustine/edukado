"use server";

import { User } from "@/lib/collection.types";
import { FormSchemaType } from "@/schema/onboarding-form.schema";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import moment from "moment";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";

type FormSchemaTypeWithoutAvatar = Omit<FormSchemaType, "avatar_image">;

export const updateUser = async (values: FormSchemaTypeWithoutAvatar, avatar_url?: string) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return error;
  }

  const date = moment(new Date(values.birth_date)).format("YYYY-MM-D");
  const { error: updateUserError } = await supabase
    .from("profiles")
    .update({ ...values, birth_date: date, avatar_url: avatar_url || "" })
    .eq("id", user.id);

  return updateUserError;
};
export const updateStudentUser = async (values: FormSchemaTypeWithoutAvatar, grade_level: string, section: string) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return error;
  }

  const { data: classroomData, error: classroomError } = await supabase.from("classrooms").select().eq("grade_level", grade_level).eq("section", section).single();

  if (classroomError || !classroomData) return classroomError;

  const date = moment(new Date(values.birth_date)).format("YYYY-MM-D");
  console.log(values);
  const { error: updateUserError } = await supabase
    .from("profiles")
    .update({ ...values, birth_date: date })
    .eq("id", user.id);

  if (updateUserError) return updateUserError;

  const { error: insertStudentError } = await supabase.from("students").insert({ classroom_id: classroomData.id, user_id: user.id });

  if (insertStudentError) return insertStudentError;

  return null;
};

export const updateUserHasOnboarded = async () => {
  const cookieStore = cookies();
  // SSR
  const supabase = await createClient(cookieStore);
  // AUTH HELPER
  // const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

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

export const uploadAvatarImageTeacher = async (data: FormData) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return error;
  }
  // const fileFormat = ;
  const response = await supabase.storage.from("avatar").upload(`avatar_${user.id}_${Date.now()}.`, data);
  return response;
};
