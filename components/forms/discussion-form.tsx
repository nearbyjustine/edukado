"use client";
import React, { Dispatch, SetStateAction, useEffect, useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addActivity } from "@/actions/activity/add-activity";
import { useRouter } from "next/navigation";
import { headers } from "next/headers";
import { DatePicker } from "@/components/calendar/date-picker";
import { Separator } from "@/components/ui/separator";
import { redirectToSubjectPageAction } from "@/actions/redirect-to-subject-page";
import { createClient } from "@/utils/supabase/client";
import { Topic } from "@/lib/collection.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Tiptap from "@/components/tiptap";
import { Button } from "../ui/button";
import Link from "next/link";

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

const DiscussionForm = ({ subjectId }: { subjectId: string }) => {
  const [topics, setTopics] = useState<Topic[]>();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof DiscussionFormSchema>>({
    resolver: zodResolver(DiscussionFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const uploadFile = async (file: File) => {
    let url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/activity/upload-instructional-material`;

    const formData = new FormData();
    formData.set("instructional_material", file);
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    return response;
  };

  const onSubmit = (values: z.infer<typeof DiscussionFormSchema>) => {
    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) return console.error(userError);

      const { error } = await supabase.from("discussions").insert({ ...values, subject_id: subjectId, teacher_id: user.id });
      if (error) {
        console.error(error);
        return;
      }

      redirectToSubjectPageAction(subjectId);
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
                    <Input {...field} type='text' placeholder='Lesson 1: Making the world a better place ' />
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
                    <Tiptap className='min-h-[200px] max-h-[400px] overflow-scroll p-4 border border-input rounded-md' description={field.name} onChange={field.onChange} />
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
            <div className='space-y-4'>
              <Button disabled={isPending} type='submit' className='mt-4'>
                Add Discussion
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DiscussionForm;
