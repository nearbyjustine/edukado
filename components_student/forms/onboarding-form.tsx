"use client";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Link } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import format from "date-fns/format";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { OnboardingSchemaType, onboardingSchema } from "@/schema_student/onboarding-form.schema";
import { updateStudentUser, updateUser, updateUserHasOnboarded } from "@/actions_student/update-user-details";
import { fetchClassroomsOnGradeLevel } from "@/actions_student/section/fetch-classroom";
import { Classroom, GradeLevelEnum } from "@/lib/collection.types";

export const OnboardingForm = ({ className }: { className?: string }) => {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");
  const [sections, setSections] = useState<Classroom[]>();
  // const [gradeLevel, setGradeLevel] = useState("");
  // const [section, setSection] = useState("");

  const onSubmit = (values: OnboardingSchemaType) => {
    startTransition(async () => {
      const { grade_level, section, ...otherValues } = values;
      const error = await updateStudentUser(otherValues, grade_level, section);
      console.log(error);
      if (!error) {
        const onboardingError = await updateUserHasOnboarded();
        if (!onboardingError) return redirect("/");

        return setServerError(onboardingError.message);
      }
      return setServerError(error.message);
    });
  };

  const handleFetchSection = async (e: GradeLevelEnum) => {
    const data = await fetchClassroomsOnGradeLevel(e);
    if (data.error && !data.data) return setServerError(data.error.message);
    setSections(data.data);
    form.setValue("section", "");
  };

  const form = useForm<OnboardingSchemaType>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      birth_date: new Date(),
      grade_level: "",
      section: "",
    },
  });

  const Required = () => {
    return <span className='align-top text-destructive font-semibold'>*</span>;
  };

  return (
    <Form {...form}>
      <form method='post' onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4 mt-5", className)}>
        <FormField
          control={form.control}
          name='first_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                First Name
                <Required />
              </FormLabel>
              <FormControl>
                <Input placeholder='Juan' {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='middle_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input placeholder='Malvar' {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='last_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Last Name
                <Required />
              </FormLabel>
              <FormControl>
                <Input placeholder='dela Cruz' {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='gender'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Gender
                <Required />
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select gender' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Male'>Male</SelectItem>
                  <SelectItem value='Female'>Female</SelectItem>
                  <SelectItem value='Other'>Other</SelectItem>
                  <SelectItem value='Prefer not to say'>Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='birth_date'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>
                Date of birth
                <Required />
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button disabled={isPending} variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                      {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    captionLayout='dropdown-buttons'
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    fromYear={1960}
                    toYear={2023}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='grade_level'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade Level</FormLabel>
              <Select
                onValueChange={(e) => {
                  handleFetchSection(e as GradeLevelEnum);
                  field.onChange(e);
                }}
                defaultValue={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select grade level' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Grade 1'>Grade 1</SelectItem>
                  <SelectItem value='Grade 2'>Grade 2</SelectItem>
                  <SelectItem value='Grade 3'>Grade 3</SelectItem>
                  <SelectItem value='Grade 4'>Grade 4</SelectItem>
                  <SelectItem value='Grade 5'>Grade 5</SelectItem>
                  <SelectItem value='Grade 6'>Grade 6</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='section'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section</FormLabel>
              <Select
                onValueChange={(e) => {
                  field.onChange(e);
                }}
                defaultValue={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select section' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sections &&
                    sections.map((section) => (
                      <SelectItem key={section.id} value={section.section}>
                        {section.section}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='text-sm text-destructive/70 grid '>{serverError && <span>* {serverError}</span>}</div>
        <Button variant='default' disabled={isPending} type='submit'>
          Submit
        </Button>
      </form>
    </Form>
  );
};
