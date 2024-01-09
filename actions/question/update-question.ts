"use server";

import { QuizFormSchema } from "@/components/forms/quiz-form";
import { QuizQuestionEditSchema } from "@/components/forms/quiz-question-edit-form";
import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { cookies } from "next/headers";
import { z } from "zod";

const updateQuestion = async (values: z.infer<typeof QuizQuestionEditSchema>, question_id: string) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { options, option_count, ...otherValues } = values;

  const { data, error: insertError } = await supabase
    .from("questions")
    .update({ ...otherValues })
    .eq("id", question_id)
    .select();

  console.log(data, insertError);

  return { data, error: insertError };
};

export default updateQuestion;
