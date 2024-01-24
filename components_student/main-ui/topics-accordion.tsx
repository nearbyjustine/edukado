"use client";

import { TopicsEtc } from "@/lib/collection.types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";
import Link from "next/link";
import AllPurposeBox from "./all-purpose/all-purpose-accordion-box";

const TopicsAccordion = ({ topics }: { topics: TopicsEtc[] }) => {
  return (
    <Accordion className='gap-2' type='single' collapsible>
      {topics &&
        topics.map((topic) => (
          <AccordionItem key={topic.id} value={topic.id}>
            <AccordionTrigger className='text-primary underline-offset-4'>
              <div className='font-bold text-2xl text-primary'>{topic.name}</div>
            </AccordionTrigger>
            {topic.lessons?.map((q) => (
              <AccordionContent className='pb-2' key={q.id}>
                <AllPurposeBox id={q.id} slug={"lesson"} subjectId={q.subject_id} title={q.title} />
              </AccordionContent>
            ))}
            {topic.discussions?.map((q) => (
              <AccordionContent className='pb-2' key={q.id}>
                <AllPurposeBox id={q.id} slug={"discussion"} subjectId={q.subject_id} title={q.title} />
              </AccordionContent>
            ))}
            {topic.quizzes?.map((q) => (
              <AccordionContent className='pb-2' key={q.id}>
                <AllPurposeBox id={q.id} slug={"quiz"} subjectId={q.subject_id} title={q.title} />
              </AccordionContent>
            ))}
            {topic.activities?.map((q) => (
              <AccordionContent className='pb-2' key={q.id}>
                <AllPurposeBox id={q.id} slug={"activities"} subjectId={q.subject_id} title={q.title} />
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default TopicsAccordion;
