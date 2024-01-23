export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          content: string
          created_at: string
          date_close: string | null
          date_open: string
          file_url: string | null
          grade: number
          id: string
          is_published: boolean
          link_url: string | null
          subject_id: string
          teacher_id: string
          title: string
          topic_id: string | null
        }
        Insert: {
          content?: string
          created_at?: string
          date_close?: string | null
          date_open?: string
          file_url?: string | null
          grade?: number
          id?: string
          is_published?: boolean
          link_url?: string | null
          subject_id: string
          teacher_id?: string
          title?: string
          topic_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          date_close?: string | null
          date_open?: string
          file_url?: string | null
          grade?: number
          id?: string
          is_published?: boolean
          link_url?: string | null
          subject_id?: string
          teacher_id?: string
          title?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          }
        ]
      }
      answers: {
        Row: {
          answer: string
          created_at: string
          id: number
          is_correct: boolean
        }
        Insert: {
          answer?: string
          created_at?: string
          id?: number
          is_correct?: boolean
        }
        Update: {
          answer?: string
          created_at?: string
          id?: number
          is_correct?: boolean
        }
        Relationships: []
      }
      attendance: {
        Row: {
          classroom_id: string
          created_at: string
          id: number
          student_id: string | null
          subject_id: string | null
        }
        Insert: {
          classroom_id: string
          created_at?: string
          id?: number
          student_id?: string | null
          subject_id?: string | null
        }
        Update: {
          classroom_id?: string
          created_at?: string
          id?: number
          student_id?: string | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          }
        ]
      }
      classrooms: {
        Row: {
          adviser_id: string | null
          created_at: string
          grade_level: Database["public"]["Enums"]["grade_level_enum"]
          id: string
          section: string
        }
        Insert: {
          adviser_id?: string | null
          created_at?: string
          grade_level: Database["public"]["Enums"]["grade_level_enum"]
          id?: string
          section?: string
        }
        Update: {
          adviser_id?: string | null
          created_at?: string
          grade_level?: Database["public"]["Enums"]["grade_level_enum"]
          id?: string
          section?: string
        }
        Relationships: [
          {
            foreignKeyName: "classrooms_adviser_id_fkey"
            columns: ["adviser_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          }
        ]
      }
      discussions: {
        Row: {
          content: string
          created_at: string
          description: string | null
          id: number
          title: string
        }
        Insert: {
          content?: string
          created_at?: string
          description?: string | null
          id?: number
          title?: string
        }
        Update: {
          content?: string
          created_at?: string
          description?: string | null
          id?: number
          title?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          id: number
          title: string | null
        }
        Insert: {
          id?: number
          title?: string | null
        }
        Update: {
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string
          birth_date: string
          first_name: string
          gender: string
          id: string
          last_name: string
          middle_name: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string
          birth_date?: string
          first_name?: string
          gender?: string
          id: string
          last_name?: string
          middle_name?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string
          birth_date?: string
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          middle_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      question_answers: {
        Row: {
          answer_id: number
          created_at: string
          id: number
          question_id: string
        }
        Insert: {
          answer_id: number
          created_at?: string
          id?: number
          question_id: string
        }
        Update: {
          answer_id?: number
          created_at?: string
          id?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_answers_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          created_at: string
          id: string
          points: number
          quiz_id: string
          title: string
          type: Database["public"]["Enums"]["question_type_enum"]
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number
          quiz_id: string
          title?: string
          type: Database["public"]["Enums"]["question_type_enum"]
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          quiz_id?: string
          title?: string
          type?: Database["public"]["Enums"]["question_type_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          }
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          date_close: string
          date_open: string
          description: string | null
          duration: number
          id: string
          is_published: boolean
          subject_id: string
          teacher_id: string
          title: string
          topic_id: string | null
          total_points: number
        }
        Insert: {
          created_at?: string
          date_close: string
          date_open?: string
          description?: string | null
          duration?: number
          id?: string
          is_published?: boolean
          subject_id: string
          teacher_id?: string
          title?: string
          topic_id?: string | null
          total_points?: number
        }
        Update: {
          created_at?: string
          date_close?: string
          date_open?: string
          description?: string | null
          duration?: number
          id?: string
          is_published?: boolean
          subject_id?: string
          teacher_id?: string
          title?: string
          topic_id?: string | null
          total_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          }
        ]
      }
      student_answers_activity: {
        Row: {
          activity_id: string
          content: string
          created_at: string
          file_url: string
          id: number
          isScored: boolean
          link_url: string
          points: number
          student_id: string
        }
        Insert: {
          activity_id: string
          content?: string
          created_at?: string
          file_url?: string
          id?: number
          isScored?: boolean
          link_url?: string
          points?: number
          student_id?: string
        }
        Update: {
          activity_id?: string
          content?: string
          created_at?: string
          file_url?: string
          id?: number
          isScored?: boolean
          link_url?: string
          points?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_answers_activity_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_answers_activity_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      student_answers_quiz: {
        Row: {
          created_at: string
          has_finished: boolean
          has_started: boolean
          id: number
          quiz_id: string
          student_id: string
          total_points: number | null
        }
        Insert: {
          created_at?: string
          has_finished?: boolean
          has_started?: boolean
          id?: number
          quiz_id: string
          student_id?: string
          total_points?: number | null
        }
        Update: {
          created_at?: string
          has_finished?: boolean
          has_started?: boolean
          id?: number
          quiz_id?: string
          student_id?: string
          total_points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_answers_quiz_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_answers_quiz_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      student_information: {
        Row: {
          address: string | null
          contact_number_parent_guardian: string | null
          created_at: string
          father_name: string | null
          guardian_name: string | null
          guardian_relationship: string | null
          id: number
          ip: Database["public"]["Enums"]["ip_enum"] | null
          lrn: number | null
          mother_name: string | null
          mother_tongue:
            | Database["public"]["Enums"]["mother_tongue_enum"]
            | null
          religion: Database["public"]["Enums"]["religion_enum"] | null
          student_id: string
        }
        Insert: {
          address?: string | null
          contact_number_parent_guardian?: string | null
          created_at?: string
          father_name?: string | null
          guardian_name?: string | null
          guardian_relationship?: string | null
          id?: number
          ip?: Database["public"]["Enums"]["ip_enum"] | null
          lrn?: number | null
          mother_name?: string | null
          mother_tongue?:
            | Database["public"]["Enums"]["mother_tongue_enum"]
            | null
          religion?: Database["public"]["Enums"]["religion_enum"] | null
          student_id: string
        }
        Update: {
          address?: string | null
          contact_number_parent_guardian?: string | null
          created_at?: string
          father_name?: string | null
          guardian_name?: string | null
          guardian_relationship?: string | null
          id?: number
          ip?: Database["public"]["Enums"]["ip_enum"] | null
          lrn?: number | null
          mother_name?: string | null
          mother_tongue?:
            | Database["public"]["Enums"]["mother_tongue_enum"]
            | null
          religion?: Database["public"]["Enums"]["religion_enum"] | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_information_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      student_questions_answers: {
        Row: {
          answer: string
          created_at: string
          id: number
          is_correct: boolean
          question_id: string
          student_answers_quiz_id: number
        }
        Insert: {
          answer?: string
          created_at?: string
          id?: number
          is_correct?: boolean
          question_id: string
          student_answers_quiz_id: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: number
          is_correct?: boolean
          question_id?: string
          student_answers_quiz_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_questions_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_questions_answers_student_answers_quiz_id_fkey"
            columns: ["student_answers_quiz_id"]
            isOneToOne: false
            referencedRelation: "student_answers_quiz"
            referencedColumns: ["id"]
          }
        ]
      }
      students: {
        Row: {
          classroom_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          classroom_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          classroom_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      subjects: {
        Row: {
          classroom_id: string
          created_at: string
          id: string
          name: string
          teacher_id: string | null
        }
        Insert: {
          classroom_id: string
          created_at?: string
          id?: string
          name?: string
          teacher_id?: string | null
        }
        Update: {
          classroom_id?: string
          created_at?: string
          id?: string
          name?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subjects_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          }
        ]
      }
      teachers: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teachers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      topic: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      compute_total_points_student_quiz: {
        Args: {
          self_student_quiz_id: number
        }
        Returns: number
      }
      question_add_to_quiz_total_points: {
        Args: {
          points: number
          quiz_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      grade_level_enum:
        | "Grade 1"
        | "Grade 2"
        | "Grade 3"
        | "Grade 4"
        | "Grade 5"
        | "Grade 6"
      guardian_relationship_enum:
        | "Step-parent"
        | "Foster parent"
        | "Legal guardian"
        | "Grandparent"
        | "Aunt"
        | "Uncle"
        | "Sister"
        | "Brother"
        | "Cousin"
        | "Other family member"
        | "Close family friend"
        | "Custodian"
        | "Godparent"
        | "Legal custodian"
      ip_enum:
        | "Tagalog"
        | "Cebuano"
        | "Ilocano"
        | "Bisaya"
        | "Hiligaynon (Ilonggo)"
        | "Waray"
        | "Bicolano"
        | "Kapampangan"
        | "Pangasinense"
        | "Maranao"
        | "Maguindanao"
        | "Tausug"
        | "Kalinga"
        | "Ibanag"
        | "Ivatan"
        | "Mangyan"
        | "Lumad"
      mother_tongue_enum:
        | "Tagalog (Filipino)"
        | "Cebuano"
        | "Ilocano"
        | "Hiligaynon (Ilonggo)"
        | "Waray"
        | "Bikol"
        | "Kapampangan"
        | "Pangasinan"
        | "Maguindanao"
        | "Tausug"
        | "Maranao"
        | "Chavacano"
        | "Kinaray-a"
        | "Aklanon"
        | "Ivatan"
        | "Yakan"
        | "Surigaonon"
        | "Ibanag"
        | "Itawis"
        | "Kankanaey"
      question_type_enum: "Multiple Choice" | "True or False" | "Identification"
      religion_enum:
        | "Roman Catholic"
        | "Islam"
        | "Born-Again Christian"
        | "Iglesia ni Cristo"
        | "Aglipayan"
        | "Buddhism"
        | "Hinduism"
        | "Judaism"
      roles_enum:
        | "student"
        | "teacher"
        | "staff"
        | "admin"
        | "security"
        | "none"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
