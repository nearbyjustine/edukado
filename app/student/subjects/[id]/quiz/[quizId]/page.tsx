import AnswerQuizForm from "@/components_student/forms/answer-quiz-form";
import React from "react";

const QuizAnswerPage = ({ params: { id, quizId } }: { params: { id: string; quizId: string } }) => {
  return (
    <div>
      <AnswerQuizForm subjectId={id} quizId={quizId} />
    </div>
  );
};

export default QuizAnswerPage;
