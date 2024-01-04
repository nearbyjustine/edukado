import CreateActivityButton from "@/components/buttons/create-activity-button";
import Activity from "./activity";
import ActivityModal from "@/components/providers/modal/activity-modal";
import moment from "moment";
import { ActivityType, ActivityWithTeacher } from "@/lib/collection.types";
import { fetchAllActivitiesBySubject } from "@/actions/activity/fetch-activity";

const ActivityDashboard = async ({ subject, gradeLevel, section, subjectId }: { subject: string; gradeLevel: string; section: string; subjectId: string }) => {
  const { data: activities, error } = await fetchAllActivitiesBySubject(subjectId);

  if (error || !activities) return <div>Loading...</div>;
  return (
    <div className='flex flex-col gap-4 mt-9 w-[50rem]'>
      <div className='relative bg-green-500 text-white dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col justify-end h-32 py-2 px-4'>
        <div className='font-bold text-2xl'>{subject}</div>
        <div className='font-medium '>{`${gradeLevel} - ${section}`}</div>
        <div className='absolute bottom-2 right-2'>
          <CreateActivityButton subjectId={subjectId} />
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {activities &&
          activities.map((activity) => (
            <Activity
              key={activity.id}
              subjectId={subjectId}
              activityId={activity.id}
              activity={activity.title}
              date={`${moment(new Date(activity.date_open)).format("MMMM Do YYYY")} ${activity.date_close ? "- " + moment(new Date(activity.date_close)).format("MMMM Do YYYY") : ""}`}
              name={`${activity.profiles!.first_name} ${activity.profiles!.last_name}`}
              grade={activity.grade}
            />
          ))}
      </div>
      {/* <ActivityModal subjectId={subjectId} /> */}
    </div>
  );
};

export default ActivityDashboard;
