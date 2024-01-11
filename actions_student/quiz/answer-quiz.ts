"use server";

import { QuizStudentAnswerSchema } from "@/components_student/forms/answer-quiz-form";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const answerQuiz = async (values: z.infer<typeof QuizStudentAnswerSchema>) => {
  const { questions } = values;

  const cookieServer = cookies();
  const supabase = createClient(cookieServer);

  questions.map(async (question, index) => {
    const { data, error } = await supabase.from("answers").select("*, question_answers!inner (questions(*))").eq("question_answers.question_id", question.question_id);
    if (!data || error) return;
    console.log(
      "found",
      index,
      data.find((value) => value.answer === question.answer)
    );
    // console.log("QUESTION:", index, data);
    // data.map(q => {
    //   q.question_answers.map((qa) => {
    //     qa.answers.
    //   })
    // })
  });
};

export default answerQuiz;
