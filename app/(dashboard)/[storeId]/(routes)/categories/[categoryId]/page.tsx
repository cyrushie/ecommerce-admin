import { db } from "@/lib/db";
import React from "react";
import CategoryForm from "./_components/category-form";

const BillboardPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
    },
    include: {
      billboard: true,
    },
  });

  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <div className="p-8 pt-6 flex-col space-y-4">
      <CategoryForm
        initialValue={category}
        billboards={billboards}
      />
    </div>
  );
};

export default BillboardPage;
