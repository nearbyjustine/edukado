"use client";

import { deleteActivity } from "@/actions/activity/delete-activity-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { ClipboardList, Pencil, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Activity = ({ name, activity, date, activityId, subjectId, grade }: { name: string; activity: string; date: string; activityId: string; subjectId: string; grade: number }) => {
  const [hidden, setHidden] = useState(false);
  const handleDeleteActivity = async () => {
    const response = await deleteActivity(activityId);
    if (response.error) console.log(response.error);
    setHidden(true);
  };
  return (
    <div className={cn("gap-4 items-center group", hidden ? "hidden" : "flex")}>
      <Link className='flex-1' href={`${process.env.NEXT_PUBLIC_SITE_URL}/teacher/subjects/${subjectId}/activities/${activityId}`}>
        <div className='flex justify-between py-2 pl-6 pr-2 border hover:bg-primary/10 transition-colors rounded-md '>
          <div className='flex gap-4 items-center'>
            <div className='bg-green-500 rounded-3xl h-auto w-auto p-2 text-white'>
              <ClipboardList width={25} height={25} className='' />
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>
                {name} posted: <span className='italic'>{activity}</span>
              </p>
              <p>{date}</p>
            </div>
          </div>
          <div>
            <p className='py-1 px-2 bg-primary text-sm text-primary-foreground rounded-md'>Total points: {grade}</p>
          </div>
        </div>
      </Link>
      <Link className='cursor-pointer hidden group-hover:inline-block hover:text-primary' href={`${process.env.NEXT_PUBLIC_SITE_URL}/teacher/subjects/${subjectId}/activities/${activityId}/edit`}>
        <Pencil width={20} height={20} />
      </Link>
      <Dialog>
        <DialogTrigger>
          <button className='cursor-pointer hidden group-hover:inline-block hover:text-destructive'>
            <X width={20} height={20} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this </DialogTitle>
          </DialogHeader>
          <DialogDescription>This action cannot be undone. This will permanently delete your activity.</DialogDescription>
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

export default Activity;
