"use client";

import { ArrowRight, Clipboard, Folder, PenTool } from "lucide-react";
import React from "react";
import Link from "next/link";
import RecentSubjects from "./recent-subjects";
import { LineChartStudents } from "./line-chart";

const QuickBits = () => {
  return (
    <div className='flex flex-col gap-3'>
      <h1 className='text-lg md:text-3xl font-bold '>What&apos;s for today?</h1>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-3'>
        <div className='w-auto p-4 select-none cursor-pointer bg-green-300 text-green-900 dark:bg-green-600 dark:text-white flex items-center justify-between gap-4 rounded-md transition-colors'>
          <div className='flex gap-2 flex-col'>
            <p className='text-xl font-semibold'>Subjects</p>
            <div className='flex gap-2 items-center'>
              <span className='font-semibold text-3xl'>10</span>
              <span>ACTIVE</span>
            </div>
          </div>
          <div>
            <Folder size={50} strokeWidth={1} />
          </div>
        </div>
        <div className='w-auto p-4 select-none cursor-pointer bg-green-200 text-green-900 dark:bg-green-700 dark:text-white flex items-center justify-between gap-4 rounded-md transition-colors'>
          <div className='flex gap-2 flex-col'>
            <p className='text-xl font-semibold'>Activities</p>
            <div className='flex gap-2 items-center'>
              <span className='font-semibold text-3xl'>6</span>
              <span>DUE TODAY</span>
            </div>
          </div>
          <div>
            <Clipboard size={50} strokeWidth={1} />
          </div>
        </div>
        <div className='w-auto p-4 select-none cursor-pointer bg-green-200 text-green-900 dark:bg-green-700 dark:text-white flex items-center justify-between gap-4 rounded-md transition-colors'>
          <div className='flex gap-2 flex-col'>
            <p className='text-xl font-semibold'>Exams</p>
            <div className='flex gap-2 items-center'>
              <span className='font-semibold text-3xl'>3</span>
              <span>DUE TODAY</span>
            </div>
          </div>
          <div>
            <PenTool size={50} strokeWidth={1} />
          </div>
        </div>
      </div>
      <div className='w-fit p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
        <Link href='/teacher/dashboard/subjects' className='flex gap-2 font-bold'>
          VIEW ALL SUBJECTS <ArrowRight />
        </Link>
        <RecentSubjects />
      </div>
      <div>
        <LineChartStudents />
      </div>
    </div>
  );
};

export default QuickBits;
