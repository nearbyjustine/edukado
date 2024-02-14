"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Student, StudentWithClassroom } from "@/lib/collection.types";
import { PeopleAdmin, StudentsArray, TeachersArray } from "./page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import StudentSelect from "./student-select";
import StudentGradeSelect from "./student-grade-select";

export const StudentColumns: ColumnDef<StudentsArray>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: "grade",
    // cell: ({ row }) => {
    //   return <StudentGradeSelect row={row} />;
    // },
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Grade
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: "section",
    // cell: ({ row }) => {
    //   return <StudentSelect row={row} />;
    // },
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Section
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },

  // {
  //   accessorKey: "classrooms",
  //   accessorFn: (v, i) => v.classrooms?.grade_level + " - " + v.classrooms?.section,
  // },
];

export const TeacherColumns: ColumnDef<TeachersArray>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
];
