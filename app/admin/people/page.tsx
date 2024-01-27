import { DataTable } from "@/components/admin-table/classroom-datatable";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import React from "react";
import { StudentColumns, TeacherColumns } from "./student-column";
import { Classroom } from "@/lib/collection.types";

export type PeopleAdmin = {
  classroom_id: string;
  created_at: string;
  id: string;
  user_id: string;
  profiles: {
    avatar_url: string;
    birth_date: string;
    first_name: string;
    gender: string;
    id: string;
    last_name: string;
    middle_name: string;
    updated_at: string | null;
  } | null;
  classrooms: Classroom | null;
};

export type StudentsArray = {
  name: string;
  grade_and_section: string;
};

export type TeachersArray = {
  name: string;
};

const PeoplePage = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const students = await supabase.from("students").select("*, profiles!students_user_id_fkey(*), classrooms(*)");
  const teachers = await supabase.from("teachers").select("*, profiles!teachers_user_id_fkey(*)");

  if (students.error || !students.data) {
    console.log(students);
    return <div>Something happened</div>;
  }
  if (teachers.error || !teachers.data) return <div>Something happened</div>;

  const studentsArray = students.data.map((v) => {
    return {
      name: v.profiles?.last_name + ", " + v.profiles?.first_name,
      grade_and_section: v.classrooms?.grade_level + " - " + v.classrooms?.section,
    };
  });
  const teachersArray = teachers.data.map((v) => {
    return {
      name: v.profiles?.last_name + ", " + v.profiles?.first_name,
    };
  });
  return (
    <div className='mt-10 flex gap-4'>
      <div className='flex-1'>
        <div className='font-bold'>Students</div>
        {studentsArray && <DataTable columns={StudentColumns} data={studentsArray} />}
      </div>
      <div className='flex-1'>
        <div className='font-bold'>Teachers</div>
        {teachers && <DataTable columns={TeacherColumns} data={teachersArray} />}
      </div>
    </div>
  );
};

export default PeoplePage;
