import Link from "next/link";
import React from "react";

const SubjectBox = ({ subject, subjectLink }: { subject: string; subjectLink: string }) => {
  return (
    <div className='max-w-fit select-none p-4 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-green-200 text-green-900'>
      <div className='flex flex-col gap-4 items-start'>
        <div className='flex flex-col'>
          <p className='text-xl'>{subject}</p>
        </div>
        <Link href={subjectLink} className='rounded-xl px-4 py-2 bg-green-200 hover:bg-green-300 dark:bg-green-500 dark:hover:bg-green-400 font-semibold transition-colors'>
          View Subject
        </Link>
      </div>
    </div>
  );
};

export default SubjectBox;
