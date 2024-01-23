"use client";

import { TopicsEtc } from "@/lib/collection.types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";

const TopicsAccordion = ({ topics }: { topics: TopicsEtc[] }) => {
  return (
    <Accordion type='single' collapsible>
      {topics &&
        topics.map((topic) => (
          <AccordionItem value={topic.id}>
            <AccordionTrigger>{topic.name}</AccordionTrigger>
            <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default TopicsAccordion;
