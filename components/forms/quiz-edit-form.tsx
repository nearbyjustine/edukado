"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { DatePicker } from "../calendar/date-picker";
import addQuiz from "@/actions/quiz/add-quiz";
import { createClient } from "@/utils/supabase/client";
import updateQuiz from "@/actions/quiz/update-quiz";
import { QuizQuestionSchema } from "./quiz-question-form";

type QuestionType = {
  created_at: string;
  id: string;
  points: number;
  quiz_id: string;
  title: string;
  type: "Multiple Choice" | "True or False" | "Identification";
  question_answers: {
    answers: {
      answer: string;
      created_at: string;
      id: number;
      is_correct: boolean;
    } | null;
  }[];
};

export const QuizFormSchema = z
  .object({
    title: z.string({ required_error: "Quiz title is required" }),
    description: z.string().optional(),
    date_open: z.date({ required_error: "Date to start is required" }),
    date_close: z.date({ required_error: "Date to close is required" }),
    duration: z.coerce.number({ required_error: "Duration is required" }).min(0),
  })
  .refine((data) => data.date_open.getTime() <= data.date_close.getTime(), {
    message: "Opening date must be earlier than closing date",
    path: ["date_open"],
  });

const QuizEditForm = ({ subjectId, quizId }: { subjectId: string; quizId: string }) => {
  const [quizFormData, setQuizFormData] = useState<z.infer<typeof QuizFormSchema>>({
    title: "",
    description: "",
    date_open: new Date(),
    date_close: new Date(new Date().setDate(new Date().getDate() + 3)),
    duration: 60,
  });

  const [questionData, setQuestionData] = useState<QuestionType[]>();

  const router = useRouter();
  const path = usePathname();
  const form = useForm<z.infer<typeof QuizFormSchema>>({
    resolver: zodResolver(QuizFormSchema),
    reValidateMode: "onChange",
    defaultValues: {
      title: quizFormData.title,
      description: quizFormData.description,
      date_open: quizFormData.date_open,
      date_close: quizFormData.date_close,
      duration: quizFormData.duration,
    },
  });

  useEffect(() => {
    // fetch quiz through client. (try)
    const fetchQuiz = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("quizzes").select("title, description, date_open, date_close, duration").eq("id", quizId).single();
      if (error || !data) return console.log(data, error);
      setQuizFormData({ ...data, date_close: new Date(data.date_close), date_open: new Date(data.date_open), description: data.description as string | undefined });
    };

    const fetchQuestions = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("questions").select("*, question_answers!inner (answers(*))").eq("quiz_id", quizId);
      if (error || !data) return console.log(data, error);
      setQuestionData(data);
      console.log(data, error);
    };

    fetchQuiz();
    fetchQuestions();
  }, []);

  const onSubmit = async (values: z.infer<typeof QuizFormSchema>) => {
    console.log(values);
    const { data, error } = await updateQuiz(values, quizId);
    if (error || !data) return console.log(error);
  };

  return (
    <Form {...form}>
      <form className='flex flex-col w-full gap-6' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quiz Title</FormLabel>
              <FormControl>
                <Input type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quiz Description</FormLabel>
              <FormControl>
                <Input type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='date_open'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel>Date Open</FormLabel>
              <FormControl>
                <DatePicker field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name='date_close'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel>Date Due</FormLabel>
              <FormControl>
                <DatePicker field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name='duration'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel>Duration (in minutes)</FormLabel>
              <FormControl>
                <Input {...field} type='number' min={0} />
              </FormControl>
              <FormDescription>Set duration of quiz in minutes. 0 means no duration.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <div className='flex justify-end gap-2'>
          <Button className='' type='submit'>
            Update Quiz
          </Button>
          <Button className='' variant={"destructive"}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuizEditForm;
