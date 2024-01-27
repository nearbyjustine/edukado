import { fetchActivityById } from "@/actions/activity/fetch-activity";
import ActivityEdit from "@/components/main-ui/activity/activity-edit";
import { unstable_noStore as noStore } from "next/cache";
export const revalidate = 0;

export default async function EditActivityPage({ params }: { params: { id: string; activityId: string } }) {
  noStore();
  const { data: activity, error } = await fetchActivityById(params.activityId);
  console.log(activity);
  if (error || !activity) {
    return <div>Error: Something must have happened</div>;
  }
  return (
    <div>
      <ActivityEdit
        grade={activity.grade}
        date_open={activity.date_open}
        date_close={activity.date_close}
        content={activity.content}
        title={activity.title}
        fileUrl={activity.file_url}
        linkUrl={activity.link_url}
        activityId={params.activityId}
        subjectId={params.id}
        topicId={String(activity.topic_id)}
        quarter={activity.quarter}
      />
    </div>
  );
}
