import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import React from "react";

const fetchQuizResponses = async (quizId: string) => {
  "use server";
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("student_answers_quiz").select().eq("quiz_id", quizId);

  return data;
};

const QuizResponsesPage = async ({ params: { quizId } }: { params: { quizId: string } }) => {
  const quizResponseData = await fetchQuizResponses(quizId);
  if (!quizResponseData) return <div>No responses yet</div>;

  return (
    <>
      {quizResponseData.map((response) => (
        <div></div>
      ))}
    </>
  );
};

export default QuizResponsesPage;
