import { db } from "@/lib/db";
import { OrderClient } from "./_components/order-client";
import { formatPrice } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await db.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    products: order.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    phone: order.phone,
    address: order.address,
    totalPrice: formatPrice(
      order.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    isPaid: order.isPaid,
    createdAt: new Intl.DateTimeFormat("en-us", {
      dateStyle: "medium",
    }).format(order.createdAt),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 flex-col space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
