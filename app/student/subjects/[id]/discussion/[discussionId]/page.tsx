import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import parse from "html-react-parser";
import { ArrowDownToLine, Link2 } from "lucide-react";
import Link from "next/link";
import { fetchDiscussionById } from "@/actions/discussions/discussions";

const DiscussionPage = async ({ params: { id, discussionId } }: { params: { id: string; discussionId: string } }) => {
  noStore();

  const { data: discussion, error } = await fetchDiscussionById(discussionId);
  if (error || !discussion) {
    console.error(error);
    return <div>Error: Something must have happened</div>;
  }

  return (
    <div className='flex flex-col justify-start'>
      <div className='flex flex-col gap-4 max-w-3xl'>
        <div className='max-w-fit'>
          <h1 className='text-2xl font-bold relative'>{discussion.title}</h1>
          <p className='italic'>
            {discussion.teachers?.profiles?.first_name} {discussion.teachers?.profiles?.last_name}
          </p>
        </div>

        <div>{parse(discussion.content)}</div>
      </div>
    </div>
  );
};

export default DiscussionPage;
