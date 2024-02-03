import { fetchActivityById } from "@/actions/activity/fetch-activity";
import { fetchActivityAnswer } from "@/actions/activity/fetch-activity-answer";
import ActivityEdit from "@/components/main-ui/activity/activity-edit";
import ActivityAnswer from "@/components_student/main-ui/activity/activity-answer";
import parse from "html-react-parser";
import { ArrowDownToLine, Link2 } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function ActivityPage({ params }: { params: { id: string; activityId: string } }) {
  const { data: activity, error } = await fetchActivityById(params.activityId);
  const { data: answer, error: answerError } = await fetchActivityAnswer(params.activityId);
  console.log(answer, answerError);
  if (error || !activity) {
    return <div>Error: Something must have happened</div>;
  }

  return (
    <div className='flex flex-col gap-12 justify-start'>
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
      <div>
        {answer && answer.students?.profiles ? (
          <div className='flex flex-col gap-4 p-4 border rounded-lg'>
            <h1 className='text-2xl underline font-bold'>{`${answer.students?.profiles.first_name} ${answer.students?.profiles.last_name}'s Answer`}</h1>
            <div>{parse(answer.content)}</div>
            <div>
              {answer.file_url && (
                <Link className='text-blue-400 hover:underline flex gap-2 items-center' href={answer.file_url}>
                  <ArrowDownToLine width={20} height={20} />
                  {`File that ${answer.students?.profiles.first_name} sent`}
                </Link>
              )}
              {answer.link_url && (
                <Link className='text-blue-400 hover:underline flex gap-2 items-center' href={answer.link_url}>
                  <Link2 width={20} height={20} />
                  {`Link that ${answer.students?.profiles.first_name} sent`}
                </Link>
              )}
            </div>
          </div>
        ) : (
          <ActivityAnswer className='mt-2' subjectId={params.id} activityId={params.activityId} />
        )}
      </div>
    </div>
  );
}
