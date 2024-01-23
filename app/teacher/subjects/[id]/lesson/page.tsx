import LessonForm from "@/components/forms/lesson-form";
import React from "react";

const CreateActivityPage = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <div>
      <LessonForm subjectId={id} />
    </div>
  );
};

export default CreateActivityPage;
