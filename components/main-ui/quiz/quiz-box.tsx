"use client";

import { deleteActivity } from "@/actions/activity/delete-activity-client";
import { QuizFormSchema } from "@/components/forms/quiz-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { DialogClose } from "@radix-ui/react-dialog";
import { ClipboardList, Pencil, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

const QuizBox = ({
  title,
  date_open,
  date_close,
  quizId,
  totalPoints,
  subjectId,
}: {
  title: string;
  date_open: string;
  date_close: string;
  quizId: string;
  totalPoints: number;
  subjectId: string;
}) => {
  const [hidden, setHidden] = useState(false);
  const handleDeleteActivity = async () => {
    const supabase = createClient();
    await supabase.from("quizzes").delete().eq("id", quizId);
    // const response = await deleteActivity(activityId);
    // if (response.error) console.log(response.error);
    setHidden(true);
  };
  return (
    <div className={cn("gap-4 items-center group", hidden ? "hidden" : "flex")}>
      <Link className='flex-1' href={`${process.env.NEXT_PUBLIC_SITE_URL}/teacher/subjects/${subjectId}/quiz/${quizId}`}>
        <div className='flex justify-between py-2 pl-6 pr-2 border hover:bg-primary/10 transition-colors rounded-md '>
          <div className='flex gap-4 items-center'>
            <div className='bg-green-500 rounded-3xl h-auto w-auto p-2 text-white'>
              <ClipboardList width={25} height={25} className='' />
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>{title}</p>
              <p>{`${date_open} - ${date_close}`}</p>
            </div>
          </div>
          <div>
            <p className='py-1 px-2 bg-primary text-sm text-primary-foreground rounded-md'>Total points: {totalPoints}</p>
          </div>
        </div>
      </Link>
      <Link className='cursor-pointer hidden group-hover:inline-block hover:text-primary' href={`${process.env.NEXT_PUBLIC_SITE_URL}/teacher/subjects/${subjectId}/quiz/${quizId}/edit`}>
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
            <DialogTitle>Are you sure you want to delete this </DialogTitle>
          </DialogHeader>
          <DialogDescription>This action cannot be undone. This will permanently delete your quiz.</DialogDescription>
          <DialogFooter>
            <DialogClose>
              <Button onClick={handleDeleteActivity} variant={"destructive"}>
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

export default QuizBox;
