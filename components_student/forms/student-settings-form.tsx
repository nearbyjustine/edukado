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
import { UserInformation } from "@/lib/collection.types";
import { useRouter } from "next/navigation";
import { redirectToSettingsPageActionStudent } from "@/actions/redirect-to-subject-page";

const StudentSettingsForm = () => {
  const [userInformation, setUserInformation] = React.useState<UserInformation>();
  const [userId, setUserId] = React.useState<string>();
  const router = useRouter();
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

      if (!userInformation) {
        const { data, error } = await supabase.from("student_information").insert({ ...values, student_id: userId as string });
        router.refresh();
        if (error) throw Error(error.message);
      } else {
        const { data, error } = await supabase
          .from("student_information")
          .update({ ...values })
          .eq("id", userInformation.id);
        router.refresh();

        if (error) throw Error(error.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      await redirectToSettingsPageActionStudent();
      router.refresh();
    }
  };

  React.useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) throw Error(userError?.message);
        setUserId(user.id);

        const { data, error } = await supabase.from("student_information").select("*").eq("student_id", user.id).single();
        if (error || !data) throw Error(error?.message);

        setUserInformation(data);

        data.address && form.setValue("address", data.address);
        data.contact_number_parent_guardian && form.setValue("contact_number_parent_guardian", data.contact_number_parent_guardian);
        data.father_name && form.setValue("father_name", data.father_name);
        data.guardian_name && form.setValue("guardian_name", data.guardian_name);
        data.guardian_relationship && form.setValue("guardian_relationship", data.guardian_relationship);
        data.ip && form.setValue("ip", data.ip);
        data.lrn && form.setValue("lrn", data.lrn);
        data.mother_name && form.setValue("mother_name", data.mother_name);
        data.mother_tongue && form.setValue("mother_tongue", data.mother_tongue);
        data.religion && form.setValue("religion", data.religion);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserInformation();
  }, []);

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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select Mother Tongue' defaultValue={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {motherTongueEnum.map((v, index) => (
                      <SelectItem key={index} value={v.toString()}>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select Ethnicity' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ethicEnum.map((v, index) => (
                      <SelectItem key={index} value={v.toString()}>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select Religion' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {religionEnum.map((v, index) => (
                      <SelectItem key={index} value={v.toString()}>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select Relationship with Guardian' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {guardianRelationshipEnum.map((v, index) => (
                        <SelectItem key={index} value={v.toString()}>
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
          <Button disabled={form.formState.isSubmitting} type='submit'>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StudentSettingsForm;
