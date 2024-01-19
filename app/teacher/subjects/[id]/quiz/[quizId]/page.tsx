import fetchQuiz from "@/actions/quiz/fetch-quiz";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import React from "react";

const fetchQuizResponses = async (quizId: string) => {
  "use server";
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("student_answers_quiz").select("*, students(*, profiles!students_user_id_fkey(*))").eq("quiz_id", quizId);
  return data;
};

const QuizResponsesPage = async ({ params: { quizId } }: { params: { quizId: string } }) => {
  const quizResponseData = await fetchQuizResponses(quizId);
  const quizData = await fetchQuiz(quizId);
  if (!quizData.data || quizData.error) return <div>No quiz detected</div>;
  if (!quizResponseData) return <div>No responses yet</div>;

  return (
    <>
      <div>Quiz: {quizData.data.title}</div>
      <div>Description: {quizData.data.description}</div>
      <div>Duration: {quizData.data.duration}</div>
      <div>Date Open: {quizData.data.date_open}</div>
      <div>Date Due: {quizData.data.date_close}</div>
      {quizResponseData.map((response) => (
        <div className='bg-primary text-primary-foreground rounded-md px-2 py-1 w-56' key={response.id}>
          {response.students?.profiles?.first_name} {response.students?.profiles?.last_name} score: {response.total_points}/{quizData.data?.total_points}
        </div>
      ))}
    </>
  );
};

export default QuizResponsesPage;
