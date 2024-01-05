"use client";

import React from "react";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

const QuizFormSchema = z.object({
  title: z.string({ required_error: "Quiz title is required" }),
  description: z.string().optional(),
});

const QuizForm = () => {
  const router = useRouter();
  const path = usePathname();
  const form = useForm<z.infer<typeof QuizFormSchema>>({
    resolver: zodResolver(QuizFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof QuizFormSchema>) => {
    // Create Quiz server action
    console.log(values);

    const id = "sample-id";
    // Proceed to CreateQuizQuestionPage

    router.push(`/${path}/${id}`);
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
        <div className='flex justify-end gap-2'>
          <Button className='' type='submit'>
            Create Quiz
          </Button>
          <Button className='' variant={"destructive"}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuizForm;
