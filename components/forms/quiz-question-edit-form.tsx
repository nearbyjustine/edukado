"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import addQuestion from "@/actions/question/add-question";
import updateQuestion from "@/actions/question/update-question";
import addAnswers from "@/actions/answers/add-answers";
import { fetchQuestionsCount } from "@/actions/question/fetch-all-questions";
import { createClient } from "@/utils/supabase/client";

const QuestionEditTypeSchema = z.enum(["Multiple Choice", "Identification", "True or False"], { required_error: "Question Type is required" });
export const OptionsEditTypeSchema = z
  .array(
    z.object({
      answer: z.string().refine((val) => val !== "", { message: "Answer must be provided for each option" }),
      is_correct: z.boolean(),
    }),
    { required_error: "Every option must be filled with answers" }
  )
  .superRefine((val, ctx) => {
    let count = 0;

    val.map((v) => {
      v.is_correct && count++;
    });

    if (val.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "There must be at least one choice",
        path: ["root"],
      });
    }

    if (count > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "There must only be one correct answer",
        path: ["root"],
      });
    }
    if (count === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "There must only be one correct answer",
        path: ["root"],
      });
    }
  });
export const QuizQuestionEditSchema = z.object({
  title: z.string({ required_error: "Quiz Title is required" }),
  type: QuestionEditTypeSchema,
  options: OptionsEditTypeSchema,
  points: z.coerce.number({ required_error: "Points is required" }).min(0),
  option_count: z.coerce.number().optional(),
});
// .refine(
//   (data) => {
//     let numberOfCorrect = 0;
//     data.options.forEach((e) => {
//       e.is_correct && numberOfCorrect++;
//     });
//     return numberOfCorrect !== 0;
//   },
//   { message: "There should at least be one correct answer", path: ["options"] }
// );

const QuizQuestionEditForms = ({ quizId, questionId, questionNumber }: { quizId: string; questionId: string; questionNumber: number }) => {
  const [optionCount, setOptionCount] = useState(1);
  const path = usePathname();
  const quizEditPath = path.split("/").slice(0, -3).join("/");
  const router = useRouter();
  const form = useForm<z.infer<typeof QuizQuestionEditSchema>>({
    resolver: zodResolver(QuizQuestionEditSchema),
    reValidateMode: "onChange",
    defaultValues: {
      type: "Multiple Choice",
      points: 1,
    },
  });
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    remove();
    if (form.getValues("type") === "Identification") {
      append({
        answer: "",
        is_correct: true,
      });
    }
    if (form.getValues("type") === "True or False") {
      append({
        answer: "True",
        is_correct: false,
      });
      append({
        answer: "False",
        is_correct: false,
      });
    }
  }, [form.getValues("type")]);

  useEffect(() => {
    // fetch all questions,
    const fetchQuestion = async () => {
      const supabase = createClient();

      const { data, error } = await supabase.from("questions").select("*, question_answers!inner (answers(*))").eq("id", questionId).single();
      if (error || !data) return console.log("fetch question start error", data, error);
      const answersArray = data.question_answers.map((value) => {
        if (value.answers) {
          return {
            answer: value.answers.answer,
            is_correct: value.answers.is_correct,
          };
        }

        return {
          answer: "",
          is_correct: false,
        };
      });
      if (!answersArray) return console.log(answersArray);
      replace([...answersArray]);

      form.setValue("title", data.title);
      form.setValue("points", data.points);
      form.setValue("type", data.type);
      form.setValue("option_count", answersArray.length);
    };

    remove();
    fetchQuestion();
    // set the state on question number as the next question
  }, []);

  const watchType = useWatch<z.infer<typeof QuizQuestionEditSchema>>({ control: form.control, name: "type" });

  const submitAnswer = async (options: z.infer<typeof OptionsEditTypeSchema>, questionId: string) => {
    // insert mo ung kada option sa db
    // insert mo ung id ng bawat option sa question_answers kasama ung questionId
    const { data, error } = await addAnswers(options, questionId);
    if (!data || error) {
      console.log("insert answer", data, error);
      return { data, error };
    }

    return { data, error };
  };

  const onUpdateQuestion = async (values: z.infer<typeof QuizQuestionEditSchema>) => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log(form.formState.isValid);
      return console.error("form is invalid");
    }
    // update question using values
    const { data, error } = await updateQuestion(values, questionId);
    if (!data || error) return console.log("update question error", data, error);

    // fetch answer ids
    const supabase = createClient();
    const { data: answerData, error: answerError } = await supabase.from("questions").select("question_answers!inner (answers(id))").eq("id", questionId).single();
    if (!answerData || answerError) return console.log("fetch answer error", answerData, answerError);

    const answerIdArray = answerData.question_answers.map((value) => {
      return value.answers?.id as number;
    });

    // delete answer
    answerIdArray.forEach(async (id) => {
      const { data: deleteAnswerData, error: deleteAnswerError } = await supabase.from("answers").delete().eq("id", id).select().single();
      if (!deleteAnswerData || deleteAnswerError) return console.log("delete answer error", deleteAnswerData, deleteAnswerError);
    });

    // // insert answer
    const { data: insertAnswerData, error: insertAnswerError } = await submitAnswer(values.options, questionId);
    if (!insertAnswerData || insertAnswerError) return console.log("insert answer error", insertAnswerData, insertAnswerError);

    return router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/${quizEditPath}`);
  };

  const onExit = async () => {
    router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/${quizEditPath}`);
  };

  const showMultipleChoice = (): React.ReactNode => {
    return fields.map((arrayField, index) => {
      return (
        <div key={arrayField.id} className={cn("space-y-2")}>
          <FormLabel htmlFor={`option_${arrayField.id}`} className={cn("text-black", form.formState.errors?.options?.[index]?.answer && "text-red-500")}>
            Option #{index + 1}
          </FormLabel>
          <Input {...form.register(`options.${index}.answer` as const)} id={`option_${arrayField.id}`} type='text' />
          <div className='flex gap-2 items-center'>
            <Checkbox
              defaultChecked={arrayField.is_correct}
              onCheckedChange={(value) => form.setValue(`options.${index}.is_correct`, value as boolean)}
              {...form.register(`options.${index}.is_correct` as const)}
              id={`is_correct_${arrayField.id}`}
            />
            <FormLabel htmlFor={`is_correct_${arrayField.id}`} className={cn("text-black", form.formState.errors?.options?.[index]?.is_correct && "text-red-500")}>
              Correct Answer?
            </FormLabel>
          </div>
          {form.formState.errors?.options?.[index]?.answer && <p className='text-sm text-red-500'>{form.formState.errors?.options?.[index]?.answer?.message}</p>}
          {form.formState.errors?.options?.[index]?.is_correct && <p className='text-sm text-red-500'>{form.formState.errors?.options?.[index]?.is_correct?.message}</p>}
        </div>
      );
    });
  };

  const showIdentification = (): React.ReactNode => {
    return fields.map((arrayField, index) => {
      return (
        <div key={arrayField.id} className='space-y-2'>
          <FormLabel htmlFor={`option_${arrayField.id}`} className={cn("text-black", form.formState.errors?.options?.[index]?.answer && "text-red-500")}>
            Correct Answer
          </FormLabel>
          <Input {...form.register(`options.${index}.answer` as const)} type='text' />
          {form.formState.errors?.options?.[index]?.answer && <p className='text-sm text-red-500'>{form.formState.errors?.options?.[index]?.answer?.message}</p>}
        </div>
      );
    });
  };

  const showTrueOrFalse = (): React.ReactNode => {
    return fields.map((arrayField, index) => {
      return (
        <div key={arrayField.id} className={cn("space-y-2")}>
          <FormLabel htmlFor={`option_${arrayField.id}`} className={cn("text-black", form.formState.errors?.options?.[index]?.answer && "text-red-500")}>
            Option #{index + 1}
          </FormLabel>
          <p className='border text-sm py-1 px-2 rounded-sm select-none' {...form.register(`options.${index}.answer` as const)} id={`option_${arrayField.id}`}>
            {arrayField.answer}
          </p>
          <div className='flex gap-2 items-center'>
            <Checkbox
              defaultChecked={arrayField.is_correct}
              onCheckedChange={(value) => {
                form.setValue(`options.${index}.is_correct`, value as boolean);
                return;
              }}
              {...form.register(`options.${index}.is_correct` as const)}
              id={`is_correct_${arrayField.id}`}
            />
            <FormLabel htmlFor={`is_correct_${arrayField.id}`} className={cn("text-black", form.formState.errors?.options?.[index]?.is_correct && "text-red-500")}>
              Correct Answer?
            </FormLabel>
          </div>
        </div>
      );
    });
  };

  const handleOptionNumberChange = (value: number) => {
    // create an "empty" array for each number of options
    remove();
    for (let i = 0; i < value; i++) {
      append({
        answer: "",
        is_correct: false,
      });
    }
  };

  if (form.formState.isLoading) return <div>Values are loading. Please wait.</div>;

  return (
    <>
      <Form {...form}>
        <form method='post' className='flex flex-col w-full gap-6'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question #{questionNumber}</FormLabel>
                <FormControl>
                  <Input type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='points'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Point(s)</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={String(field.value)}
                    value={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='...' defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"1"}>1</SelectItem>
                      <SelectItem value={"2"}>2</SelectItem>
                      <SelectItem value={"5"}>5</SelectItem>
                      <SelectItem value={"10"}>10</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
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
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Points' defaultValue={field.value} />
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
            <FormField
              control={form.control}
              name='option_count'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Choices</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        fields && remove();
                        handleOptionNumberChange(parseInt(value));
                        form.setValue("option_count", parseInt(value));
                      }}
                      value={String(field.value)}
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
            ></FormField>
          )}

          {/* MULTIPLE CHOICE */}

          {watchType === "Multiple Choice" && showMultipleChoice()}

          {watchType === "Identification" && showIdentification()}

          {watchType === "True or False" && showTrueOrFalse()}
          <div>{form.formState.errors && form.formState.errors.options && <div className='text-destructive'>{form.formState.errors.options.root?.message}</div>}</div>
          <div className='flex justify-end gap-2'>
            <Button variant={"default"} className='' onClick={form.handleSubmit(onUpdateQuestion)}>
              Update Question
            </Button>
            <Button variant={"destructive"} className='' type='button' onClick={onExit}>
              Exit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default QuizQuestionEditForms;
