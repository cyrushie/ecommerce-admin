"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { columns } from "./column";
import { ApiList } from "@/components/ui/api-list";

interface BillboardClientProps {
  data: {
    label: string;
    id: string;
    createdAt: string;
  }[];
}

export const BillboardClient = ({ data }: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage your billboards"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={data}
        filterKey="label"
      />
      <Separator />
      <Heading
        title="APIs"
        description="API calls for billboard"
      />
      <ApiList
        entityIdName="billboardId"
        entityName="billboards"
      />
    </>
  );
};
