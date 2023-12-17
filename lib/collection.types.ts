import { Database } from "./database.types";

export type User = Database["public"]["Tables"]["profiles"]["Row"];
export type GradeLevelEnum = Database["public"]["Enums"]["roles_enum"];
