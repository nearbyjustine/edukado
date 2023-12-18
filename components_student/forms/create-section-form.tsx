import React, { Dispatch, SetStateAction } from "react";
import { DialogTitle, DialogDescription, DialogHeader, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { GradeLevelEnum } from "@/lib/collection.types";

const CreateSectionFormDialog = ({ gradeValue, setGradeValue }: { gradeValue: GradeLevelEnum | string; setGradeValue: Dispatch<SetStateAction<GradeLevelEnum | string>> }) => {
  const CreateSectionSchema = z.object({
    grade_level: z.string({ required_error: "Grade level is required" }),
    section: z.string({ required_error: "Grade level is required" }),
  });

  type CreateSectionType = z.infer<typeof CreateSectionSchema>;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateSectionType>({ resolver: zodResolver(CreateSectionSchema) });

  const onSubmit: SubmitHandler<CreateSectionType> = async (data) => {};
  return (
    <div>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Section</DialogTitle>
            <DialogDescription>Create a section for your class. Then click add section to make </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='grade_level' className='text-right'>
                Grade Level
              </Label>
              <Select
                {...register("grade_level")}
                value={gradeValue}
                onValueChange={async (value: GradeLevelEnum) => {
                  setGradeValue(value);
                }}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select grade level' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select grade level</SelectLabel>
                    <SelectItem value='Grade 1'>Grade 1</SelectItem>
                    <SelectItem value='Grade 2'>Grade 2</SelectItem>
                    <SelectItem value='Grade 3'>Grade 3</SelectItem>
                    <SelectItem value='Grade 4'>Grade 4</SelectItem>
                    <SelectItem value='Grade 5'>Grade 5</SelectItem>
                    <SelectItem value='Grade 6'>Grade 6</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='section' className='text-right'>
              Section name
            </Label>
            <Input {...register("section")} id='section' placeholder='Type section name here...' className='col-span-3' />
          </div>
          <DialogFooter>
            <Button type='submit'>Add section</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </div>
  );
};

export default CreateSectionFormDialog;
