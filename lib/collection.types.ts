import { Database } from "./database.types";

export type User = Database["public"]["Tables"]["profiles"]["Row"];
export type RolesEnum = Database["public"]["Enums"]["roles_enum"];
export type GradeLevelEnum = Database["public"]["Enums"]["grade_level_enum"];
export type QuarterEnum = Database["public"]["Enums"]["quarter_enum"];
export type Classroom = Database["public"]["Tables"]["classrooms"]["Row"];
export type ClassroomInsert = Database["public"]["Tables"]["classrooms"]["Insert"];
export type ClassroomWithSubjects = Database["public"]["Tables"]["classrooms"]["Row"] & {
  subjects: Database["public"]["Tables"]["subjects"]["Row"] | null;
};

export type SubjectsWithClassroom = Subjects & {
  classrooms: Classroom | null;
};
export type ClassroomWithStudents = Database["public"]["Tables"]["classrooms"]["Row"] & {
  students: Database["public"]["Tables"]["students"]["Row"] | null;
};
export type StudentsNoProfile = Database["public"]["Tables"]["students"]["Row"];
export type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"];
export type ActivityType = Database["public"]["Tables"]["activities"]["Row"];
export type ActivityWithTeacher = Database["public"]["Tables"]["activities"]["Row"] & User;
export type Quiz = Database["public"]["Tables"]["quizzes"]["Row"];
export type QuestionWithAnswers = Database["public"]["Tables"]["questions"]["Row"] & {
  question_answers: {
    answers: Database["public"]["Tables"]["answers"]["Row"];
  }[];
};
export type Teacher = Database["public"]["Tables"]["teachers"]["Row"];
export type TeacherWithProfile = Database["public"]["Tables"]["teachers"]["Row"] & {
  profiles: User | null;
};

export type StudentAnswerQuiz = Database["public"]["Tables"]["student_answers_quiz"]["Row"] & {
  quizzes: Quiz | null;
};

export type StudentAnswerActivity = Database["public"]["Tables"]["student_answers_activity"]["Row"] & {
  students: Student | null;
};

export type StudentInformation = Database["public"]["Tables"]["student_information"]["Row"] & {
  students: Student | null;
};

export type Student = Database["public"]["Tables"]["students"]["Row"] & {
  profiles: User | null;
};
export type UserInformation = Database["public"]["Tables"]["student_information"]["Row"];

export type ActivitiesAndQuizzes = ActivityWithSubjectAndClassroom | QuizWithSubjectAndClassroom;

export type Subjects = Database["public"]["Tables"]["subjects"]["Row"];

export type ActivityWithSubjectAndClassroom = ActivityType & {
  subjects:
    | (Subjects & {
        classrooms: Classroom | null;
      })
    | null;
};

export type QuizWithSubjectAndClassroom = Quiz & {
  subjects:
    | (Subjects & {
        classrooms: Classroom | null;
      })
    | null;
};

export type ClassroomWithAdviser = Classroom & {
  teachers:
    | (Teacher & {
        profiles: User | null;
      })
    | null;
  subjects: Subjects[] | null;
};

export type StudentWithClassroom = Student & {
  classrooms: Classroom;
};

export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type Discussion = Database["public"]["Tables"]["discussions"]["Row"];
export type Topic = Database["public"]["Tables"]["topic"]["Row"];

export type TopicsEtc = Database["public"]["Tables"]["topic"]["Row"] & {
  activities: ActivityType[] | null;
  quizzes: Quiz[] | null;
  lessons: Lesson[] | null;
  discussions: Discussion[] | null;
};
