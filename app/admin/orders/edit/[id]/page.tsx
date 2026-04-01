import EditOrder from '@/components/admin/orders/edit/edit-order';
import { getOrderDetailsById } from '@/lib/data-layer/admin/admin';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const order = await getOrderDetailsById(id);

  return (
    <div>
      Edit Order Page
        {/* <EditOrder initialData={order} /> */}
    </div>
  )
}

export default Page