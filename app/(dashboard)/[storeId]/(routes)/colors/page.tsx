import { db } from "@/lib/db";
import { ColorsClient } from "./_components/colors-client";
import { ColorColumnProps } from "./_components/column";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumnProps[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: new Intl.DateTimeFormat("en-us", {
      dateStyle: "medium",
    }).format(color.createdAt),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 flex-col space-y-4 p-8 pt-6">
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
