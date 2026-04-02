import EditOrder from "@/components/admin/orders/edit/edit-order";
import OrderNotFound from "@/components/admin/orders/order-not-found";
import { getOrderDetailsById } from "@/lib/data-layer/admin/admin";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const order = await getOrderDetailsById(id);

  if (!order) {
   return <OrderNotFound />
  }

  return (
    <div>
      <EditOrder initialData={order} />
    </div>
  );
};

export default Page;
