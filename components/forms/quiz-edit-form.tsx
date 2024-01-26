"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DatePicker } from "../calendar/date-picker";
import addQuiz from "@/actions/quiz/add-quiz";
import { createClient } from "@/utils/supabase/client";
import updateQuiz from "@/actions/quiz/update-quiz";
import { QuizQuestionSchema } from "./quiz-question-form";
import questionListBox from "../main-ui/quiz/question-list-box";
import QuestionListBox from "../main-ui/quiz/question-list-box";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirectToSubjectPageAction } from "@/actions/redirect-to-subject-page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Topic } from "@/lib/collection.types";
export type QuestionType = {
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
    topic_id: z.string(),
  })
  .refine((data) => data.date_open.getTime() <= data.date_close.getTime(), {
    message: "Opening date must be earlier than closing date",
    path: ["date_open"],
  });

const QuizEditForm = ({ subjectId, quizId }: { subjectId: string; quizId: string }) => {
  const [topics, setTopics] = useState<Topic[]>();
  const [questionData, setQuestionData] = useState<QuestionType[]>();
  const [quizPoints, setQuizPoints] = useState<number>();
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const questionCreationPath = path.split("/").slice(0, -1).join("/");

  const form = useForm<z.infer<typeof QuizFormSchema>>({
    resolver: zodResolver(QuizFormSchema),
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      date_open: new Date(),
      date_close: new Date(new Date().setDate(new Date().getDate() + 3)),
      duration: 60,
    },
  });

  useEffect(() => {
    // fetch quiz through client. (try)
    const fetchQuiz = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("quizzes").select("*").eq("id", quizId).single();
      if (error || !data) return console.log(data, error);
      form.setValue("title", data.title);
      form.setValue("description", data.description as string | undefined);
      form.setValue("date_open", new Date(data.date_open));
      form.setValue("date_close", new Date(data.date_close));
      form.setValue("duration", data.duration);
      setQuizPoints(data.total_points);
    };

    const fetchQuestions = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("questions").select("*, question_answers!inner (answers(*))").eq("quiz_id", quizId);
      if (error || !data) return console.log(data, error);
      setQuestionData(data);
    };

    fetchQuiz();
    fetchQuestions();
  }, []);

  const onSubmit = async (values: z.infer<typeof QuizFormSchema>) => {
    console.log(values);
    const { data, error } = await updateQuiz(values, quizId);
    if (error || !data) return console.error(error);
    console.log(data, error);
  };

  useEffect(() => {
    const fetchAllTopicsInThisSubject = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("topic").select("*").eq("subject_id", subjectId);
      if (!data || error) return console.error(error);

      setTopics(data);
    };

    fetchAllTopicsInThisSubject();
  }, []);

  const redirectToSubjectPage = async () => {
    //server action to revalidate and redirect to subject page
    redirectToSubjectPageAction(subjectId);
  };

  if (form.formState.isLoading) return <div>Values are loading. Please wait.</div>;

  return (
    <>
      <Form {...form}>
        <form className='flex flex-col w-full gap-6' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{type === "exam" ? "Exam" : "Quiz"} Title</FormLabel>
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
                <FormLabel>{type === "exam" ? "Exam" : "Quiz"} Description</FormLabel>
                <FormControl>
                  <Input type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='topic_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Set topic' />
                    </SelectTrigger>
                    <SelectContent>{topics && topics.map((topic) => <SelectItem value={topic.id}>{topic.name}</SelectItem>)}</SelectContent>
                  </Select>
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
            <Button onClick={redirectToSubjectPage} type='button' className='' variant={"secondary"}>
              Proceed to Subject
            </Button>
          </div>
        </form>
      </Form>
      <div>Total Points: {quizPoints && quizPoints} pt(s)</div>
      <div className='mt-5 flex flex-col gap-2'>
        {questionData && questionData.map((question, index) => <QuestionListBox points={question.points} key={question.id} question={question} index={index} path={path} />)}
        <Link href={`${questionCreationPath}/add-question`} className='flex gap-2 px-2 py-4 rounded-md border-2 border-foreground/20 text-foreground/30 hover:text-foreground/50 transition-colors'>
          <PlusCircle width={25} height={25} />
          <span>Add Question</span>
        </Link>
      </div>
    </>
  );
};

export default QuizEditForm;
