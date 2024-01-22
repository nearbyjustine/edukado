"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Classroom, ClassroomWithAdviser } from "@/lib/collection.types";
import { Row } from "@tanstack/react-table";
import { createClient } from "@/utils/supabase/client";
import { Check, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import TeacherComboBox from "../combo-box/combo-box-teacher";

const DialogSection = ({ row, classroomId }: { row: Row<Classroom>; classroomId: string }) => {
  const [sectionDetails, setSectionDetails] = useState<ClassroomWithAdviser>();
  const [isEditing, setIsEditing] = useState(false);
  const [currentAdviser, setCurrentAdviser] = useState<string>("");

  const fetchSectionDetails = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("classrooms").select("*, teachers(*, profiles(*))").eq("id", classroomId).single();
    if (!data || error) return console.log(error);
    if (data.teachers?.profiles) setCurrentAdviser(`${data.teachers.profiles.first_name} ${data.teachers.profiles.last_name}`);
    setSectionDetails(data);
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
            {isEditing && (
              <div>
                {sectionDetails.teachers?.profiles && currentAdviser && (
                  <TeacherComboBox sectionId={sectionDetails.id} id={sectionDetails.teachers.id} name={currentAdviser} setCurrentAdviser={setCurrentAdviser} />
                )}
              </div>
            )}
            {!isEditing && currentAdviser && <div>Adviser: {currentAdviser}</div>}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default DialogSection;
