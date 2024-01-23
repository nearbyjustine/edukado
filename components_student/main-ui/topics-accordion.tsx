"use client";

import { TopicsEtc } from "@/lib/collection.types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";
import Link from "next/link";

const TopicsAccordion = ({ topics }: { topics: TopicsEtc[] }) => {
  return (
    <Accordion type='single' collapsible>
      {topics &&
        topics.map((topic) => (
          <AccordionItem key={topic.id} value={topic.id}>
            <AccordionTrigger>
              <div className='font-bold text-2xl text-primary'>{topic.name}</div>
            </AccordionTrigger>
            {topic.lessons?.map((q) => (
              <AccordionContent key={q.id}>
                <Link className='flex-1' href={`${process.env.NEXT_PUBLIC_SITE_URL}/student/subjects/${q.subject_id}/lesson/${q.id}`}>
                  <span className='font-bold'>Lesson</span> {q.title}
                </Link>
              </AccordionContent>
            ))}
            {topic.discussions?.map((q) => (
              <AccordionContent key={q.id}>
                <Link className='flex-1' href={`${process.env.NEXT_PUBLIC_SITE_URL}/student/subjects/${q.subject_id}/discussion/${q.id}`}>
                  <span className='font-bold'>Discussion</span> {q.title}
                </Link>
              </AccordionContent>
            ))}
            {topic.quizzes?.map((q) => (
              <AccordionContent key={q.id}>
                <Link className='flex-1' href={`${process.env.NEXT_PUBLIC_SITE_URL}/student/subjects/${q.subject_id}/quiz/${q.id}`}>
                  <span className='font-bold'>Quiz</span> {q.title}
                </Link>
              </AccordionContent>
            ))}
            {topic.activities?.map((q) => (
              <AccordionContent key={q.id}>
                <Link className='flex-1' href={`${process.env.NEXT_PUBLIC_SITE_URL}/student/subjects/${q.subject_id}/activities/${q.id}`}>
                  <span className='font-bold'>Activity</span> {q.title}
                </Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default TopicsAccordion;
