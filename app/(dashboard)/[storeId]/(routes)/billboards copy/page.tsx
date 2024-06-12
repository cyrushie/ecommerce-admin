import { db } from "@/lib/db";
import { BillboardClient } from "./_components/billboard-client";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards = billboards.map((billboard) => ({
    label: billboard.label,
    id: billboard.id,
    createdAt: new Intl.DateTimeFormat("en-us", {
      dateStyle: "medium",
    }).format(billboard.createdAt),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 flex-col space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
