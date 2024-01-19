"use server";

import { QuizStudentAnswerSchema } from "@/components_student/forms/answer-quiz-form";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const answerQuiz = async (values: z.infer<typeof QuizStudentAnswerSchema>, quiz_id: string, student_answers_quiz_id: number) => {
  const { questions } = values;

  const cookieServer = cookies();
  const supabase = createClient(cookieServer);

  questions.map(async (question, index) => {
    const { data, error } = await supabase.from("answers").select("*, question_answers!inner (questions(*))").eq("question_answers.question_id", question.question_id);
    if (!data || error) return;

    const answer = data.find((value) => value.answer === question.answer);
    const { data: insertData, error: insertError } = await supabase
      .from("student_questions_answers")
      .insert({ question_id: question.question_id, answer: question.answer, is_correct: (answer?.is_correct && answer.is_correct) || false, student_answers_quiz_id });
  });

  setTimeout(async () => {
    // calculate points
    const totalPointsData = await supabase.rpc("compute_total_points_student_quiz", { self_student_quiz_id: student_answers_quiz_id });
    // change to has finished to true, update total_points
    console.log(student_answers_quiz_id);
    const { data: updateData, error: updateError } = await supabase
      .from("student_answers_quiz")
      .update({ has_finished: true, total_points: totalPointsData.data })
      .eq("id", student_answers_quiz_id)
      .select()
      .single();
    console.log(updateData, updateError);

    if (updateError) return;
  }, 1000);
};

export default answerQuiz;
