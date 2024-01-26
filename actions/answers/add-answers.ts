"use server";

import { OptionsTypeSchema } from "@/components/forms/quiz-question-form";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const addAnswers = async (values: z.infer<typeof OptionsTypeSchema>, question_id: string) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  let count = 0;

  const optionsArray = values.map((value) => {
    value.is_correct && count++;
    return {
      ...value,
    };
  });

  if (count > 1) return { error: { message: "There must only be one correct answer" } };

  const { data: optionsInsertData, error: optionsInsertError } = await supabase.from("answers").insert(optionsArray).select();

  if (optionsInsertError || !optionsInsertData) return { data: optionsInsertData, error: optionsInsertError };

  const insertedOptionsArray = optionsInsertData.map((value) => {
    return {
      answer_id: value.id,
      question_id,
    };
  });

  const { data, error } = await supabase.from("question_answers").insert(insertedOptionsArray).select();

  return { data, error };
};

export default addAnswers;
