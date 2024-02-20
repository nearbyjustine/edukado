"use client";

import { Classroom, ClassroomWithStudents, StudentsNoProfile } from "@/lib/collection.types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import DialogSection from "./dialog/dialog-section";

export const classroomColumns: ColumnDef<ClassroomWithStudents>[] = [
  {
    accessorKey: "grade_level",
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Grade Level
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: "section",
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Section
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <DialogSection row={row} classroomId={row.getValue("id")} gradeLevel={row.getValue("grade_level")} />;
    },
  },
  {
    accessorKey: "students",
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          No. of Students
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const students: StudentsNoProfile[] = row.getValue("students");
      return <div>{students.length}</div>;
    },
  },
];
