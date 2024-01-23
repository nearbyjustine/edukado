import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { createClient } from "@/utils/supabase/client";
import TeacherSubjectComboBox from "../combo-box/combo-box-teacher-subject";
import { User } from "@/lib/collection.types";

const ChangeSubjectTeacherDialog = ({
  classroomId,
  subjectId,
  fetch,
  subjectName,
  currentTeacherId,
}: {
  classroomId: string;
  subjectId: string;
  subjectName: string;
  fetch: () => Promise<void>;
  currentTeacherId: string | null;
}) => {
  const [teacherId, setTeacherId] = useState(currentTeacherId);
  const [currentTeacher, setCurrentTeacher] = useState<User | null>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCurrentSubjectTeacher = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("subjects").select("*, teachers(*, profiles(*))").eq("id", subjectId).single();
      if (!data || error) return console.log(error);
      if (data.teachers) {
        setTeacherId(data.teachers.id);
        setCurrentTeacher(data.teachers.profiles);
      }
    };

    fetchCurrentSubjectTeacher();
  }, []);

  const updateClassroomTeacher = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("subjects").update({ teacher_id: teacherId }).eq("id", subjectId).select("*, teachers(*, profiles(*))").single();
    if (data && data.teachers && data.teachers.profiles) {
      setCurrentTeacher(data.teachers.profiles);
      setTeacherId(data.teachers.id);
    }
    setOpen(false);
    await fetch();
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <div className='flex gap-2 hover:text-primary/80 text-primary transition-colors cursor-pointer'>
          <span>{subjectName}</span>
        </div>
      </DrawerTrigger>
      <DrawerContent className='flex items-center'>
        <div className='w-full sm:w-1/3 '>
          <DrawerHeader>
            <DrawerTitle>{subjectName}: Add Teacher</DrawerTitle>
          </DrawerHeader>
          <div>
            <TeacherSubjectComboBox currentTeacherName={`${currentTeacher?.first_name} ${currentTeacher?.last_name}`} setTeacherId={setTeacherId} className='w-full' />
          </div>
          <DrawerFooter>
            <Button onClick={updateClassroomTeacher}>Submit</Button>
            <DrawerClose>
              <Button className='w-full' variant='outline'>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ChangeSubjectTeacherDialog;
