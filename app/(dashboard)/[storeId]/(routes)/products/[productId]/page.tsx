import { db } from "@/lib/db";
import React from "react";
import ProductForm from "./_components/product-form";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="p-8 pt-6 flex-col space-y-4">
      <ProductForm
        categories={categories}
        sizes={sizes}
        colors={colors}
        initialValue={product}
      />
    </div>
  );
};

export default ProductPage;
