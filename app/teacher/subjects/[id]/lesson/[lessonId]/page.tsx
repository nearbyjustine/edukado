import ActivityEdit from "@/components/main-ui/activity/activity-edit";
import parse from "html-react-parser";
import { ArrowDownToLine, Link2 } from "lucide-react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { fetchLessonById } from "@/actions/lessons/lesson";
export const revalidate = 0;

export default async function LessonPage({ params }: { params: { id: string; lessonId: string } }) {
  noStore();

  const { data: lesson, error } = await fetchLessonById(params.lessonId);
  if (error || !lesson) {
    console.error(error);
    return <div>Error: Something must have happened</div>;
  }

  return (
    <div className='flex flex-col justify-start'>
      <div className='flex flex-col gap-4 max-w-3xl'>
        <div className='max-w-fit'>
          <h1 className='text-2xl font-bold relative'>{lesson.title}</h1>
          <p className='italic'>
            {lesson.teachers?.profiles?.first_name} {lesson.teachers?.profiles?.last_name}
          </p>
        </div>

        <div>{parse(lesson.content)}</div>
        {lesson.file_url && (
          <Link className='text-blue-400 hover:underline flex gap-2 items-center' href={lesson.file_url}>
            <ArrowDownToLine width={20} height={20} />
            File to download
          </Link>
        )}
        {lesson.link_url && (
          <Link className='text-blue-400 hover:underline flex gap-2 items-center' href={lesson.link_url}>
            <Link2 width={20} height={20} />
            Additional resources
          </Link>
        )}
      </div>
    </div>
  );
}
