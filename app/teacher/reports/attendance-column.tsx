import { ColumnDef } from "@tanstack/react-table";
import { AttendanceTableColumn, StudentInformationType } from "./page";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Check, Cross } from "lucide-react";

export const columns: ColumnDef<AttendanceTableColumn>[] = [
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

export const generateColumn = (daysOfTheMonth: number) => {
  const columns: ColumnDef<any>[] = [
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
  for (let i = 0; i < daysOfTheMonth; i++) {
    columns.push({
      id: `${i}`,
      header: ({ column }) => {
        return (
          <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            {i + 1}
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      accessorFn: (row) => (row.attendance[i] ? "✅" : "❌"),
    });
  }

  return columns;
};
