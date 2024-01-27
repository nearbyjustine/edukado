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
import LessonBox from "../lesson/lesson-box";
import DiscussionBox from "../discussion/discussion-box";
import Image from "next/image";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const revalidate = 0;

const DeliverablesDashboard = async ({ subject, gradeLevel, section, subjectId, classroomId }: { subject: string; gradeLevel: string; section: string; subjectId: string; classroomId: string }) => {
  noStore();

  const { data: activities, error } = await fetchAllActivitiesBySubject(subjectId);
  const { data: quizzes, error: quizzesError } = await fetchAllQuizBySubject(subjectId);
  const exams = quizzes?.filter((v) => v.is_exam);
  const quizzesNotExam = quizzes?.filter((v) => !v.is_exam);
  const { data: topics, error: topicsError } = await fetchAllTopicsEtc(subjectId);
  const { data: students, error: studentsError } = await fetchAllStudentsPerSubject(subjectId);
  const { data: lessons, error: lessonsError } = await fetchLessonsPerSubject(subjectId);
  const { data: discussions, error: discussionsError } = await fetchDiscussionsPerSubject(subjectId);
  const { data: studentsWhoAttendedToday, error: studentsWhoAttendedTodayError } = await fetchAllStudentsWhoAttendedToday(classroomId);

  // if (error || quizzesError || topicsError || studentsError || studentsWhoAttendedTodayError || lessonsError || discussionsError) {
  //   return <div>Error: Something must have happened...</div>;
  // }
  return (
    <div className='flex flex-col gap-4 mt-9 w-[50rem]'>
      <div className='relative bg-green-500 text-white dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col justify-end h-32 py-2 px-4'>
        <div className='font-bold text-2xl'>{subject}</div>
        <div className='font-medium '>{`${gradeLevel} - ${section}`}</div>
        <div className='absolute bottom-2 right-2 flex gap-2'>
          {/* <ScanQRButton classroomid={subjectId} /> */}
          <CreateActivityButton subjectId={subjectId} />
        </div>
      </div>
      <div>
        <Select>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Set quarter' defaultValue='1st Quarter' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='1st Quarter'>1st Quarter</SelectItem>
            <SelectItem value='2nd Quarter'>2nd Quarter</SelectItem>
            <SelectItem value='3rd Quarter'>3rd Quarter</SelectItem>
            <SelectItem value='4th Quarter'>4th Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Tabs defaultValue='all'>
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='lessons'>Lessons</TabsTrigger>
          <TabsTrigger value='discussions'>Discussions</TabsTrigger>
          <TabsTrigger value='activities'>Activities</TabsTrigger>
          <TabsTrigger value='quizzes'>Quizzes</TabsTrigger>
          <TabsTrigger value='exams'>Exams</TabsTrigger>
          <TabsTrigger value='students'>Students</TabsTrigger>
          <TabsTrigger value='attendance'>Attended Today</TabsTrigger>
        </TabsList>
        <TabsContent value='all'>
          <div className='flex flex-col gap-4'>{topics && <TopicsAccordion topics={topics} />}</div>
        </TabsContent>
        <TabsContent value='lessons'>
          <div className='flex flex-col gap-4'>{lessons && lessons.map((lesson) => lesson && <LessonBox key={lesson.id} lessonId={lesson.id} subjectId={subjectId} title={lesson.title} />)}</div>
        </TabsContent>
        <TabsContent value='discussions'>
          <div className='flex flex-col gap-4'>
            {discussions && discussions.map((discussion) => discussion && <DiscussionBox key={discussion.id} discussionId={discussion.id} subjectId={subjectId} title={discussion.title} />)}
          </div>
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
            {quizzesNotExam &&
              quizzesNotExam.map((quiz) => {
                const dateOpen = moment(new Date(quiz.date_open)).format("MMMM DD, YYYY");
                const dateClose = moment(new Date(quiz.date_close)).format("MMMM DD, YYYY");
                return <QuizBox title={quiz.title} date_open={dateOpen} date_close={dateClose} quizId={quiz.id} subjectId={subjectId} key={quiz.id} totalPoints={quiz.total_points} />;
              })}
          </div>
        </TabsContent>
        <TabsContent value='exams'>
          <div className='flex flex-col gap-4'>
            {exams &&
              exams.map((quiz) => {
                const dateOpen = moment(new Date(quiz.date_open)).format("MMMM DD, YYYY");
                const dateClose = moment(new Date(quiz.date_close)).format("MMMM DD, YYYY");
                return <QuizBox title={quiz.title} date_open={dateOpen} date_close={dateClose} quizId={quiz.id} subjectId={subjectId} key={quiz.id} totalPoints={quiz.total_points} />;
              })}
          </div>
        </TabsContent>
        <TabsContent value='students'>
          <ScrollArea className='h-[650px]'>
            <div className='flex flex-col gap-4 p-2'>
              {students &&
                students.map((student) => (
                  <div className='border border-primary rounded-md px-2 py-4 font-semibold text-primary text-xl flex items-center gap-4' key={student.id}>
                    <span>
                      {(student.profiles?.avatar_url && <Image width={16} height={16} className='w-16 h-16 rounded-full object-cover' src={student.profiles?.avatar_url} alt={"Profile pic"} />) || (
                        <div className='w-16 h-16 bg-primary rounded-full'></div>
                      )}
                    </span>
                    <span>
                      {student.profiles?.first_name} {student.profiles?.last_name}
                    </span>
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
                  ({ students: student, created_at }) =>
                    student && (
                      <div className='border border-primary rounded-md px-2 py-4 font-semibold text-primary text-xl flex items-center gap-4' key={student.id}>
                        <span>
                          {(student.profiles?.avatar_url && (
                            <Image width={16} height={16} className='w-16 h-16 rounded-full object-cover' src={student.profiles?.avatar_url} alt={"Profile pic"} />
                          )) || <div className='w-16 h-16 bg-primary rounded-full'></div>}
                        </span>
                        <span className='flex flex-col gap-1'>
                          {student.profiles?.first_name} {student.profiles?.last_name}
                          <span className='font-light text-sm text-primary-darker'>{format(new Date(created_at), "MMMM dd, Y")}</span>
                        </span>
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
