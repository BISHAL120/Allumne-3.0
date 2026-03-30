import Orders from "@/components/admin/orders/orders";
import { getOrders } from "@/lib/data-layer/admin/admin";
import { OrderStatus } from "@prisma/client";


export interface OrdersProps {
    status: OrderStatus;
    id: string;
    fullName: string;
    phone: string;
    email: string | null;
    createdAt: Date;
    cartItems: {
        product: {
            productName: string;
        };
        subTotal: string;
        quantity: number;
    }[];
}

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const page = params?.page || "1";
  const perPage = params?.perPage || "10";

  const search = params?.search || "";
  const status = params?.status || "all";

const { orders, pagination } = await getOrders({ search, status, page: Number(page), perPage: Number(perPage) });


  return (
    <div>
      <Orders orders={orders as OrdersProps[]} pagination={pagination} />
    </div>
  );
};

export default Page;
