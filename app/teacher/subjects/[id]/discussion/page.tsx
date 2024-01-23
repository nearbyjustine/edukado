import React from "react";
import DiscussionForm from "@/components/forms/discussion-form";

const CreateDiscussionPage = ({ params: { id } }: { params: { id: string } }) => {
  return <DiscussionForm subjectId={id} />;
};

export default CreateDiscussionPage;
