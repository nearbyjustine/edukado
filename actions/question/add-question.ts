"use server";

import { QuizFormSchema } from "@/components/forms/quiz-form";
import { QuizQuestionSchema } from "@/components/forms/quiz-question-form";
import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { cookies } from "next/headers";
import { z } from "zod";

const addQuestion = async (values: z.infer<typeof QuizQuestionSchema>, quiz_id: string) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { options, ...otherValues } = values;

  const { data, error: insertError } = await supabase
    .from("questions")
    .insert([{ ...otherValues, quiz_id }])
    .select()
    .single();

  await supabase.rpc("question_add_to_quiz_total_points", { points: values.points, quiz_id });

  return { data, error: insertError };
};

export default addQuestion;
