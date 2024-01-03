import ActivityModal from "@/components/providers/modal/activity-modal";
import React from "react";

const CreateActivityPage = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <div>
      <ActivityModal subjectId={id} />
    </div>
  );
};

export default CreateActivityPage;
