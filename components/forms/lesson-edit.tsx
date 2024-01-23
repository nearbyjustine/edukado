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

export const LessonFormSchema = z.object({
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

const LessonEdit = ({
  subjectId,
  lessonId,
  title,
  content,
  fileUrl,
  linkUrl,
  topicId,
}: {
  subjectId: string;
  lessonId: number;
  title: string;
  content: string;
  linkUrl: string;
  fileUrl: string;
  topicId: string;
}) => {
  const [topics, setTopics] = useState<Topic[]>();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LessonFormSchema>>({
    resolver: zodResolver(LessonFormSchema),
    mode: "onChange",
    defaultValues: {
      title: title || "",
      content: content || "",
      url: linkUrl || undefined,
      topic_id: topicId,
    },
  });

  useEffect(() => {
    form.setValue("title", title);
    form.setValue("content", content);
    form.setValue("url", linkUrl || undefined);
    form.setValue("topic_id", topicId);
  }, []);

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

  const onSubmit = (values: z.infer<typeof LessonFormSchema>) => {
    startTransition(async () => {
      const { file: IMFile, url: linkUrl, ...otherValues } = values;
      const supabase = createClient();
      if (IMFile) {
        const response = await uploadFile(IMFile);
        const fileUrl = (await response.json()) as { url: string };
        // const error = await updateActivity(title, content, activityId, fileUrl.url, linkUrl || "", values.grade, values.date_open, values.date_close);
        const { error } = await supabase
          .from("lessons")
          .update({ ...otherValues, file_url: fileUrl.url, link_url: linkUrl })
          .eq("id", lessonId);
        if (error) {
          console.error(error);
          return;
        }
      } else {
        // const error = await updateActivity(title, content, activityId, fileUrl || "", linkUrl || "", values.grade, values.date_open, values.date_close);
        const { error } = await supabase
          .from("lessons")
          .update({ ...otherValues, link_url: linkUrl, file_url: fileUrl })
          .eq("id", lessonId);

        if (error) {
          console.error(error);
          return;
        }
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
                        defaultValue={fileUrl}
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

export default LessonEdit;
