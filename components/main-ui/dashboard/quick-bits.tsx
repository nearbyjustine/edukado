"use client";

import { ArrowRight, Clipboard, Folder, PenTool } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import RecentSubjects from "./recent-subjects";
import { LineChartStudents } from "./line-chart";
import { fetchSubject, fetchSubjectCount } from "@/actions/subjects/fetch-subjects";
import { cn } from "@/lib/utils";
import RecentSubjectBox from "./recent-subject-box";
import { ActivityType, ClassroomWithSubjects, Quiz, SubjectsWithClassroom } from "@/lib/collection.types";
import { fetchQuizDueToday } from "@/actions/quiz/fetch-quiz";
import { fetchActivitiesDueToday } from "@/actions/activity/fetch-activity";

const QuickBits = () => {
  const [activeSubjectsCount, setActiveSubjectsCount] = useState<number>();
  const [subjects, setSubjects] = useState<SubjectsWithClassroom[]>();
  const [activeTab, setActiveTab] = useState<"subjects" | "exams" | "activities">("subjects");
  const [quizDueTodayList, setQuizDueTodayList] = useState<Quiz[]>();
  const [quizDueTodayListCount, setQuizDueTodayListCount] = useState<number>(0);
  const [activityDueTodayList, setActivityDueTodayList] = useState<ActivityType[]>();
  const [activityDueTodayListCount, setActivityDueTodayListCount] = useState<number>(0);

  useEffect(() => {
    const fetchActiveSubjects = async () => {
      const subjectCount = await fetchSubjectCount();
      const quizDueToday = await fetchQuizDueToday();
      const activityDueToday = await fetchActivitiesDueToday();

      if (quizDueToday && quizDueToday.count) setQuizDueTodayListCount(quizDueToday.count);
      if (quizDueToday && quizDueToday.data) setQuizDueTodayList(quizDueToday.data);

      if (activityDueToday && activityDueToday.count) setActivityDueTodayListCount(activityDueToday.count);
      if (activityDueToday && activityDueToday.data) setActivityDueTodayList(activityDueToday.data);

      if (subjectCount.count) setActiveSubjectsCount(subjectCount.count);
      if (subjectCount.classroomData) setSubjects(subjectCount.classroomData);
    };
    fetchActiveSubjects();
  }, []);

  return (
    <div className='flex flex-col gap-3'>
      <h1 className='text-lg md:text-3xl font-bold '>What&apos;s for today?</h1>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-3'>
        <div
          onClick={() => setActiveTab("subjects")}
          className={cn(
            "w-auto p-4 select-none cursor-pointer text-green-900 dark:bg-green-600 dark:text-white flex items-center justify-between gap-4 rounded-md transition-colors",
            activeTab === "subjects" ? "bg-green-300" : "bg-green-200"
          )}
        >
          <div className='flex gap-2 flex-col'>
            <p className='text-xl font-semibold'>Subjects</p>
            <div className='flex gap-2 items-center'>
              <span className='font-semibold text-3xl'>{activeSubjectsCount}</span>
              <span>ACTIVE</span>
            </div>
          </div>
          <div>
            <Folder size={50} strokeWidth={1} />
          </div>
        </div>
        <div
          onClick={() => setActiveTab("activities")}
          className={cn(
            "w-auto p-4 select-none cursor-pointer text-green-900 dark:bg-green-600 dark:text-white flex items-center justify-between gap-4 rounded-md transition-colors",
            activeTab === "activities" ? "bg-green-300" : "bg-green-200"
          )}
        >
          <div className='flex gap-2 flex-col'>
            <p className='text-xl font-semibold'>Activities</p>
            <div className='flex gap-2 items-center'>
              <span className='font-semibold text-3xl'>{(activityDueTodayListCount > 0 && activityDueTodayListCount) || "NONE"}</span>
              <span>DUE TODAY</span>
            </div>
          </div>
          <div>
            <Clipboard size={50} strokeWidth={1} />
          </div>
        </div>
        <div
          onClick={() => setActiveTab("exams")}
          className={cn(
            "w-auto p-4 select-none cursor-pointer text-green-900 dark:bg-green-600 dark:text-white flex items-center justify-between gap-4 rounded-md transition-colors",
            activeTab === "exams" ? "bg-green-300" : "bg-green-200"
          )}
        >
          <div className='flex gap-2 flex-col'>
            <p className='text-xl font-semibold'>Exams</p>
            <div className='flex gap-2 items-center'>
              <span className='font-semibold text-3xl'>{(quizDueTodayListCount > 0 && quizDueTodayListCount) || "NONE"}</span>
              <span>DUE TODAY</span>
            </div>
          </div>
          <div>
            <PenTool size={50} strokeWidth={1} />
          </div>
        </div>
      </div>
      {activeTab === "subjects" && (
        <div className='w-fit p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
          <Link href='/teacher/subjects' className='flex gap-2 font-bold'>
            VIEW ALL SUBJECTS <ArrowRight />
          </Link>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2'>
            {subjects?.slice(0, 5)?.map((s) => (
              <RecentSubjectBox key={s.id} gradeAndSection={`${s.classrooms?.grade_level} - ${s.classrooms?.section}`} subject={s.name} subjectLink={`/teacher/subjects/${s.id}`} />
            ))}
          </div>
          {/* <RecentSubjects /> */}
        </div>
      )}
      {activeTab === "exams" && quizDueTodayList && quizDueTodayListCount > 0 && (
        <div className='w-fit p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
          <Link href={`/teacher/subjects`} className='flex gap-2 font-bold'>
            VIEW ALL QUIZZES <ArrowRight />
          </Link>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2'>
            {quizDueTodayList?.map((s) => (
              <RecentSubjectBox key={s.id} gradeAndSection={""} subject={s.title} subjectLink={`/teacher/subjects/${s.subject_id}`} />
            ))}
          </div>
          {/* <RecentSubjects /> */}
        </div>
      )}
      {activeTab === "activities" && activityDueTodayList && activityDueTodayListCount > 0 && (
        <div className='w-fit p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
          <Link href={`/teacher/subjects`} className='flex gap-2 font-bold'>
            VIEW ALL ACTIVITIES <ArrowRight />
          </Link>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2'>
            {activityDueTodayList?.map((s) => (
              <RecentSubjectBox key={s.id} gradeAndSection={""} subject={s.title} subjectLink={`/teacher/subjects/${s.subject_id}`} />
            ))}
          </div>
          {/* <RecentSubjects /> */}
        </div>
      )}
      <div>
        <LineChartStudents />
      </div>
    </div>
  );
};

export default QuickBits;
