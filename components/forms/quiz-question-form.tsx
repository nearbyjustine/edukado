"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import addQuestion from "@/actions/question/add-question";
import addAnswers from "@/actions/answers/add-answers";
import { fetchQuestionsCount } from "@/actions/question/fetch-all-questions";
import { revalidatePathURL } from "@/actions/redirect-to-subject-page";
import { unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";

const QuestionTypeSchema = z.enum(["Multiple Choice", "Identification", "True or False"], { required_error: "Question Type is required" });
export const OptionsTypeSchema = z
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
export const QuizQuestionSchema = z.object({
  title: z.string({ required_error: "Quiz Title is required" }),
  type: QuestionTypeSchema,
  options: OptionsTypeSchema,
  points: z.coerce.number({ required_error: "Points is required" }).min(0),
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

const QuizQuestionForm = ({ quizId }: { quizId: string }) => {
  const [questionNumber, setQuestionNumber] = useState<number>();
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const form = useForm<z.infer<typeof QuizQuestionSchema>>({
    resolver: zodResolver(QuizQuestionSchema),
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
    const fetchAllQuestion = async () => {
      unstable_noStore();
      const { count, error } = await fetchQuestionsCount(quizId);
      if (!error && count) return setQuestionNumber((count && count + 1) || 1);
    };

    fetchAllQuestion();
    // set the state on question number as the next question
  }, [questionNumber]);

  const watchType = useWatch<z.infer<typeof QuizQuestionSchema>>({ control: form.control, name: "type" });

  const submitAnswer = async (options: z.infer<typeof OptionsTypeSchema>, questionId: string) => {
    // insert mo ung kada option sa db
    // insert mo ung id ng bawat option sa question_answers kasama ung questionId

    const { data, error } = await addAnswers(options, questionId);

    if (error) form.setError("root", { message: error.message });

    return { data, error };
  };

  const createQuestion = async (values: z.infer<typeof QuizQuestionSchema>) => {
    // after mong maginsert ng quiz, get mo ung id tapos return
    const { data, error } = await addQuestion(values, quizId);
    console.log("insert question", data, error);
    if (error || !data) return console.error(error);
    const { id } = data;
    return id;
  };

  const onNextQuestion = async (values: z.infer<typeof QuizQuestionSchema>) => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log(form.formState.isValid);
      return console.error("form is invalid");
    }
    let isCorrectCount = 0;
    if (values.options.length === 0) form.setError("root", { message: "Choices must not be empty" });

    values.options.forEach((val, index) => {
      if (val.is_correct === true) isCorrectCount++;
      if (val.answer === "") form.setError(`options.${index}.answer`, { message: "Answer must not be empty" });
    });

    const questionId = await createQuestion(values);
    const { data, error } = await submitAnswer(values.options, questionId as string);
    if (error) return console.error(error);

    form.reset();
    form.setValue("type", "Multiple Choice");
    form.setValue("title", "");

    setQuestionNumber((prev) => prev && prev + 1);
  };

  const onExit = async () => {
    router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/${path.split("/").slice(0, -1).join("/")}/edit?type=${type}`);
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
              onCheckedChange={(value) => form.setValue(`options.${index}.is_correct`, value as boolean)}
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
        <form method='post' onSubmit={form.handleSubmit(onNextQuestion)} className='flex flex-col w-full gap-6'>
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
                <FormMessage />
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
                    fields && remove();
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

          {watchType === "Multiple Choice" && showMultipleChoice()}

          {watchType === "Identification" && showIdentification()}

          {watchType === "True or False" && showTrueOrFalse()}

          <div>{form.formState.errors && form.formState.errors.options && <div className='text-destructive'>{form.formState.errors.options.root?.message}</div>}</div>
          <div className='flex justify-end gap-2'>
            <Button
              disabled={form.formState.isSubmitting}
              variant={"default"}
              className=''
              onClick={() => {
                console.log(form.formState.errors);
              }}
            >
              Add Question
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

export default QuizQuestionForm;
