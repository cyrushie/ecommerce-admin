import { db } from "@/lib/db";

export const getTotalStock = async (storeId: string) => {
  const totalStock = await db.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return totalStock;
};
