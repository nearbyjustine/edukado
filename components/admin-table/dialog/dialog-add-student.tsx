import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import StudentComboBox from "../combo-box/combo-box-student";
import { createClient } from "@/utils/supabase/client";

const AddStudentToClassroomButtonDialogButton = ({ classroomId, fetch }: { classroomId: string; fetch: () => Promise<void> }) => {
  const [studentId, setStudentId] = useState("");
  const [open, setOpen] = useState(false);
  console.log(classroomId);

  const updateClassroomStudent = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("students").update({ classroom_id: classroomId }).eq("id", studentId).select().single();
    console.log(data, error);
    setOpen(false);
    await fetch();
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <div className='flex gap-2 hover:text-primary/80 text-primary font-bold transition-colors cursor-pointer'>
          <span>
            <PlusCircle />
          </span>
          <span>Add Student</span>
        </div>
      </DrawerTrigger>
      <DrawerContent className='flex items-center'>
        <div className='w-full sm:w-1/3 '>
          <DrawerHeader>
            <DrawerTitle>Add Student</DrawerTitle>
          </DrawerHeader>
          <div>
            <StudentComboBox setStudentId={setStudentId} classroomId={classroomId} className='w-full' />
          </div>
          <DrawerFooter>
            <Button onClick={updateClassroomStudent}>Submit</Button>
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

export default AddStudentToClassroomButtonDialogButton;
