import QuizQuestionEditForms from "@/components/forms/quiz-question-edit-form";
import React from "react";

const QuestionEditPage = ({ params: { quizId, questionId } }: { params: { quizId: string; questionId: string } }) => {
  return (
    <div>
      <QuizQuestionEditForms questionId={questionId} quizId={quizId} />
    </div>
  );
};

export default QuestionEditPage;
