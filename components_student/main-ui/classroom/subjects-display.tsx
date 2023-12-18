import Link from "next/link";
import SubjectBox from "@/components_student/main-ui/classroom/subject-box";
import CreateClassroomButton from "@/components_student/buttons/create-classroom-button";
import { GradeLevelEnum } from "@/lib/collection.types";
import capitalizeFirstLetter from "@/utils/capitalize";
import { headers } from "next/headers";
import EmptySubjectBox from "./empty-subject-box";

type classroomDataType = {
  id: string;
  grade_level: "Grade 1" | "Grade 2" | "Grade 3" | "Grade 4" | "Grade 5" | "Grade 6";
  section: string;
} | null;

type SubjectsDataType = {
  classroom_id: string;
  created_at: string;
  id: string;
  name: string;
  teacher_id: string;
};

const SubjectsDisplay = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/student/section`, {
    cache: "no-store",
    // NOTE: We need to manually attach
    // the headers from the original request to the fetch call made
    // from the Server Component 👇
    headers: headers(),
  });
  const { classroomData: classroom, subjectsData: subjects }: { classroomData: classroomDataType; subjectsData: SubjectsDataType[] } = await response.json();

  if (!classroom || !subjects) return <div>Something must have happened...</div>;

  return (
    <div>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2'>
          <h1 className='text-lg md:text-3xl font-bold '>{`${classroom.grade_level} - ${classroom.section}`}</h1>
          {/* <CreateClassroomButton /> */}
        </div>
        {
          <div className='min-h-fit p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
            <div className='grid grid-cols-3 gap-2 auto-cols-max'>
              {subjects && subjects.length > 0 ? (
                subjects.map((subject) => <SubjectBox key={subject.id} subject={capitalizeFirstLetter(subject.name)} subjectLink={`/student/subjects/${subject.id}`} />)
              ) : (
                <div>No subject</div>
              )}
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default SubjectsDisplay;
