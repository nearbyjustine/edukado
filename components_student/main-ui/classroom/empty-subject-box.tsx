import Link from "next/link";
import React from "react";

const EmptySubjectBox = () => {
  return (
    <div className='max-w-xl select-none p-4 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-green-200 text-green-900'>
      <div className='grid grid-flow-row grid-rows-2 gap-4 items-start'>
        <div>
          <p className='text-xl'>No subjects</p>
        </div>
      </div>
    </div>
  );
};

export default EmptySubjectBox;
