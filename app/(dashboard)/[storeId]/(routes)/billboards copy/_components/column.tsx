"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellActions } from "./cell-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumnProps = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumnProps>[] = [
  {
    accessorKey: "label",
    header: "Label",
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
