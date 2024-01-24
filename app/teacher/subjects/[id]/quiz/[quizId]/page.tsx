import { fetchQuiz } from "@/actions/quiz/fetch-quiz";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { cookies } from "next/headers";
import React from "react";
import { headers } from "next/headers";
import Link from "next/link";
const fetchQuizResponses = async (quizId: string) => {
  "use server";
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("student_answers_quiz").select("*, students(*, profiles!students_user_id_fkey(*))").eq("quiz_id", quizId);
  return data;
};

const formatDate = (date: string) => {
  return format(new Date(date), "MMMM dd, Y");
};

const QuizResponsesPage = async ({ params: { quizId } }: { params: { quizId: string } }) => {
  const quizResponseData = await fetchQuizResponses(quizId);
  const quizData = await fetchQuiz(quizId);
  if (!quizData.data || quizData.error) return <div>No quiz detected</div>;
  if (!quizResponseData) return <div>No responses yet</div>;

  const pathname = headers().get("next-url");
  return (
    <>
      <div>Quiz: {quizData.data.title}</div>
      <div>Description: {quizData.data.description}</div>
      <div>Duration: {quizData.data.duration > 0 ? quizData.data.duration + " minutes" : "No time limit"}</div>
      <div>Date Open: {formatDate(quizData.data.date_open)}</div>
      <div>Date Due: {formatDate(quizData.data.date_close)}</div>
      <div className='relative border rounded-md border-primary p-4 mt-5'>
        <div className='absolute -top-4 font-bold text-lg bg-background text-primary px-2'>Quiz Responses</div>
        <div className='flex flex-col gap-2'>
          {quizResponseData.map((response) => (
            <Link key={response.id} href={`${pathname}/student_response/${response.id}`}>
              <div className='bg-primary text-primary-foreground rounded-md px-4 py-4 w-96 select-none cursor-pointer flex justify-center items-center' key={response.id}>
                {response.students?.profiles?.first_name} {response.students?.profiles?.last_name} Quiz Score:
                <span className='text-lg font-bold ml-3'>
                  {response.total_points} / {quizData.data?.total_points}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default QuizResponsesPage;
