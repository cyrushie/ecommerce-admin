import { db } from "@/lib/db";
import { ProductClient } from "./_components/product-client";
import { formatPrice } from "@/lib/utils";
import { ProductColumnProps } from "./_components/column";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await db.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      color: true,
      size: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumnProps[] = products.map((product) => ({
    name: product.name,
    price: formatPrice(product.price.toNumber() as number),
    id: product.id,
    category: product.category.name,
    size: product.size.value,
    color: product.color.value,
    isArchived: product.isArchived,
    isFeatured: product.isFeatured,
    createdAt: new Intl.DateTimeFormat("en-us", {
      dateStyle: "medium",
    }).format(product.createdAt),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 flex-col space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
