import { fetchActivityById } from "@/actions/activity/fetch-activity";
import { fetchAllActivityAnswers } from "@/actions/activity/fetch-all-activity-answers";
import ActivityEdit from "@/components/main-ui/activity/activity-edit";
import parse from "html-react-parser";
import { ArrowDownToLine, Link2 } from "lucide-react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import ActivityBox from "@/components_student/activity-box";
export const revalidate = 0;

export default async function ActivityPage({ params }: { params: { id: string; activityId: string } }) {
  noStore();

  const { data: activity, error } = await fetchActivityById(params.activityId);
  const { data: answers, error: answerError } = await fetchAllActivityAnswers(params.activityId);
  if (error || !activity) {
    return <div>Error: Something must have happened</div>;
  }

  return (
    <div className='flex flex-col justify-start'>
      <div className='flex flex-col gap-4'>
        <div className='max-w-fit'>
          <h1 className='text-2xl font-bold relative'>
            {activity.title}
            <span className='absolute text-sm font-normal top-0 -right-20 rounded-md bg-primary text-primary-foreground px-2'>{activity.grade} pts</span>
          </h1>
        </div>

        <div>{parse(activity.content)}</div>
        {activity.file_url && (
          <Link className='text-blue-400 hover:underline flex gap-2 items-center' href={activity.file_url}>
            <ArrowDownToLine width={20} height={20} />
            File to download
          </Link>
        )}
        {activity.link_url && (
          <Link className='text-blue-400 hover:underline flex gap-2 items-center' href={activity.link_url}>
            <Link2 width={20} height={20} />
            Additional resources
          </Link>
        )}
      </div>
      <div className='font-bold text-3xl my-5'>Student Response(s)</div>
      <div className='flex flex-col gap-4 w-[35rem]'>
        {answers && answers.length > 0 ? (
          answers.map((answer) => {
            return <ActivityBox key={answer.id} answer={answer} />;
          })
        ) : (
          <div>No one has answered yet</div>
        )}
      </div>
    </div>
  );
}
