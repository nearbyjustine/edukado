"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from "moment";
import { createClient } from "@/utils/supabase/client";
import { ActivitiesAndQuizzes, ActivityType, ActivityWithSubjectAndClassroom, Quiz, QuizWithSubjectAndClassroom } from "@/lib/collection.types";
import { useRouter } from "next/navigation";

type EventType = {
  title: string;
  start: string;
  end: string;
  url: string;
  backgroundColor?: string;
  borderColor?: string;
};

const FullCalendarComponent = () => {
  const [data, setData] = useState<EventType[]>();
  const router = useRouter();
  // teacher side
  // fetch ko lahat ng activities ng hinahawakan kong subject
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw Error("No user");
        const { data: activities } = await supabase.from("activities").select("*, subjects(*, classrooms(*))").eq("teacher_id", user.id);
        const { data: quizzes } = await supabase.from("quizzes").select("*, subjects(*, classrooms(*))").eq("teacher_id", user.id);
        if (!activities || !quizzes) throw Error("No fetched data");
        const activityEvents = activities.map((a) => {
          return {
            title: `${a.title} | ${a.subjects?.name} | ${a.subjects?.classrooms?.grade_level} - ${a.subjects?.classrooms?.section}`,
            start: moment(new Date(a.date_open)).format("YYYY-MM-DD"),
            end: moment(new Date(a.date_close as string)).format("YYYY-MM-DD"),
            url: `/teacher/subjects/${a.subject_id}/activities/${a.id}`,
            backgroundColor: "#16a34a",
            borderColor: "#16a34a",
          };
        });

        const quizzesEvent = quizzes.map((a) => {
          return {
            title: `${a.title} | ${a.subjects?.name} | ${a.subjects?.classrooms?.grade_level} - ${a.subjects?.classrooms?.section}`,
            start: moment(new Date(a.date_open)).format("YYYY-MM-DD"),
            end: moment(new Date(a.date_close as string)).format("YYYY-MM-DD"),
            url: `/teacher/subjects/${a.subject_id}/quiz/${a.id}`,
          };
        });

        setData([...activityEvents, ...quizzesEvent]);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='w-[70vw] max-h-40'>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridWeek'
        events={data && data.length > 0 ? data : [{ title: "Nothing to seee", date: "2019-12-05" }]}
        eventMinWidth={400}
        eventShortHeight={200}
        eventMinHeight={200}
        eventClick={(e) => {
          router.replace(e.event.url);
        }}
      />
    </div>
  );
};

export default FullCalendarComponent;
