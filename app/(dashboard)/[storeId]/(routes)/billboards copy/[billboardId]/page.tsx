import { db } from "@/lib/db";
import React from "react";
import BillboardForm from "./_components/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboard = await db.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div className="p-8 pt-6 flex-col space-y-4">
      <BillboardForm initialValue={billboard} />
    </div>
  );
};

export default BillboardPage;
