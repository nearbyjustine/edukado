import { fetchLessonById } from "@/actions/lessons/lesson";
import LessonEdit from "@/components/forms/lesson-edit";
import ActivityEdit from "@/components/main-ui/activity/activity-edit";
import { unstable_noStore as noStore } from "next/cache";
export const revalidate = 0;

export default async function EditLessonPage({ params }: { params: { id: string; lessonId: string } }) {
  noStore();
  const { data: lesson, error } = await fetchLessonById(params.lessonId);
  if (error || !lesson) {
    return <div>Error: Something must have happened</div>;
  }
  return (
    <div>
      <LessonEdit topicId={lesson.topic_id || ""} content={lesson.content} title={lesson.title} fileUrl={lesson.file_url} linkUrl={lesson.link_url} lessonId={lesson.id} subjectId={params.id} />
    </div>
  );
}
