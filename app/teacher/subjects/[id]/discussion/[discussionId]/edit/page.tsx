import DiscussionEdit from "@/components/forms/discussion-edit-form";
import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { fetchDiscussionById } from "@/actions/discussions/discussions";

const EditDiscussionPage = async ({ params: { id, discussionId } }: { params: { id: string; discussionId: string } }) => {
  noStore();
  const { data: discussion, error } = await fetchDiscussionById(discussionId);
  if (error || !discussion) {
    return <div>Error: Something must have happened</div>;
  }
  return (
    <div>
      <DiscussionEdit content={discussion.content} discussionId={discussion.id} subjectId={id} title={discussion.title} topicId={discussion.topic_id as string} quarter={discussion.quarter} />
    </div>
  );
};

export default EditDiscussionPage;
