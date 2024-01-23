import SubjectBox from "@/components/main-ui/classroom/subject-box";
import capitalizeFirstLetter from "@/utils/capitalize";
import { fetchClassroomWithSubjectsAdviserTeacher, fetchSubject } from "@/actions/subjects/fetch-subjects";

const SubjectsDisplay = async () => {
  const { data, error } = await fetchClassroomWithSubjectsAdviserTeacher();

  if (!data || error) {
    return <div>Error. Something happened.</div>;
  }

  return (
    <div>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2'>
          <h1 className='text-lg md:text-3xl font-bold '>Grade Levels and Section</h1>
          {/* <CreateClassroomButton /> */}
        </div>
        {data &&
          data.map((classroom) => {
            return (
              <div key={classroom.id} className='min-h-[216px] p-4 bg-green-300 text-green-900 dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col gap-4'>
                <p className='font-bold select-none flex gap-2'>
                  <span>{`${classroom.grade_level.toUpperCase()} - ${classroom.section.toUpperCase()}`}</span>
                  <span className='font-medium italic'>
                    Adviser: {classroom.teachers?.profiles?.first_name} {classroom.teachers?.profiles?.last_name}
                  </span>
                </p>
                <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-2 auto-cols-max'>
                  {classroom.subjects && classroom.subjects.length > 0 ? (
                    classroom.subjects.map((subject, index) => (
                      <SubjectBox
                        teacher={`${subject.teachers?.profiles?.first_name} ${subject.teachers?.profiles?.last_name}`}
                        key={subject.id}
                        subject={capitalizeFirstLetter(subject.name)}
                        subjectLink={`/teacher/subjects/${subject.id}`}
                      />
                    ))
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
