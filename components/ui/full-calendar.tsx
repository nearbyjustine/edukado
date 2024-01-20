"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from "moment";
import { createClient } from "@/utils/supabase/client";
import { ActivitiesAndQuizzes } from "@/lib/collection.types";

const FullCalendarComponent = () => {
  const [data, setData] = useState<ActivitiesAndQuizzes[]>();
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
        setData([...activities, ...quizzes]);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className='w-[70vw] max-h-40'>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridWeek'
        events={
          data && data.length > 0
            ? data.map((d) => {
                return {
                  title: `${d.title} | ${d.subjects?.name} | ${d.subjects?.classrooms?.grade_level} - ${d.subjects?.classrooms?.section}`,
                  start: `${moment(new Date(d.date_open)).format("YYYY-MM-DD")}`,
                  end: `${moment(new Date(d.date_close as string)).format("YYYY-MM-DD")}`,
                };
              })
            : [{ title: "Nothing to seee", date: "2019-12-05" }]
        }
        eventMinWidth={400}
      />
    </div>
  );
};

export default FullCalendarComponent;
