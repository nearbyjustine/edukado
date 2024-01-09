"use server";

import { OptionsEditTypeSchema } from "@/components/forms/quiz-question-edit-form";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const addAnswers = async (values: z.infer<typeof OptionsEditTypeSchema>, question_id: string) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const optionsArray = values.map((value) => {
    return {
      ...value,
    };
  });

  const { data: optionsInsertData, error: optionsInsertError } = await supabase.from("answers").insert(optionsArray).select();

  if (optionsInsertError || !optionsInsertData) return { data: optionsInsertData, error: optionsInsertError };

  const insertedOptionsArray = optionsInsertData.map((value) => {
    return {
      answer_id: value.id,
      question_id,
    };
  });

  const { data, error } = await supabase.from("question_answers").insert(insertedOptionsArray);

  return { data, error };
};

export default addAnswers;
