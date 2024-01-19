import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import React from "react";

const fetchStudentResponseQuiz = async (studentAnswerQuizId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("student_questions_answers").select("*, questions(*, question_answers!inner(answers(*))) ").eq("student_answers_quiz_id", studentAnswerQuizId);
  if (error || !data) return console.log("did not fetch anything");

  return data;
};

const StudentResponseQuizPage = async ({ params: { studentAnswerQuizId, quizId } }: { params: { studentAnswerQuizId: string; quizId: string } }) => {
  // fetch mo ung response ng student sa quiz
  const data = await fetchStudentResponseQuiz(studentAnswerQuizId);
  if (!data) return <div>No data fetched</div>;
  return (
    <div>
      <div className='flex flex-col gap-6 '>
        {data.map((studentAnswer, index) => {
          let correctAnswer: string = "";
          return (
            <div key={studentAnswer.id} className={cn("relative border p-4 rounded-md w-96 select-none border-primary")}>
              <div className='absolute -top-3 -right-3 bg-primary p-1 text-sm text-primary-foreground rounded-md'>{studentAnswer.questions?.points} pts</div>
              <span className='font-bold'>
                Question #{index + 1}: {studentAnswer.questions?.title}
              </span>
              <div className='flex flex-col my-3'>
                {/* Multiple Choice */}
                {studentAnswer.questions?.question_answers.map(({ answers }) => {
                  if (answers?.is_correct) correctAnswer = answers.answer;
                  if (studentAnswer.questions?.type === "Multiple Choice") {
                    if (studentAnswer.answer === answers?.answer) {
                      return <div className={cn("p-2 rounded-md text-primary-foreground", (studentAnswer.is_correct && "bg-primary") || "bg-destructive")}>{answers.answer}</div>;
                    }
                    return <div className='p-2'>{answers?.answer}</div>;
                  }
                  if (studentAnswer.questions?.type === "Identification") {
                    return <div className={cn("p-2 rounded-md text-primary-foreground", (studentAnswer.is_correct && "bg-primary") || "bg-destructive")}>{studentAnswer.answer}</div>;
                  }
                })}
              </div>
              <div className='text-primary font-bold'>Correct Answer: {correctAnswer}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentResponseQuizPage;
