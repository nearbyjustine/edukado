"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";

const QuestionTypeSchema = z.enum(["Multiple Choice", "Identification", "True or False"], { required_error: "Question Type is required" });

const QuizQuestionSchema = z.object({
  title: z.string({ required_error: "Quiz Title is required" }),
  type: QuestionTypeSchema,
  options: z.array(
    z.object({
      answer: z.string(),
      is_correct: z.boolean(),
    }),
    { required_error: "Every option must be filled with answers" }
  ),
});

const QuizQuestionForm = () => {
  const form = useForm<z.infer<typeof QuizQuestionSchema>>({
    resolver: zodResolver(QuizQuestionSchema),
    reValidateMode: "onChange",
    defaultValues: {
      type: "Multiple Choice",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const watchType = useWatch<z.infer<typeof QuizQuestionSchema>>({ control: form.control, name: "type" });

  const onNextQuestion = (values: z.infer<typeof QuizQuestionSchema>) => {
    console.log("RESULT: ", values);
  };

  const onSaveAndExit = (values: z.infer<typeof QuizQuestionSchema>) => {
    console.log(values);
  };

  const handleOptionNumberChange = (value: number) => {
    // create an "empty" array for each number of options
    fields && remove();
    for (let i = 0; i < value; i++) {
      append({
        answer: "",
        is_correct: false,
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form method='post' className='flex flex-col w-full gap-6' onSubmit={form.handleSubmit(onSaveAndExit)}>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Type of Question' defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Multiple Choice'>Multiple Choice</SelectItem>
                      <SelectItem value='Identification'>Identification</SelectItem>
                      <SelectItem value='True or False'>True or False</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* NUMBER OF OPTIONS FOR MULTIPLE CHOICE */}

          {watchType === "Multiple Choice" && (
            <FormItem>
              <FormLabel>Number of Choices</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    handleOptionNumberChange(parseInt(value));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={"..."} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='2'>2</SelectItem>
                    <SelectItem value='3'>3</SelectItem>
                    <SelectItem value='4'>4</SelectItem>
                    <SelectItem value='5'>5</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}

          {/* MULTIPLE CHOICE */}

          {watchType === "Multiple Choice" &&
            fields.map((arrayField, index) => {
              const { errors } = form.formState;
              const errorForAnswer = errors.options;
              console.log(errorForAnswer);
              return (
                <div key={arrayField.id} className='space-y-2'>
                  <Input {...form.register(`options.${index}.answer` as const)} type='text' />
                  <div className='flex gap-2 items-center'>
                    <Checkbox
                      onCheckedChange={(value) => form.setValue(`options.${index}.is_correct`, value as boolean)}
                      {...form.register(`options.${index}.is_correct` as const)}
                      id={`is_correct_${arrayField.id}`}
                    />
                    <FormLabel htmlFor={`is_correct_${arrayField.id}`} className=''>
                      Correct Answer?
                    </FormLabel>
                  </div>
                  <FormMessage />
                </div>
              );
            })}

          {watchType === ""}

          <div className='flex justify-end gap-2'>
            <Button variant={"secondary"} className='' onClick={form.handleSubmit(onNextQuestion)}>
              Next Question
            </Button>
            <Button variant={"default"} className='' type='submit'>
              Save and Exit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default QuizQuestionForm;
