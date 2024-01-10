"use server";

const answerQuiz = (formData: FormData) => {
  console.log(formData.get("answer"));
};

export default answerQuiz;
