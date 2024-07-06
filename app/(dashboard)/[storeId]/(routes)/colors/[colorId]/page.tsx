import { db } from "@/lib/db";
import React from "react";
import ColorForm from "./_components/color-form";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  const color = await db.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className="p-8 pt-6 flex-col space-y-4">
      <ColorForm initialValue={color} />
    </div>
  );
};

export default ColorPage;
