import QuizEditForm from "@/components/forms/quiz-edit-form";
import React from "react";

// 1. fetch the quiz
// 2. show quiz form edit component
// 3. fetch questions (based from quiz id)
// 4. fetch answers (from question_answers based from question_id)
// 5. show questions and answers
// 6. when clicked, proceed to question_answer edit form
const QuizEditPage = ({ params: { quizId, id } }: { params: { quizId: string; id: string } }) => {
  return (
    <div>
      <QuizEditForm quizId={quizId} subjectId={id} />
    </div>
  );
};

export default QuizEditPage;
