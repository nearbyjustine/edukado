import React, { Suspense, useEffect, useState } from "react";
import Activity from "./activity";
import moment from "moment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchAllActivitiesBySubject } from "@/actions/activity/fetch-activity";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import fetchAllQuizBySubject from "@/actions/quiz/fetch-all-quiz-by-subject";
import QuizBox from "../quiz/quiz-box";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { fetchAuthUser } from "@/actions/fetch-auth-user";

import QRCode from "react-qr-code";
import { fetchSubjectById, fetchSubjectByIdWithoutPath } from "@/actions/section/fetch-subject";

export const revalidate = 0;
const DeliverablesDashboard = async ({ subject, gradeLevel, section, subjectId }: { subject: string; gradeLevel: string; section: string; subjectId: string }) => {
  noStore();
  revalidatePath(`/teacher/subjects/${subjectId}`);

  const { data: subjectData, error: subjectError } = await fetchSubjectByIdWithoutPath(subjectId);
  const { data: activities, error } = await fetchAllActivitiesBySubject(subjectId);
  const { data: quizzes, error: quizzesError } = await fetchAllQuizBySubject(subjectId);
  const { user, error: userError } = await fetchAuthUser();

  const QRInfoJSON = JSON.stringify({
    subjectId,
    userId: user?.id,
    classroomId: subjectData?.classroom_id,
  });

  if (error || quizzesError || userError || subjectError) return <div>Error: Something must have happened...</div>;
  return (
    <div className='flex flex-col gap-4 mt-9 w-[50rem]'>
      <div className='bg-green-500 text-white dark:bg-green-600 dark:text-white rounded-md transition-colors flex justify-between items-end gap-4 h-32 py-2 px-4'>
        <div className='flex flex-col justify-end'>
          <div className='font-bold text-2xl'>{subject}</div>
          <div className='font-medium '>{`${gradeLevel} - ${section}`}</div>
        </div>
        <div className='flex flex-col'>
          <Dialog>
            <DialogTrigger>
              <Button className='text-xl font-bold'>QR Code</Button>
            </DialogTrigger>
            <DialogContent>
              <div>{user && <QRCode value={QRInfoJSON} />}</div>
            </DialogContent>
          </Dialog>
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
              activities.map((activity) => {
                if (activity.teachers?.profiles) {
                  return (
                    <Activity
                      key={activity.id}
                      subjectId={subjectId}
                      activityId={activity.id}
                      activity={activity.title}
                      date={`${moment(new Date(activity.date_open)).format("MMMM DD, YYYY")} ${activity.date_close ? "- " + moment(new Date(activity.date_close)).format("MMMM DD, YYYY") : ""}`}
                      name={`${activity.teachers.profiles.first_name} ${activity.teachers.profiles.last_name}`}
                      grade={activity.grade}
                    />
                  );
                }
              })}
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
      {/* <ActivityModal subjectId={subjectId} /> */}
    </div>
  );
};

export default DeliverablesDashboard;
