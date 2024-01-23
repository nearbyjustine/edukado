"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { addTopic } from "@/actions/topic/topic";
import redirectToSubjectPageAction from "@/actions/redirect-to-subject-page";

const TopicSchema = z.object({
  name: z.string({ required_error: "This is required" }),
});

const TopicForm = ({ subjectId }: { subjectId: string }) => {
  const form = useForm<z.infer<typeof TopicSchema>>({
    resolver: zodResolver(TopicSchema),
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof TopicSchema>) => {
    const { data, error } = await addTopic(values.name);

    if (error || !data) return console.log(error);

    redirectToSubjectPageAction(subjectId);
  };

  return (
    <div className='w-2/3 '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic Name</FormLabel>
                <FormControl>
                  <Input placeholder='Lesson 1: The skeletal system' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default TopicForm;
