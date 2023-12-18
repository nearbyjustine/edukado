"use client";

import React, { Suspense, useEffect, useState } from "react";
import Activity from "./activity";
import ActivityModal from "@/components_student/modal/activity-modal";
import moment from "moment";

type ActivityWithTeacher = {
  content: string;
  created_at: string;
  file_url: string | null;
  id: string;
  link_url: string | null;
  subject_id: string;
  teacher_id: string;
  title: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
};

const ActivityDashboard = ({ subject, gradeLevel, section, subjectId }: { subject: string; gradeLevel: string; section: string; subjectId: string }) => {
  const [needToRefetch, setNeedToRefetch] = useState(false);
  const [activities, setActivities] = useState<ActivityWithTeacher[]>();
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/activity/fetch-activity-by-subject/${subjectId}`, {
          cache: "no-store",
        });
        const { activities }: { activities: ActivityWithTeacher[] } = await response.json();
        setActivities(activities);
      } catch (error) {
        console.log(error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className='flex flex-col gap-4 mt-9 w-[50rem]'>
      <div className='relative bg-green-500 text-white dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col justify-end h-32 py-2 px-4'>
        <div className='font-bold text-2xl'>{subject}</div>
        <div className='font-medium '>{`${gradeLevel} - ${section}`}</div>
      </div>
      <div className='flex flex-col gap-4'>
        <Suspense fallback={<p>Loading activities...</p>}>
          {activities &&
            activities.map((activity) => (
              <Activity
                key={activity.id}
                subjectId={subjectId}
                activityId={activity.id}
                activity={activity.title}
                date={`${moment(new Date(activity.created_at)).format("MMMM Do YYYY")}`}
                name={`${activity.profiles.first_name} ${activity.profiles.last_name}`}
              />
            ))}
        </Suspense>
      </div>
      <ActivityModal subjectId={subjectId} />
    </div>
  );
};

export default ActivityDashboard;
