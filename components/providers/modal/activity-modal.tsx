"use client";
import React, { Dispatch, SetStateAction, useEffect, useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { useCollapseContext } from "../collapseProvider";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Tiptap from "../../tiptap";
import { addActivity } from "@/actions/activity/add-activity";
import { useIsActivityModalOpenContext } from "../activityModalProvider";
import { useRouter } from "next/navigation";
import { headers } from "next/headers";
import { DatePicker } from "@/components/calendar/date-picker";
import { Separator } from "@/components/ui/separator";
import { redirectToSubjectPageAction } from "@/actions/redirect-to-subject-page";
import { createClient } from "@/utils/supabase/client";
import { Topic } from "@/lib/collection.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

const MAX_FILE_SIZE = 20_971_520;

const ActivityFormSchema = z
  .object({
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
    grade: z.coerce.number({ required_error: "Grade should be initialized" }).gte(0, { message: "Grade must not be less than 0" }),
    date_open: z.date({ required_error: "Date to start is required" }),
    date_close: z.date({ required_error: "Date to close is required" }),
    topic_id: z.string(),
    quarter: z.enum(["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"]),
  })
  .refine((data) => data.date_open.getTime() <= data.date_close.getTime(), {
    message: "Opening date must be earlier than closing date",
    path: ["date_open"],
  });

const ActivityModal = ({ subjectId }: { subjectId: string }) => {
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
      const { file: IMFile, url: linkUrl, content, title, grade, date_open, date_close } = values;
      if (IMFile) {
        const response = await uploadFile(IMFile);
        const fileUrl = (await response.json()) as { url: string };
        const { error } = await addActivity(title, content, subjectId, fileUrl.url, linkUrl || "", grade, date_open, date_close, values.topic_id, values.quarter);
        if (error) {
          console.error(error);
          return;
        }
      } else {
        const { error } = await addActivity(title, content, subjectId, "", linkUrl || "", grade, date_open, date_close, values.topic_id, values.quarter);
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
            <FormField
              control={form.control}
              name='quarter'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quarter</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Set quarter' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1st Quarter'>1st Quarter</SelectItem>
                        <SelectItem value='2nd Quarter'>2nd Quarter</SelectItem>
                        <SelectItem value='3rd Quarter'>3rd Quarter</SelectItem>
                        <SelectItem value='4th Quarter'>4th Quarter</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='grade'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <FormControl>
                      <Input min={0} {...field} type='number' id='grade' />
                    </FormControl>
                    <FormDescription>Grade alloted to activity</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name='date_open'
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-1'>
                    <FormLabel>Date Open</FormLabel>
                    <FormControl>
                      <DatePicker field={field} />
                    </FormControl>
                    <FormDescription>This is the date where the activity will open and be visible</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name='date_close'
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-1'>
                    <FormLabel>Date Close</FormLabel>
                    <FormControl>
                      <DatePicker field={field} />
                    </FormControl>
                    <FormDescription>This is the date where the activity will close</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
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

export default ActivityModal;
