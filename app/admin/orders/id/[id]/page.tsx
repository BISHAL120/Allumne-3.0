import { getOrderDetails } from "@/lib/data-layer/admin/admin";
import React from "react";
import OrderDetails from "@/components/admin/orders/id/order-details";
import { notFound } from "next/navigation";
import OrderNotFound from "@/components/admin/orders/order-not-found";


interface OrderItem {
  id: string;
  thumbnail: string;
  title: string;
  user: string;
  size: string;
  price: string;
  quantity: number;
  subTotal: string;
}

export interface SingleOrderProps {
  id: string;
  orderNumber: string;
  fullName: string;
  email: string | null;
  phone: string;
  fullAddress: string;
  totalPrice: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  customRequirements?: string | null;
  paymentScreenshot?: string | null;
  cartItems: OrderItem[];
  createdAt: Date | string;
}


const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const order = await getOrderDetails({ order_id: id });

  if (!order) {
    return <OrderNotFound />
  }

  return (
    <div className="min-h-screen">
      <OrderDetails order={order as unknown as Parameters<typeof OrderDetails>[0]["order"]} />
    </div>
  );
};

export default Page;
