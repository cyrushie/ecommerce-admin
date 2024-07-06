import { db } from "@/lib/db";
import { CategoryClient } from "./_components/category-client";
import { CategoryColumnProps } from "./_components/column";

const CategoryPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumnProps[] = categories.map(
    (category) => ({
      name: category.name,
      id: category.id,
      billboardLabel: category.billboard.label,
      createdAt: new Intl.DateTimeFormat("en-us", {
        dateStyle: "medium",
      }).format(category.createdAt),
    })
  );

  return (
    <div>
      <div className="flex-1 flex-col space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoryPage;
