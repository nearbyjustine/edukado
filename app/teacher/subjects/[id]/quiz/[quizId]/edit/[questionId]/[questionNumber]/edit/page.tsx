import QuizQuestionEditForms from "@/components/forms/quiz-question-edit-form";
import React from "react";

const QuestionEditPage = ({ params: { quizId, questionId, questionNumber } }: { params: { quizId: string; questionId: string; questionNumber: string } }) => {
  return (
    <div>
      <QuizQuestionEditForms questionNumber={parseInt(questionNumber)} questionId={questionId} quizId={quizId} />
    </div>
  );
};

export default QuestionEditPage;
