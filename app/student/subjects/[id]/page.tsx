import { fetchSubjectById } from "@/actions_student/section/fetch-subject";
import DeliverablesDashboard from "@/components_student/main-ui/subject/deliverables-dashboard";

export default async function SubjectPage({ params }: { params: { id: string } }) {
  const subject = await fetchSubjectById(params.id);
  if (subject.error || !subject.data || !subject.data.classrooms) {
    return <div>Error: Something must have happened</div>;
  }
  const classroom = subject.data.classrooms;

  return (
    <div>
      <DeliverablesDashboard classroomId={classroom.id} subjectId={params.id} gradeLevel={classroom.grade_level} section={classroom.section} subject={subject.data.name} />
    </div>
  );
}
