"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from "moment";

type dataType = {
  id: string;
  title: string;
  created_at: string;
  subjects: {
    id: string;
    name: string;
  } | null;
  classrooms: {
    id: string;
    grade_level: "Grade 1" | "Grade 2" | "Grade 3" | "Grade 4" | "Grade 5" | "Grade 6";
    section: string;
  } | null;
};

const FullCalendarComponent = () => {
  const [data, setData] = useState<dataType[]>();
  // teacher side
  // fetch ko lahat ng activities ng hinahawakan kong subject
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/activity/fetch-activity-by-teacher`, {
        cache: "no-store",
      });

      const { activities }: { activities: dataType[] } = await response.json();

      if (activities && activities.length > 0) setData(activities);

      console.log(activities);
    };

    fetchData();
  }, []);
  return (
    <div className='w-[70vw] max-h-40'>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridWeek'
        events={
          data && data.length > 0
            ? data.map((d) => {
                console.log(`${moment(d.created_at).format("YYYY-MM-DD")}`);
                return {
                  title: `${d.title} | ${d.subjects?.name} | ${d.classrooms?.grade_level} - ${d.classrooms?.section}`,
                  date: `${moment(d.created_at).format("YYYY-MM-DD")}`,
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
