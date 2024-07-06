import { db } from "@/lib/db";
import { SizeClient } from "./_components/size-client";
import { SizeColumnProps } from "./_components/column";

const SizePage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumnProps[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: new Intl.DateTimeFormat("en-us", {
      dateStyle: "medium",
    }).format(size.createdAt),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 flex-col space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizePage;
