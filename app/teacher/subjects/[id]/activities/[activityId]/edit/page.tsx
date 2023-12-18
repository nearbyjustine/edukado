import { fetchActivityById } from "@/actions/activity/fetch-activity";
import ActivityEdit from "@/components/main-ui/activity/activity-edit";

export const revalidate = 0;

export default async function EditActivityPage({ params }: { params: { id: string; activityId: string } }) {
  const { data: activity, error } = await fetchActivityById(params.activityId);
  if (error || !activity) {
    return <div>Error: Something must have happened</div>;
  }
  return (
    <div>
      <ActivityEdit content={activity.content} title={activity.title} fileUrl={activity.file_url} linkUrl={activity.link_url} activityId={params.activityId} subjectId={params.id} />
    </div>
  );
}
