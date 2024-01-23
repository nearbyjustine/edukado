import SubjectBox from "@/components/main-ui/classroom/subject-box";
import capitalizeFirstLetter from "@/utils/capitalize";
import { fetchSubject } from "@/actions/subjects/fetch-subjects";

const SubjectsDisplay = async () => {
  const response = await fetchSubject();

  const { classroomData: classrooms, classroomError } = response;

  if (!classrooms && classroomError) {
    return <div>Error. Something happened.</div>;
  }

  return (
    <div>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2'>
          <h1 className='text-lg md:text-3xl font-bold '>Grade Levels and Section</h1>
          {/* <CreateClassroomButton /> */}
        </div>
        {classrooms &&
          classrooms.map((classroom) => {
            return (
              <div key={classroom.id} className='min-h-[216px] p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
                <p className='font-bold select-none'>{`${classroom.grade_level.toUpperCase()} - ${classroom.section.toUpperCase()}`}</p>
                <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-2 auto-cols-max'>
                  {classroom.subjects && classroom.subjects.length > 0 ? (
                    classroom.subjects.map((subject, index) => <SubjectBox key={subject.id} subject={capitalizeFirstLetter(subject.name)} subjectLink={`/teacher/subjects/${subject.id}`} />)
                  ) : (
                    <div>No subject</div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SubjectsDisplay;
