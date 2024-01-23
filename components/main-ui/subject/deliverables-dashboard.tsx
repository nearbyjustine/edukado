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
import { fetchAllTopicsEtc } from "@/actions/topic/topic";
import TopicsAccordion from "../topics-accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchAllStudentsPerSubject, fetchAllStudentsWhoAttendedToday } from "@/actions/students/students";
import { fetchLessonsPerSubject } from "@/actions/lessons/lesson";
import { fetchDiscussionsPerSubject } from "@/actions/discussions/discussions";

export const revalidate = 0;

const DeliverablesDashboard = async ({ subject, gradeLevel, section, subjectId }: { subject: string; gradeLevel: string; section: string; subjectId: string }) => {
  noStore();

  const { data: activities, error } = await fetchAllActivitiesBySubject(subjectId);
  const { data: quizzes, error: quizzesError } = await fetchAllQuizBySubject(subjectId);
  const { data: topics, error: topicsError } = await fetchAllTopicsEtc(subjectId);
  const { data: students, error: studentsError } = await fetchAllStudentsPerSubject(subjectId);
  const { data: lessons, error: lessonsError } = await fetchLessonsPerSubject(subjectId);
  const { data: discussions, error: discussionsError } = await fetchDiscussionsPerSubject(subjectId);
  const { data: studentsWhoAttendedToday, error: studentsWhoAttendedTodayError } = await fetchAllStudentsWhoAttendedToday(subjectId);

  if (error || quizzesError || topicsError || studentsError || studentsWhoAttendedTodayError || lessonsError || discussionsError) {
    return <div>Error: Something must have happened...</div>;
  }
  return (
    <div className='flex flex-col gap-4 mt-9 w-[50rem]'>
      <div className='relative bg-green-500 text-white dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col justify-end h-32 py-2 px-4'>
        <div className='font-bold text-2xl'>{subject}</div>
        <div className='font-medium '>{`${gradeLevel} - ${section}`}</div>
        <div className='absolute bottom-2 right-2 flex gap-2'>
          <ScanQRButton subjectId={subjectId} />
          <CreateActivityButton subjectId={subjectId} />
        </div>
      </div>
      <Tabs defaultValue='all'>
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='lessons'>Lessons</TabsTrigger>
          <TabsTrigger value='discussions'>Discussions</TabsTrigger>
          <TabsTrigger value='activities'>Activities</TabsTrigger>
          <TabsTrigger value='quizzes'>Quizzes</TabsTrigger>
          <TabsTrigger value='students'>Students</TabsTrigger>
          <TabsTrigger value='attendance'>Attended Today</TabsTrigger>
        </TabsList>
        <TabsContent value='all'>
          <div className='flex flex-col gap-4'>{topics && <TopicsAccordion topics={topics} />}</div>
        </TabsContent>
        <TabsContent className='' value='activities'>
          <div className='flex flex-col gap-4'>
            {activities &&
              activities.map(
                (activity) =>
                  activity.teachers && (
                    <Activity
                      key={activity.id}
                      subjectId={subjectId}
                      activityId={activity.id}
                      activity={activity.title}
                      date={`${moment(new Date(activity.date_open)).format("MMMM DD, YYYY")} ${activity.date_close ? "- " + moment(new Date(activity.date_close)).format("MMMM DD, YYYY") : ""}`}
                      name={`${activity.teachers.profiles!.first_name} ${activity.teachers.profiles!.last_name}`}
                      grade={activity.grade}
                    />
                  )
              )}
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
        <TabsContent value='students'>
          <ScrollArea className='h-[500px]'>
            <div className='flex flex-col gap-4 p-2'>
              {students &&
                students.map((student) => (
                  <div key={student.id}>
                    {student.profiles?.first_name} {student.profiles?.last_name}
                  </div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value='attendance'>
          <ScrollArea className='h-[500px]'>
            <div className='flex flex-col gap-4 p-2'>
              {studentsWhoAttendedToday &&
                studentsWhoAttendedToday.map(
                  ({ students }) =>
                    students && (
                      <div key={students.id}>
                        {students.profiles?.first_name} {students.profiles?.last_name}
                      </div>
                    )
                )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliverablesDashboard;
