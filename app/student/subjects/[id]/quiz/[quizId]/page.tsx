import CountdownAnswerQuizForm from "@/components_student/forms/answer-quiz-form";
import { StudentAnswerQuiz } from "@/lib/collection.types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import React from "react";

const QuizAnswerPage = async ({ params: { id, quizId } }: { params: { id: string; quizId: string } }) => {
  let startedQuiz: StudentAnswerQuiz;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) return <div>Error. Something happened</div>;
  const { data: fetchData, error: fetchError } = await supabase.from("student_answers_quiz").select("*, quizzes(*)").eq("quiz_id", quizId).eq("student_id", user.id).single();
  if (!fetchData) {
    const { data: insertData, error: insertError } = await supabase.from("student_answers_quiz").insert({ quiz_id: quizId, student_id: user.id }).select("*, quizzes(*)").single();
    if (!insertData || insertError) return <div>Error. Something happened</div>;
    startedQuiz = insertData;
  } else {
    startedQuiz = fetchData;
  }

  if (startedQuiz.has_finished) {
    const totalPoints = startedQuiz.total_points;
    return (
      <>
        <div>{startedQuiz.quizzes?.title}</div>
        <div>Score: {totalPoints}</div>
      </>
    );
  }
  return (
    <div>
      <CountdownAnswerQuizForm subjectId={id} quizId={quizId} startedQuizId={startedQuiz.id} />
    </div>
  );
};

export default QuizAnswerPage;
