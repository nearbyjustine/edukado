import QuizQuestionForm from "@/components/forms/quiz-question-form";
import React from "react";

const AddQuestionPage = ({ params: { quizId } }: { params: { quizId: string } }) => {
  return (
    <div className='w-full md:w-2/3 lg:w-2/3 '>
      <QuizQuestionForm quizId={quizId} />
    </div>
  );
};

export default AddQuestionPage;
