import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentsArray } from "./page";
import { Row } from "@tanstack/react-table";
import { Classroom, GradeLevelEnum, StudentWithClassroom } from "@/lib/collection.types";

const StudentGradeSelect = ({ row }: { row: Row<StudentsArray> }) => {
  const [sections, setSections] = useState<Classroom[]>();
  const [gradeLevel, setGradeLevel] = useState<GradeLevelEnum>();
  const [classroomId, setClassroomId] = useState("");

  useEffect(() => {
    console.log();
    const fetchAll = async () => {};

    fetchAll();
  }, []);

  const handleGradeLevel = async () => {
    const supabase = createClient();
    await supabase.from("students").update({ classroom_id: classroomId }).eq("id", row.original.id);
  };

  // useEffect(() => {
  //   console.log(sections);
  // }, [sections]);

  return (
    <Select onValueChange={handleGradeLevel}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder={row.getValue("grade")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='Grade 1'>Grade 1</SelectItem>
        <SelectItem value='Grade 2'>Grade 2</SelectItem>
        <SelectItem value='Grade 3'>Grade 3</SelectItem>
        <SelectItem value='Grade 4'>Grade 4</SelectItem>
        <SelectItem value='Grade 5'>Grade 5</SelectItem>
        <SelectItem value='Grade 6'>Grade 6</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StudentGradeSelect;
