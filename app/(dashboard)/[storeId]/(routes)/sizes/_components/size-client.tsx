"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { columns } from "./column";
import { ApiList } from "@/components/ui/api-list";

interface SizeClientProps {
  data: {
    name: string;
    value: string;
    id: string;
    createdAt: string;
  }[];
}

export const SizeClient = ({ data }: SizeClientProps) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage your sizes"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={data}
        filterKey="name"
      />
      <Separator />
      <Heading
        title="APIs"
        description="API calls for sizes"
      />
      <ApiList
        entityIdName="sizeId"
        entityName="sizes"
      />
    </>
  );
};
