"use client";

import { QuestionWithAnswers, Quiz } from "@/lib/collection.types";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import answerQuiz from "@/actions_student/quiz/answer-quiz";
import { Button } from "@/components/ui/button";

export const QuizStudentAnswerSchema = z.object({
  questions: z.array(
    z.object({
      question_id: z.string(),
      answer: z.string(),
    })
  ),
});

const AnswerQuizForm = ({ subjectId, quizId }: { subjectId: string; quizId: string }) => {
  // fetch mo lahat
  const [quiz, setQuiz] = useState<Quiz>();
  const [questionsAndAnswers, setQuestionAndAnswers] = useState<QuestionWithAnswers[]>();

  const form = useForm<z.infer<typeof QuizStudentAnswerSchema>>({
    resolver: zodResolver(QuizStudentAnswerSchema),
    reValidateMode: "onChange",
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const addAnswerToQuiz = async (values: z.infer<typeof QuizStudentAnswerSchema>) => {
    await answerQuiz(values);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("quizzes").select().eq("id", quizId).single();
      if (!data || error) return { data, error };
      setQuiz(data as Quiz);
      return { data, error };
    };

    const fetchQuestionWithAnswers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("questions").select("*, question_answers!inner (answers(*))").eq("quiz_id", quizId);
      if (!data || error) return { data, error };
      setQuestionAndAnswers(data as QuestionWithAnswers[]);

      return { data, error };
    };

    fetchQuiz();
    fetchQuestionWithAnswers();
  }, []);

  useEffect(() => {
    remove();
    questionsAndAnswers?.map((value) => {
      append({
        question_id: value.id,
        answer: value.title,
      });
    });
  }, [questionsAndAnswers]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='max-w-fit'>
        <h1 className='text-2xl font-bold relative'>
          {quiz?.title}
          <span className='absolute text-sm font-normal top-0 -right-20 rounded-md bg-primary text-primary-foreground px-2'>100 pts</span>
        </h1>
      </div>
      <div>{quiz?.description}</div>
      <form onSubmit={form.handleSubmit(addAnswerToQuiz)}>
        <div className='flex flex-col gap-2'>
          {fields.map((field, index) => {
            if (!questionsAndAnswers) return <div>...Loading</div>;
            const question = questionsAndAnswers[index];

            if (question.type !== "Identification") {
              return (
                <div key={field.id} className='flex flex-col gap-4 p-4 border rounded-md border-primary/30'>
                  <p className='font-semibold'>
                    Question #{index + 1}: {question.title}
                  </p>
                  <input type='hidden' name={`answers_${index}_[question-id]`} value={question.id} />
                  <div className='flex flex-col'>
                    {question.question_answers.map(({ answers }) => {
                      return (
                        <div key={answers.id} className='flex items-center justify-start gap-2'>
                          <input
                            className='w-8 h-8 p-2'
                            type='radio'
                            {...form.register(`questions.${index}.answer`)}
                            name={`answers_${index}_[answer]`}
                            value={answers.answer}
                            id={String(answers.id)}
                          />
                          <Label className='flex-1' htmlFor={String(answers.id)}>
                            {answers.answer}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return (
              <div key={field.id} className='flex flex-col gap-4 p-4 border rounded-md border-primary/30'>
                <p className='font-semibold'>
                  Question #{index + 1}: {question.title}
                </p>
                <div>
                  <input type='hidden' name={`answers_${index}_[question-id]`} value={question.id} />
                  <Input {...form.register(`questions.${index}.answer`)} name={`answers_${index}_[answer]`} type='text'></Input>
                </div>
              </div>
            );
          })}
        </div>
        <Button className='mt-4' type='submit'>
          Submit Answers
        </Button>
      </form>
    </div>
  );
};

export default AnswerQuizForm;

/* 

// may data na manggagaling sa form
question id tsaka answer, tapos ung quiz id manggagaling nalang sa params quizid

// gawa ka na ng server action na ichcheck ung bawat answer, tapos kung yung kaakibat na isCorrect property is true,
// pag true, edi sa database ng student, correct din siya.


*/
