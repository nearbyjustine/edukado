import { Database } from "./database.types";

export type User = Database["public"]["Tables"]["profiles"]["Row"];
export type RolesEnum = Database["public"]["Enums"]["roles_enum"];
export type GradeLevelEnum = Database["public"]["Enums"]["grade_level_enum"];
export type Classroom = Database["public"]["Tables"]["classrooms"]["Row"];
export type ClassroomInsert = Database["public"]["Tables"]["classrooms"]["Insert"];
export type ClassroomWithSubjects = Database["public"]["Tables"]["classrooms"]["Row"] & Database["public"]["Tables"]["subjects"]["Row"];
