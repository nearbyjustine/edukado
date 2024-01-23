import { fetchSubjectById } from "@/actions/section/fetch-subject";
import Activity from "@/components/main-ui/subject/activity";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateActivityButton from "@/components/buttons/create-activity-button";
import DeliverablesDashboard from "@/components/main-ui/subject/deliverables-dashboard";
import { Suspense } from "react";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
export const revalidate = 0;

export default async function SubjectPage({ params }: { params: { id: string } }) {
  const { data, error } = await fetchSubjectById(params.id, `/teacher/subjects/${params.id}`);
  if (error || !data || !data.classrooms) {
    return <div>Error: Something must have happened</div>;
  }
  const classroom = data.classrooms;

  return (
    <div>
      <DeliverablesDashboard subjectId={params.id} gradeLevel={classroom.grade_level} section={classroom.section} subject={data.name} />
    </div>
  );
}
