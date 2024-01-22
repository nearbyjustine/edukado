"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleUser, CircleUserRound, School2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const AdminDashboard = () => {
  const [teachersCount, setTeachers] = useState<number>();
  const [studentsCount, setStudents] = useState<number>();
  const [classroomsCount, setClassrooms] = useState<number>();

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const teachers = await supabase.from("teachers").select("*", { count: "exact" });
      const students = await supabase.from("students").select("*", { count: "exact" });
      const classrooms = await supabase.from("classrooms").select("*", { count: "exact" });

      if (teachers.error || students.error || classrooms.error || !teachers.count || !students.count || !classrooms.count) return console.log(teachers.error, students.error, classrooms.error);
      setTeachers(teachers.count);
      setStudents(students.count);
      setClassrooms(classrooms.count);
    };

    fetch();
  }, []);

  if (!teachersCount || !studentsCount || !classroomsCount) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='flex gap-4'>
        <Card className='bg-primary text-primary-foreground'>
          <CardHeader>
            <CardTitle className='font-bold'>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col justify-center items-center gap-6'>
              <CircleUserRound width={75} height={75} strokeWidth={1.5} />
              <div className='font-bold text-xl bg-primary-foreground text-primary py-2 px-4  rounded-md'>{studentsCount} Students</div>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-primary text-primary-foreground'>
          <CardHeader>
            <CardTitle className='font-bold'>Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col justify-center items-center gap-6'>
              <CircleUser width={75} height={75} strokeWidth={1.5} />
              <div className='font-bold text-xl bg-primary-foreground text-primary py-2 px-4  rounded-md'>{teachersCount} Teachers</div>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-primary text-primary-foreground'>
          <CardHeader>
            <CardTitle className='font-bold'>Total Classrooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col justify-center items-center gap-6'>
              <School2 width={75} height={75} strokeWidth={1.5} />
              <div className='font-bold text-xl bg-primary-foreground text-primary py-2 px-4  rounded-md'>{classroomsCount} classrooms</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
