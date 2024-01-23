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

const ActivityFormSchema = z.object({
  title: z
    .string({ required_error: "Title is a requirement" })
    .min(5, {
      message: "Title is too short",
    })
    .max(100, { message: "Title is too long" }),
  content: z.string({ required_error: "Content is a requirement" }).min(5, { message: "Content is too short" }),
  file: z
    .custom<File>((val) => val instanceof File, "Please upload a file")
    .refine((file) => file?.size <= MAX_FILE_SIZE, { message: `Max image size is 20MB.` })
    .optional(),
  url: z.string().url("Must be a valid url").optional(),
  topic_id: z.string(),
});

const LessonForm = ({ subjectId }: { subjectId: string }) => {
  const [topics, setTopics] = useState<Topic[]>();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ActivityFormSchema>>({
    resolver: zodResolver(ActivityFormSchema),
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

  const onSubmit = (values: z.infer<typeof ActivityFormSchema>) => {
    startTransition(async () => {
      const { file: IMFile, url: linkUrl, ...otherValues } = values;
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) return console.error(userError);

      if (IMFile) {
        const response = await uploadFile(IMFile);
        const fileUrl = (await response.json()) as { url: string };
        // const { error } = await addActivity(title, content, subjectId, fileUrl.url, linkUrl || "", grade, date_open, date_close, values.topic_id);
        const { error } = await supabase.from("lessons").insert({ ...otherValues, subject_id: subjectId, file_url: fileUrl.url, link_url: linkUrl, teacher_id: user.id });
        if (error) {
          console.error(error);
          return;
        }
      } else {
        // const { error } = await addActivity(title, content, subjectId, "", linkUrl || "", grade, date_open, date_close, values.topic_id);
        const { error } = await supabase.from("lessons").insert({ ...otherValues, subject_id: subjectId, link_url: linkUrl, teacher_id: user.id });
        if (error) {
          console.error(error);
          return;
        }
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
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input {...field} id='url' type='url' placeholder='Copy and paste link here' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name='file'
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>
                      Upload Instructional Materials <span className='font-thin italic'>(Maximum file size of 20MB.)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(event) => {
                          onChange(event.target?.files?.[0]);
                        }}
                        multiple={false}
                        id='file'
                        type='file'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
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
                Add Activity
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LessonForm;
