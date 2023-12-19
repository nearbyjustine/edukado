import { deleteActivity } from "@/actions/activity/delete-activity-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { ClipboardList, Pencil, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Activity = ({ name, activity, date, activityId, subjectId }: { name: string; activity: string; date: string; activityId: string; subjectId: string }) => {
  const [hidden, setHidden] = useState(false);
  const handleDeleteActivity = async () => {
    const response = await deleteActivity(activityId);
    if (response.error) console.log(response.error);
    setHidden(true);
  };
  return (
    <div className={cn("gap-4 items-center group", hidden ? "hidden" : "flex")}>
      <Link className='flex-1' href={`${process.env.NEXT_PUBLIC_SITE_URL}/student/subjects/${subjectId}/activities/${activityId}`}>
        <div className='flex justify-between py-2 px-6 border hover:bg-primary/10 transition-colors rounded-md '>
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
          <div></div>
        </div>
      </Link>
    </div>
  );
};

export default Activity;
