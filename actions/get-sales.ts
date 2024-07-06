import { db } from "@/lib/db";

export const getSales = async (storeId: string) => {
  const salesCount = await db.order.count({
    where: {
      storeId: storeId,
      isPaid: true,
    },
  });

  return salesCount;
};
