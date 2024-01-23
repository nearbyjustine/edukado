"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { DialogClose } from "@radix-ui/react-dialog";
import { ClipboardList, Pencil, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const LessonBox = ({ title, lessonId, subjectId }: { title: string; lessonId: number; subjectId: string }) => {
  const [hidden, setHidden] = useState(false);
  const handleDelete = async () => {
    const supabase = createClient();
    const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
    if (error) return console.error(error);
    setHidden(true);
  };
  return (
    <div className={cn("gap-4 items-center group", hidden ? "hidden" : "flex")}>
      <Link className='flex-1' href={`${process.env.NEXT_PUBLIC_SITE_URL}/teacher/subjects/${subjectId}/lesson/${lessonId}`}>
        <div className='flex justify-between py-2 pl-6 pr-2 border hover:bg-primary/10 transition-colors rounded-md '>
          <div className='flex gap-4 items-center'>
            <div className='bg-green-500 rounded-3xl h-auto w-auto p-2 text-white'>
              <ClipboardList width={25} height={25} className='' />
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>{title}</p>
            </div>
          </div>
        </div>
      </Link>
      <Link className='cursor-pointer hidden group-hover:inline-block hover:text-primary' href={`${process.env.NEXT_PUBLIC_SITE_URL}/teacher/subjects/${subjectId}/lesson/${lessonId}/edit`}>
        <Pencil width={20} height={20} />
      </Link>
      <Dialog>
        <DialogTrigger>
          <button className='cursor-pointer align-middle hidden group-hover:inline-block hover:text-destructive'>
            <X width={20} height={20} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this?</DialogTitle>
          </DialogHeader>
          <DialogDescription>This action cannot be undone. This will permanently this.</DialogDescription>
          <DialogFooter>
            <DialogClose>
              <Button onClick={handleDelete} variant={"destructive"}>
                Delete
              </Button>
              <Button variant={"ghost"}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonBox;
