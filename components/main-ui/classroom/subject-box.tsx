import Link from "next/link";
import React from "react";

const SubjectBox = ({ subject, subjectLink, teacher }: { subject: string; subjectLink: string; teacher: string }) => {
  return (
    <div className='min-h-[144px] select-none p-4 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-green-200 text-green-900'>
      <div className='grid h-full grid-flow-row items-center'>
        <div>
          <p className='text-xl font-bold'>{subject}</p>
        </div>
        <div className='font-medium italic text-sm'>Teacher: {teacher}</div>
        <Link href={subjectLink} className='rounded-xl text-center px-4 py-2 bg-green-200 hover:bg-green-300 dark:bg-green-500 dark:hover:bg-green-400 font-semibold transition-colors'>
          View Subject
        </Link>
      </div>
    </div>
  );
};

export default SubjectBox;
