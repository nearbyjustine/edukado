import CreateActivityButton from "@/components/buttons/create-activity-button";
import Activity from "./activity";
import moment from "moment";
import { fetchAllActivitiesBySubject } from "@/actions/activity/fetch-activity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import fetchAllQuizBySubject from "@/actions/quiz/fetch-all-quiz-by-subject";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import QuizBox from "../quiz/quiz-box";
import { Button } from "@/components/ui/button";
import { ScanQRButton } from "@/components/buttons/scan-qr-button";

export const revalidate = 0;

const DeliverablesDashboard = async ({ subject, gradeLevel, section, subjectId }: { subject: string; gradeLevel: string; section: string; subjectId: string }) => {
  noStore();

  const { data: activities, error } = await fetchAllActivitiesBySubject(subjectId);
  const { data: quizzes, error: quizzesError } = await fetchAllQuizBySubject(subjectId);

  if (error || !activities) return <div>Error: Something must have happened...</div>;
  return (
    <div className='flex flex-col gap-4 mt-9 w-[50rem]'>
      <div className='relative bg-green-500 text-white dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col justify-end h-32 py-2 px-4'>
        <div className='font-bold text-2xl'>{subject}</div>
        <div className='font-medium '>{`${gradeLevel} - ${section}`}</div>
        <div className='absolute bottom-2 right-2 flex gap-2'>
          <ScanQRButton />
          <CreateActivityButton subjectId={subjectId} />
        </div>
      </div>
      <Tabs defaultValue='activities'>
        <TabsList>
          <TabsTrigger value='activities'>Activities</TabsTrigger>
          <TabsTrigger value='quizzes'>Quizzes</TabsTrigger>
        </TabsList>
        <TabsContent className='' value='activities'>
          <div className='flex flex-col gap-4'>
            {activities &&
              activities.map((activity) => (
                <Activity
                  key={activity.id}
                  subjectId={subjectId}
                  activityId={activity.id}
                  activity={activity.title}
                  date={`${moment(new Date(activity.date_open)).format("MMMM DD, YYYY")} ${activity.date_close ? "- " + moment(new Date(activity.date_close)).format("MMMM DD, YYYY") : ""}`}
                  name={`${activity.profiles!.first_name} ${activity.profiles!.last_name}`}
                  grade={activity.grade}
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value='quizzes'>
          <div className='flex flex-col gap-4'>
            {quizzes &&
              quizzes.map((quiz) => {
                const dateOpen = moment(new Date(quiz.date_open)).format("MMMM DD, YYYY");
                const dateClose = moment(new Date(quiz.date_close)).format("MMMM DD, YYYY");
                return <QuizBox title={quiz.title} date_open={dateOpen} date_close={dateClose} quizId={quiz.id} subjectId={subjectId} key={quiz.id} totalPoints={quiz.total_points} />;
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliverablesDashboard;
