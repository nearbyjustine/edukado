"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Student, Teacher, TeacherWithProfile, User } from "@/lib/collection.types";

import { Check, CheckCircle2, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createClient } from "@/utils/supabase/client";
import { truncate } from "fs";
import { ScrollArea } from "@/components/ui/scroll-area";

type StudentList = {
  name: string;
  id: string;
};

const TeacherSubjectComboBox = ({ className, setTeacherId, currentTeacherName }: { className?: string; setTeacherId: Dispatch<SetStateAction<string | null>>; currentTeacherName: string }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(currentTeacherName);
  const [teachers, setTeachers] = useState<StudentList[]>();

  useEffect(() => {
    const fetchAllTeachers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("teachers").select("*, profiles!teachers_user_id_fkey(*)");
      if (error || !data) return console.log(error);
      setTeachers(data.map((teacher) => ({ name: `${teacher.profiles?.first_name} ${teacher.profiles?.last_name}`, id: teacher.id })));
    };
    fetchAllTeachers();
  }, []);

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <PopoverTrigger asChild>
        <div>
          <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
            {value && teachers ? teachers.find((teacher) => teacher.name === value)?.name : "Select teacher..."}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-full'>
        <Command>
          <CommandInput placeholder='Search teacher...' />
          <CommandEmpty>No teacher found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className='h-[200px]'>
              {teachers &&
                teachers.map((teacher) => (
                  <CommandItem
                    key={teacher.id}
                    value={teacher.name}
                    onSelect={(currentValue) => {
                      setValue(teacher.name);
                      setOpen(false);
                      setTeacherId(teacher.id);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === teacher.name ? "opacity-100" : "opacity-0")} />
                    {teacher.name}
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TeacherSubjectComboBox;
