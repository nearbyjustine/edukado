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
          file_url: string | null
          id: string
          link_url: string | null
          subject_id: string
          teacher_id: string
          title: string
        }
        Insert: {
          content?: string
          created_at?: string
          file_url?: string | null
          id?: string
          link_url?: string | null
          subject_id: string
          teacher_id?: string
          title?: string
        }
        Update: {
          content?: string
          created_at?: string
          file_url?: string | null
          id?: string
          link_url?: string | null
          subject_id?: string
          teacher_id?: string
          title?: string
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
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      classrooms: {
        Row: {
          created_at: string
          grade_level: Database["public"]["Enums"]["grade_level_enum"]
          id: string
          section: string
        }
        Insert: {
          created_at?: string
          grade_level: Database["public"]["Enums"]["grade_level_enum"]
          id?: string
          section?: string
        }
        Update: {
          created_at?: string
          grade_level?: Database["public"]["Enums"]["grade_level_enum"]
          id?: string
          section?: string
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
      students: {
        Row: {
          classroom_id: string
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          classroom_id: string
          created_at?: string
          id?: number
          user_id?: string
        }
        Update: {
          classroom_id?: string
          created_at?: string
          id?: number
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
          teacher_id: string
        }
        Insert: {
          classroom_id: string
          created_at?: string
          id?: string
          name?: string
          teacher_id?: string
        }
        Update: {
          classroom_id?: string
          created_at?: string
          id?: string
          name?: string
          teacher_id?: string
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
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      teachers: {
        Row: {
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      grade_level_enum:
        | "Grade 1"
        | "Grade 2"
        | "Grade 3"
        | "Grade 4"
        | "Grade 5"
        | "Grade 6"
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
