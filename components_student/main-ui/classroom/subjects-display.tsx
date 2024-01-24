import SubjectBox from "@/components_student/main-ui/classroom/subject-box";
import capitalizeFirstLetter from "@/utils/capitalize";
import { fetchSubjects } from "@/actions_student/section/fetch-subject";
import StudentQRDialog from "@/components_student/student-qr-dialog";
import { fetchAuthUser } from "@/actions/fetch-auth-user";

const SubjectsDisplay = async () => {
  const { user: userData, error: userError } = await fetchAuthUser();
  if (!userData || userError) return <div>Error. Something must have happened.</div>;
  const { data, error } = await fetchSubjects();
  if (!data || error) return <div>Error. Something must have happened.</div>;
  const { classroomData: classroom, subjectsData: subjects } = data;

  if (!classroom || !subjects) return <div>Something must have happened...</div>;

  return (
    <div>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2'>
          <h1 className='text-lg md:text-3xl font-bold '>{`${classroom.grade_level} - ${classroom.section}`}</h1>
        </div>
        <div>
          <StudentQRDialog classroomId={classroom.id} userId={userData.id} />
        </div>
        {
          <div className='min-h-fit p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 auto-cols-max gap-2'>
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
