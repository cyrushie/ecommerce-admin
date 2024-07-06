import { db } from "@/lib/db";
import React from "react";
import SizeForm from "./_components/size-form";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  const size = await db.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className="p-8 pt-6 flex-col space-y-4">
      <SizeForm initialValue={size} />
    </div>
  );
};

export default SizePage;
