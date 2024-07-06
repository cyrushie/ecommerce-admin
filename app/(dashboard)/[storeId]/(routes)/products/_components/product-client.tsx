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

interface ProductClientProps {
  data: {
    id: string;
    name: string;
    price: string;
    category: string;
    size: string;
    color: string;
    isArchived: boolean;
    isFeatured: boolean;
    createdAt: string;
  }[];
}

export const ProductClient = ({ data }: ProductClientProps) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage your products"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
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
        description="API calls for billboard"
      />
      <ApiList
        entityIdName="productId"
        entityName="products"
      />
    </>
  );
};
