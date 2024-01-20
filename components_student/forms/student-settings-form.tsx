"use client";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ethicEnum, guardianRelationshipEnum, motherTongueEnum, religionEnum } from "@/lib/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Required } from "./settings-form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { isMobilePhone } from "validator";

const StudentSettingsForm = () => {
  const StudentInformationSchema = z
    .object({
      lrn: z.coerce.number({ invalid_type_error: "Invalid LRN Format" }).int().gte(100000000000, { message: "Invalid LRN Format" }).lte(999999999999, { message: "Invalid LRN Format" }),
      mother_tongue: z.enum(motherTongueEnum),
      ip: z.enum(ethicEnum),
      religion: z.enum(religionEnum),
      address: z.string(),
      father_name: z.string().optional(),
      mother_name: z.string().optional(),
      guardian_name: z.string().optional(),
      guardian_relationship: z.enum(guardianRelationshipEnum).optional(),
      contact_number_parent_guardian: z.string().refine((value) => isMobilePhone(value, "en-PH"), { message: "Invalid phone format" }),
    })
    .refine(
      (data) =>
        // refine this more -- its not working
        (data.father_name !== undefined && data.mother_name !== undefined && data.guardian_name !== undefined) || (data.father_name !== "" && data.mother_name !== "" && data.guardian_name !== ""),
      {
        message: "Guardian name should be supplied if parents field are not",
        path: ["guardian_name"],
      }
    );

  const form = useForm<z.infer<typeof StudentInformationSchema>>({
    resolver: zodResolver(StudentInformationSchema),
    reValidateMode: "onChange",
  });

  const guardianName = form.watch("guardian_name");

  const onSubmit = async (values: z.infer<typeof StudentInformationSchema>) => {
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("student_information").insert({ ...values, student_id: user?.id as string });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form method='post' className='space-y-4 w-[25rem]' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='lrn'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Learner's Reference Number (LRN)</FormLabel>
                <FormControl>
                  <Input {...field} type='text' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='mother_tongue'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother Tongue</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select Mother Tongue' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {motherTongueEnum.map((v, index) => (
                      <SelectItem key={index} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='ip'
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP (Ethnic Group)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select Ethnicity' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ethicEnum.map((v, index) => (
                      <SelectItem key={index} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='religion'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select Religion' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {religionEnum.map((v, index) => (
                      <SelectItem key={index} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='father_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Name</FormLabel>
                <FormControl>
                  <Input {...field} type='text' />
                </FormControl>
                <FormDescription>(Last Name, First Name, Middle Name)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='mother_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Name</FormLabel>
                <FormControl>
                  <Input {...field} type='text' />
                </FormControl>
                <FormDescription>(Last Name, First Name, Middle Name)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='guardian_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian's Name</FormLabel>
                <FormControl>
                  <Input {...field} type='text' />
                </FormControl>
                <FormDescription>(Last Name, First Name, Middle Name)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {guardianName && (
            <FormField
              control={form.control}
              name='guardian_relationship'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian Relationship</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select Relationship with Guardian' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {guardianRelationshipEnum.map((v, index) => (
                        <SelectItem key={index} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} type='text' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='contact_number_parent_guardian'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number of Parent or Guardian</FormLabel>
                <FormControl>
                  <Input {...field} type='text' />
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

export default StudentSettingsForm;
