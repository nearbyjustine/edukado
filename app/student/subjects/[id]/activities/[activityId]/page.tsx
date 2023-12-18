import { fetchActivityById } from "@/actions/activity/fetch-activity";
import ActivityEdit from "@/components/main-ui/activity/activity-edit";
import parse from "html-react-parser";
import Link from "next/link";

export const revalidate = 0;

export default async function ActivityPage({ params }: { params: { id: string; activityId: string } }) {
  const { data: activity, error } = await fetchActivityById(params.activityId);
  if (error || !activity) {
    return <div>Error: Something must have happened</div>;
  }
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>{activity.title}</h1>
      <div>{parse(activity.content)}</div>
      {activity.file_url && <Link href={activity.file_url}>File to download</Link>}
      {activity.link_url && <Link href={activity.link_url}>Additional resources</Link>}
    </div>
  );
}
