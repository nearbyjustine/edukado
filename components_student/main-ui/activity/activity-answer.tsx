"use client";

import React, { Dispatch, SetStateAction, useEffect, useTransition } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Tiptap from "@/components/tiptap";
import { answerActivity } from "@/actions/activity/answer-activity";

const MAX_FILE_SIZE = 20_971_520;

const ActivityFormSchema = z.object({
  content: z.string({ required_error: "Content is a requirement" }).min(5, { message: "Content is too short" }),
  file: z
    .custom<File>((val) => val instanceof File, "Please upload a file")
    .refine((file) => file?.size <= MAX_FILE_SIZE, { message: `Max image size is 20MB.` })
    .optional(),
  url: z.string().url("Must be a valid url").optional(),
});

const ActivityAnswer = ({ subjectId, activityId, className }: { subjectId: string; activityId: string; className: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ActivityFormSchema>>({
    resolver: zodResolver(ActivityFormSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
      url: undefined,
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
      const { file: IMFile, url: linkUrl, content } = values;
      if (IMFile) {
        const response = await uploadFile(IMFile);
        const fileUrl = (await response.json()) as { url: string };
        const error = await answerActivity(content, activityId, fileUrl.url, linkUrl || "");
        console.log(error);
      } else {
        const error = await answerActivity(content, activityId, "", linkUrl || "");
        console.log(error);
      }

      router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/student/subjects/${subjectId}`);
    });
  };

  return (
    <div className={cn("flex w-[35rem] flex-col gap-4 bg-background text-foreground h-screen", className)}>
      <div className=''>
        <Form {...form}>
          <form className='flex relative flex-col space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium'>Content</FormLabel>
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
            <Button disabled={isPending} type='submit' className='mt-4'>
              Submit Answers
            </Button>
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
                      Upload Materials <span className='font-thin italic'>(Maximum file size of 20MB.)</span>
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
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ActivityAnswer;
