import { getOrderDetails } from "@/lib/data-layer/admin/admin";
import React from "react";
import OrderDetails from "@/components/admin/orders/id/order-details";
import { notFound } from "next/navigation";


interface OrderItem {
  id: string;
  thumbnail: string;
  title: string;
  artist: string;
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
  status: "PENDING" | "PROCESSING" | "DELIVERED" | "RETURNED" | "CANCELLED" | "REJECTED";
  customRequirements?: string | null;
  paymentScreenshot?: string | null;
  cartItems: OrderItem[];
  createdAt: Date | string;
}


const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const order = await getOrderDetails({ order_id: id });

  if (!order) {
    return notFound();
  }

  return (
    <div className="min-h-screen">
      <OrderDetails order={order as SingleOrderProps} />
    </div>
  );
};

export default Page;
