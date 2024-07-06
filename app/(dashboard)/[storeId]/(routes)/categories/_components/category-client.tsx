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

interface CategoryClientProps {
  data: {
    name: string;
    billboardLabel: string;
    id: string;
    createdAt: string;
  }[];
}

export const CategoryClient = ({ data }: CategoryClientProps) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage your categories"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
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
        description="API calls for categories"
      />
      <ApiList
        entityIdName="categoryId"
        entityName="categories"
      />
    </>
  );
};
