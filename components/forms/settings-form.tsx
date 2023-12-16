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
import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { FormSchemaType, formSchema } from "@/schema/onboarding-form.schema";
import { updateUser, updateUserHasOnboarded } from "@/actions/update-user-details";
import { fetchUserDetails } from "@/actions/fetch-user-details";
import { createClient } from "@/utils/supabase/client";
import { User } from "@/lib/collection.types";

export const SettingsForm = ({ className, userDetails }: { className?: string; userDetails: User }) => {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");
  const [user, setUser] = useState<User>(userDetails);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserOnLoad = async () => {
      const { user, error } = await fetchUserDetails();
      if (!error && user) {
        setUser(user);
        return;
      }
      return console.error(error);
    };

    fetchUserOnLoad();
  }, []);

  const onSubmit = (values: FormSchemaType) => {
    startTransition(async () => {
      const error = await updateUser(values);

      if (!error) {
        const { user, error: userError } = await fetchUserDetails();
        if (!userError) {
          setUser(user);
          form.setValue("first_name", user.first_name, { shouldValidate: true });
          form.setValue("middle_name", user.middle_name, { shouldValidate: true });
          form.setValue("last_name", user.last_name, { shouldValidate: true });
          form.setValue("gender", user.gender, { shouldValidate: true });
          form.setValue("birth_date", new Date(user.birth_date), { shouldValidate: true });
          return;
        }

        return setServerError(userError.message);
      }
      return setServerError(error.message);
    });
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      gender: user.gender,
      birth_date: new Date(user.birth_date),
    },
  });

  const Required = () => {
    return <span className='align-top text-destructive font-semibold'>*</span>;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4 mt-5", className)}>
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
        <div className='text-sm text-destructive/70 grid '>{serverError && <span>* {serverError}</span>}</div>
        <Button variant='default' disabled={isPending} type='submit'>
          Submit
        </Button>
      </form>
    </Form>
  );
};
