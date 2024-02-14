"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import { Teacher, TeacherWithProfile, User } from "@/lib/collection.types";

import { Check, CheckCircle2, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createClient } from "@/utils/supabase/client";
import { truncate } from "fs";

type TeachersList = {
  name: string;
  id: string;
};

const TeacherComboBox = ({
  name,
  id,
  gradeLevel,
  sectionId,
  setCurrentAdviser,
  setIsEditing,
  setCurrentAdviserId,
}: {
  name: string;
  id: string | undefined;
  sectionId: string;
  gradeLevel: string;
  setCurrentAdviser: React.Dispatch<React.SetStateAction<string>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentAdviserId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(name);
  const [selectedTeacherId, setSelectedTeacherId] = useState(id);
  const [teachers, setTeachers] = useState<TeachersList[]>();
  const [hasSaved, setHasSaved] = useState(true);

  useEffect(() => {
    const fetchAllTeachers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("teachers").select("*, profiles(*)").eq("grade_level", gradeLevel);
      if (error || !data) return console.error(error);
      const teacherList: TeachersList[] = data.map((v) => ({ name: `${v.profiles?.first_name} ${v.profiles?.last_name}`, id: v.id }));
      return setTeachers(teacherList);
    };
    fetchAllTeachers();
  }, []);

  const updateCurrentAdviser = async (id: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.from("classrooms").update({ adviser_id: id }).eq("id", sectionId);
    setIsEditing(false);
  };

  return (
    <div className='flex gap-4 items-center'>
      <Popover
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
        }}
      >
        <PopoverTrigger asChild>
          <div>
            <Button variant='outline' role='combobox' aria-expanded={open} className='w-[200px] justify-between'>
              {value && teachers ? teachers.find((teacher) => teacher.name === value)?.name : "Select teacher..."}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandInput placeholder='Search teacher...' />
            <CommandEmpty>No teacher found.</CommandEmpty>
            <CommandGroup>
              {teachers &&
                teachers.map((teacher) => (
                  <CommandItem
                    key={teacher.id}
                    value={teacher.name}
                    onSelect={(currentValue) => {
                      setHasSaved(false);
                      setValue(teacher.name);
                      setSelectedTeacherId(teacher.id);
                      setCurrentAdviser(teacher.name);
                      setCurrentAdviserId(teacher.id);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === teacher.name ? "opacity-100" : "opacity-0")} />
                    {teacher.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div>
        {!hasSaved && (
          <CheckCircle2
            className='text-primary cursor-pointer'
            onClick={() => {
              updateCurrentAdviser(selectedTeacherId || "");
              setHasSaved((p) => !p);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherComboBox;
