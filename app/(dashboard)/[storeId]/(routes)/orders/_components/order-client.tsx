"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { columns } from "./column";

interface OrderClientProps {
  data: {
    id: string;
    phone: string;
    address: string;
    totalPrice: string;
    isPaid: boolean;
    products: string;
    createdAt: string;
  }[];
}

export const OrderClient = ({ data }: OrderClientProps) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage your orders"
      />
      <Separator />
      <DataTable
        columns={columns}
        data={data}
        filterKey="id"
      />
    </>
  );
};
