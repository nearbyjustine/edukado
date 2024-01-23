"use client";

import React, { Dispatch, SetStateAction, useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Tiptap from "@/components/tiptap";
import { updateActivity } from "@/actions/activity/update-activity";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/calendar/date-picker";
import { redirectToSubjectPageAction } from "@/actions/redirect-to-subject-page";
import { Topic } from "@/lib/collection.types";
import { createClient } from "@/utils/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MAX_FILE_SIZE = 20_971_520;

const DiscussionFormSchema = z.object({
  title: z
    .string({ required_error: "Title is a requirement" })
    .min(5, {
      message: "Title is too short",
    })
    .max(100, { message: "Title is too long" }),
  content: z.string({ required_error: "Content is a requirement" }).min(5, { message: "Content is too short" }),

  topic_id: z.string(),
});

const DiscussionEdit = ({ subjectId, discussionId, title, content, topicId }: { subjectId: string; discussionId: number; title: string; content: string; topicId: string }) => {
  const [topics, setTopics] = useState<Topic[]>();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof DiscussionFormSchema>>({
    resolver: zodResolver(DiscussionFormSchema),
    mode: "onChange",
    defaultValues: {
      title: title || "",
      content: content || "",
      topic_id: topicId,
    },
  });

  useEffect(() => {
    form.setValue("title", title);
    form.setValue("content", content);
    form.setValue("topic_id", topicId);
  }, []);

  const onSubmit = (values: z.infer<typeof DiscussionFormSchema>) => {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("discussions")
        .update({ ...values })
        .eq("id", discussionId);

      if (error) {
        console.error(error);
        return;
      }
      await redirectToSubjectPageAction(subjectId);
    });
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

  return (
    <div className={cn("flex w-[35rem] flex-col gap-4 bg-background text-foreground h-screen")}>
      <div className='flex-1'>
        <Form {...form}>
          <form className='flex relative h-full flex-col space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xl font-bold'>Title</FormLabel>
                  <FormControl>
                    <Input {...field} type='text' placeholder='Activity 1: Making the world a better place ' />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xl font-bold'>Content</FormLabel>
                  <FormControl>
                    <Tiptap
                      className='min-h-[250px] max-h-[400px] overflow-scroll p-4 border border-input rounded-md'
                      fetchedContent={field.value}
                      description={field.name}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Separator className='my-8' />
            </div>
            <FormField
              control={form.control}
              name='topic_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Set topic' />
                      </SelectTrigger>
                      <SelectContent>{topics && topics.map((topic) => <SelectItem value={topic.id.toString()}>{topic.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='space-y-4'>
              <Button disabled={isPending} type='submit' className='mt-4'>
                Update Lesson
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DiscussionEdit;
