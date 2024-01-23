"use client";

import { cn } from "@/lib/utils";
import { ClipboardList, Pencil, X } from "lucide-react";
import Link from "next/link";

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
  return (
    <div className={cn("gap-4 items-center group flex")}>
      <Link className='flex-1' href={`${process.env.NEXT_PUBLIC_SITE_URL}/student/subjects/${subjectId}/quiz/${quizId}`}>
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
    </div>
  );
};

export default QuizBox;
