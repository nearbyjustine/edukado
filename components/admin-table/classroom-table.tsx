import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { fetchAllClassrooms, fetchAllClassroomsStudents, fetchAllSubjectsClassrooms } from "@/actions/section/fetch-classroom";
import { Classroom } from "@/lib/collection.types";
import React, { useEffect, useState } from "react";
import { DataTable } from "./classroom-datatable";
import { classroomColumns } from "./classroom-column";

const ClassroomsTable = async () => {
  // const { data: classrooms, error } = await fetchAllClassrooms();
  const { data: classroomStudents, error: classroomStudentsError } = await fetchAllClassroomsStudents();
  if (classroomStudentsError || !classroomStudents) return <div>{classroomStudentsError?.message}</div>;

  return (
    <div>
      <DataTable columns={classroomColumns} data={classroomStudents} />
    </div>
  );
};

export default ClassroomsTable;
