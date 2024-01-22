import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { fetchAllClassrooms } from "@/actions/section/fetch-classroom";
import { Classroom } from "@/lib/collection.types";
import React, { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { classroomColumns } from "./classroom-column";

const ClassroomsTable = async () => {
  const { data: classrooms, error } = await fetchAllClassrooms();
  if (error || !classrooms) return <div>{error?.message}</div>;

  return (
    <div>
      <DataTable columns={classroomColumns} data={classrooms} />
    </div>
  );
};

export default ClassroomsTable;
