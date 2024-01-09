"use client";

import { QuestionWithAnswers, Quiz } from "@/lib/collection.types";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

const AnswerQuizForm = ({ subjectId, quizId }: { subjectId: string; quizId: string }) => {
  // fetch mo lahat
  const [quiz, setQuiz] = useState<Quiz>();
  const [questionsAndAnswers, setQuestionAndAnswers] = useState<QuestionWithAnswers[]>();

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
      {questionsAndAnswers?.map((question, index) => {
        if (question.type !== "Identification") {
          return (
            <div className='flex flex-col gap-4 p-4 border rounded-md border-primary/30'>
              <p className='font-semibold'>
                Question #{index}: {question.title}
              </p>
              <RadioGroup>
                {question.question_answers.map(({ answers }) => {
                  return (
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value={answers.answer} id={String(answers.id)} />
                      <Label htmlFor={String(answers.id)}>{answers.answer}</Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          );
        }
        return (
          <div className='flex flex-col gap-4 p-4 border rounded-md border-primary/30'>
            <p className='font-semibold'>
              Question #{index}: {question.title}
            </p>
            <div>
              <Input type='text'></Input>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnswerQuizForm;
