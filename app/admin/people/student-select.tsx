import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentsArray } from "./page";
import { Row } from "@tanstack/react-table";
import { Classroom, GradeLevelEnum, StudentWithClassroom } from "@/lib/collection.types";

const StudentSelect = ({ row }: { row: Row<StudentsArray> }) => {
  const [sections, setSections] = useState<Classroom[]>();
  const [gradeLevel, setGradeLevel] = useState<GradeLevelEnum>();
  useEffect(() => {
    const fetchAll = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("students").select("*, classrooms(*)").eq("id", row.original.id).single();
      if (!data || error) return console.error("students section row", error);
      const grade = data.classrooms?.grade_level;
      setGradeLevel(grade);
      const { data: sections, error: sectionsError } = await supabase
        .from("classrooms")
        .select("*")
        .eq("grade_level", row.original.grade as string);
      // console.log(row.getValue("grade"));
      if (!sections || sectionsError) return console.error("section row", sectionsError);
      setSections(sections);
    };

    fetchAll();
  }, []);

  // useEffect(() => {
  //   console.log(sections);
  // }, [sections]);

  return (
    <Select>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder={row.getValue("section")} />
      </SelectTrigger>
      <SelectContent>{sections && sections.map((v) => <SelectItem value={v.section}>{v.section}</SelectItem>)}</SelectContent>
    </Select>
  );
};

export default StudentSelect;
