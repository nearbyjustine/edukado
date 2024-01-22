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

const StudentComboBox = ({ className, setStudentId }: { className?: string; setStudentId: Dispatch<SetStateAction<string>> }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [students, setStudents] = useState<StudentList[]>();

  useEffect(() => {
    const fetchAllStudents = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("students").select("*, profiles!students_user_id_fkey(*)");
      if (error || !data) return console.log(error);
      setStudents(data.map((student) => ({ name: `${student.profiles?.first_name} ${student.profiles?.last_name}`, id: student.id })));
    };
    fetchAllStudents();
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
            {value && students ? students.find((student) => student.name === value)?.name : "Select student..."}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-full'>
        <Command>
          <CommandInput placeholder='Search student...' />
          <CommandEmpty>No student found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className='h-[200px]'>
              {students &&
                students.map((student) => (
                  <CommandItem
                    key={student.id}
                    value={student.name}
                    onSelect={(currentValue) => {
                      setValue(student.name);
                      setOpen(false);
                      setStudentId(student.id);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === student.name ? "opacity-100" : "opacity-0")} />
                    {student.name}
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StudentComboBox;
