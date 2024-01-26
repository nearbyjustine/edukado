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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Topic } from "@/lib/collection.types";
import Link from "next/link";

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

const QuizForm = ({ subjectId }: { subjectId: string }) => {
  const [topics, setTopics] = useState<Topic[]>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const router = useRouter();
  const path = usePathname();
  const form = useForm<z.infer<typeof QuizFormSchema>>({
    resolver: zodResolver(QuizFormSchema),
    reValidateMode: "onChange",
    defaultValues: {
      duration: 60,
    },
  });

  const onSubmit = async (values: z.infer<typeof QuizFormSchema>) => {
    setIsSubmitting(true);
    console.log(values);
    const { data, error } = await addQuiz(values, subjectId, type);
    if (error || !data) return console.error(error);

    // Get newly created id of quiz
    const { id } = data;

    // Proceed to CreateQuizQuestionPage
    router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/${path}/${id}/add-question`);
    setIsSubmitting(false);
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

  const goBack = () => {
    router.back();
  };

  return (
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
          name='topic_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <div>
                  {topics && topics.length > 0 && (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Set topic' />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem value={topic.id}>{topic.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {topics?.length == 0 && (
                    <Link className='text-primary' href={`/teacher/subjects/${subjectId}/topic`}>
                      Add a topic?
                    </Link>
                  )}
                </div>
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
          <Button disabled={form.formState.isSubmitting} className='' type='submit'>
            Create Quiz
          </Button>
          <Button onClick={goBack} type='button' className='' variant={"destructive"}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuizForm;
