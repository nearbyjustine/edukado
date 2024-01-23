"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Classroom, ClassroomWithAdviser, Student, StudentWithClassroom } from "@/lib/collection.types";
import { Row } from "@tanstack/react-table";
import { createClient } from "@/utils/supabase/client";
import { Check, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import TeacherComboBox from "../combo-box/combo-box-teacher";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import AddStudentToClassroomButtonDialogButton from "./dialog-add-student";
import { ScrollArea } from "@/components/ui/scroll-area";

const DialogSection = ({ row, classroomId }: { row: Row<Classroom>; classroomId: string }) => {
  const [sectionDetails, setSectionDetails] = useState<ClassroomWithAdviser>();
  const [students, setStudents] = useState<Student[] | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentAdviser, setCurrentAdviser] = useState<string>("");
  const [currentAdviserId, setCurrentAdviserId] = useState<string>("");

  const fetchSectionDetails = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("classrooms").select("*, teachers(*, profiles(*))").eq("id", classroomId).single();
    if (!data || error) return console.log(error);
    if (data.teachers?.profiles) {
      setCurrentAdviser(`${data.teachers.profiles.first_name} ${data.teachers.profiles.last_name}`);
      setCurrentAdviserId(data.teachers.id);
    }

    const { data: subjects, error: subjectsError } = await supabase.from("subjects").select("*, ");

    setSectionDetails(data);

    // also fetch all students belonging to the classroom
    const { data: studentsData, error: studentsError } = await supabase.from("students").select("*, profiles!students_id_fkey(*)").eq("classroom_id", classroomId);
    if (!error && studentsData) setStudents(studentsData);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <div onClick={fetchSectionDetails} className='text-primary cursor-pointer'>
            {row.getValue("section")}
          </div>
        </DialogTrigger>
        {sectionDetails && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='flex gap-2 items-center'>
                <div>
                  {sectionDetails.grade_level} - {sectionDetails.section}
                </div>
                <div onClick={() => setIsEditing((prev) => !prev)}>
                  {!isEditing && <Edit className={cn("cursor-pointer text-primary")} />}
                  {isEditing && <Check className={"cursor-pointer text-primary"} />}
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className='flex gap-4 items-center'>
              <span className='font-bold'>Adviser</span>
              {isEditing && (
                <div>
                  {sectionDetails.teachers?.profiles && currentAdviser && (
                    <TeacherComboBox
                      sectionId={sectionDetails.id}
                      id={sectionDetails.teachers.id}
                      name={currentAdviser}
                      setCurrentAdviser={setCurrentAdviser}
                      setCurrentAdviserId={setCurrentAdviserId}
                      setIsEditing={setIsEditing}
                    />
                  )}
                </div>
              )}
              {!isEditing && currentAdviser && (
                <div>
                  <Link href={`/admin/teacher/${currentAdviserId}`} className='text-primary'>
                    {currentAdviser}
                  </Link>
                </div>
              )}
            </div>
            <Separator />
            <div className='font-bold'>Students</div>
            {students && students.length > 0 && (
              <ScrollArea className='h-[200px] p-2'>
                <div className='flex flex-col gap-2'>
                  {students.map((student) => (
                    <div key={student.id} className=''>
                      <Link href={`/admin/student/${student.id}`} className='text-primary'>
                        {student.profiles?.first_name} {student.profiles?.last_name}
                      </Link>

                      <Separator className='mt-2' />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            {!students || (students.length === 0 && <div>No students as of now</div>)}
            <AddStudentToClassroomButtonDialogButton fetch={fetchSectionDetails} classroomId={sectionDetails.id} />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default DialogSection;
