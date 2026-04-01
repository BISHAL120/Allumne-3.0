import ProcessingOrdersPage from '@/components/admin/orders/processing/processingOrders';
import { getOrders } from '@/lib/data-layer/admin/admin';
import { OrdersProps } from '../page';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const page = params?.page || "1";
  const perPage = params?.perPage || "10";

  const search = params?.search || "";
  const status = "PROCESSING";

const { orders, pagination } = await getOrders({ search, status, page: Number(page), perPage: Number(perPage) });
  return (
    <div>
        {/* <ProcessingOrdersPage orders={orders as OrdersProps[]} pagination={pagination} /> */}
        Processing Orders Page
    </div>
  )
}

export default Page