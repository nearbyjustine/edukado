import TopicForm from "@/components/forms/topic-form";
import React from "react";

const TopicPage = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <div>
      <TopicForm subjectId={id} />
    </div>
  );
};

export default TopicPage;
