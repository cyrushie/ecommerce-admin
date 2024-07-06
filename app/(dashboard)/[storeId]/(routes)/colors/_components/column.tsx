"use client";

import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { CellActions } from "./cell-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumnProps = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorColumnProps>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {row.original.value}
          <div
            className="h-5 w-5 border rounded-full"
            style={{ backgroundColor: row.original.value }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "action",
    cell: ({ row }) => {
      return <CellActions data={row.original} />;
    },
  },
];
