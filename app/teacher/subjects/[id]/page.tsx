import { fetchSubjectById } from "@/actions/section/fetch-subject";
import Activity from "@/components/main-ui/subject/activity";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateActivityButton from "@/components/buttons/create-activity-button";
import ActivityDashboard from "@/components/main-ui/subject/activity-dashboard";
import { Suspense } from "react";

export default async function SubjectPage({ params }: { params: { id: string } }) {
  const subject = await fetchSubjectById(params.id);
  if (subject.error || !subject.data || !subject.data.classrooms) {
    return <div>Error: Something must have happened</div>;
  }
  const classroom = subject.data.classrooms;

  return (
    <div>
      <ActivityDashboard subjectId={params.id} gradeLevel={classroom.grade_level} section={classroom.section} subject={subject.data.name} />
    </div>
  );
}
