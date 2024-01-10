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

const QuizStudentAnswerSchema = z.object({
  answers: z.array(
    z.object({
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
    name: "answers",
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("quizzes").select().eq("id", quizId).single();
      console.log("error fetchquiz", data, error);
      setQuiz(data as Quiz);
      return { data, error };
    };

    const fetchQuestionWithAnswers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("questions").select("*, question_answers!inner (answers(*))").eq("quiz_id", quizId);
      console.log("error fetch question", data, error);
      setQuestionAndAnswers(data as QuestionWithAnswers[]);
      questionsAndAnswers?.map((value) => {
        append({
          answer: value.title,
        });
      });
      return { data, error };
    };

    fetchQuiz();
    fetchQuestionWithAnswers();
  }, []);

  useEffect(() => {
    console.log("state quiz: ", quiz);
  }, [quiz]); // Log the updated quiz state

  useEffect(() => {
    console.log("state question: ", questionsAndAnswers);
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
      <form action={answerQuiz}>
        <div className='flex flex-col gap-2'>
          {questionsAndAnswers?.map((question, index) => {
            if (question.type !== "Identification") {
              return (
                <div className='flex flex-col gap-4 p-4 border rounded-md border-primary/30'>
                  <p className='font-semibold'>
                    Question #{index + 1}: {question.title}
                  </p>
                  <div className='flex flex-col'>
                    {question.question_answers.map(({ answers }) => {
                      return (
                        <div className='flex items-center justify-start gap-2'>
                          <input className='w-8 h-8 p-2' type='radio' name={`answer-for-${index}`} value={answers.answer} id={String(answers.id)} />
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
              <div className='flex flex-col gap-4 p-4 border rounded-md border-primary/30'>
                <p className='font-semibold'>
                  Question #{index + 1}: {question.title}
                </p>
                <div>
                  <Input type='text'></Input>
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

  1. Create a QuizStudentAnswerSchema



  // after fetching, iappend mo ung bawat answer, 
  
*/
