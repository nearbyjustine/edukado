"use client";
import React from "react";
import Link from "next/link";
import SubjectBox from "@/components/main-ui/classroom/subject-box";
import CreateClassroomButton from "@/components/buttons/create-classroom-button";

const Subjects = () => {
  return (
    <div>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2'>
          <h1 className='text-lg md:text-3xl font-bold '>Grade Levels and Section</h1>
          <CreateClassroomButton />
        </div>
        <div className='w-fit p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
          <Link href='/teacher/dashboard/subjects' className='flex gap-2 font-bold'>
            GRADE 1 - MAHARLIKA
          </Link>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2'>
            <SubjectBox subject='Mathematics' subjectLink='/teacher/dashboard/subject-test' />
            <SubjectBox subject='Filipino' subjectLink='/teacher/dashboard/subject-test' />
          </div>
        </div>
        <div className='w-fit p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
          <Link href='/teacher/dashboard/subjects' className='flex gap-2 font-bold'>
            GRADE 1 - MABULAKBOL
          </Link>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2'>
            <SubjectBox subject='Mathematics' subjectLink='/teacher/dashboard/subject-test' />
            <SubjectBox subject='Science' subjectLink='/teacher/dashboard/subject-test' />
            <SubjectBox subject='English' subjectLink='/teacher/dashboard/subject-test' />
          </div>
        </div>
        <div className='w-fit p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
          <Link href='/teacher/dashboard/subjects' className='flex gap-2 font-bold'>
            GRADE 1 - MABANTOT
          </Link>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2'>
            <SubjectBox subject='Mathematics' subjectLink='/teacher/dashboard/subject-test' />
            <SubjectBox subject='Science' subjectLink='/teacher/dashboard/subject-test' />
            <SubjectBox subject='English' subjectLink='/teacher/dashboard/subject-test' />
          </div>
        </div>
        <div className='w-fit p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
          <Link href='/teacher/dashboard/subjects' className='flex gap-2 font-bold'>
            GRADE 2 - MABANTOT
          </Link>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2'>
            <SubjectBox subject='Science' subjectLink='/teacher/dashboard/subject-test' />
            <SubjectBox subject='English' subjectLink='/teacher/dashboard/subject-test' />
          </div>
        </div>
        <div className='w-fit p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
          <Link href='/teacher/dashboard/subjects' className='flex gap-2 font-bold'>
            GRADE 3 - MABANTOT
          </Link>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2'>
            <SubjectBox subject='Mathematics' subjectLink='/teacher/dashboard/subject-test' />
            <SubjectBox subject='English' subjectLink='/teacher/dashboard/subject-test' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
