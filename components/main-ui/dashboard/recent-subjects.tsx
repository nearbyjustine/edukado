import React from "react";
import RecentSubjectBox from "./recent-subject-box";

const RecentSubjects = () => {
  return (
    <div>
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2'>
        <RecentSubjectBox gradeAndSection='Grade 1 Maharlika' subject='Mathematics' subjectLink='/teacher/dashboard/subject-test' />
        <RecentSubjectBox gradeAndSection='Grade 1 Maharlika' subject='Filipino' subjectLink='/teacher/dashboard/subject-test' />
        <RecentSubjectBox gradeAndSection='Grade 1 Maharlika' subject='Programming' subjectLink='/teacher/dashboard/subject-test' />
        <RecentSubjectBox gradeAndSection='Grade 1 Maharlika' subject='Science' subjectLink='/teacher/dashboard/subject-test' />
        <RecentSubjectBox gradeAndSection='Grade 1 Maharlika' subject='English' subjectLink='/teacher/dashboard/subject-test' />
      </div>
    </div>
  );
};

export default RecentSubjects;
