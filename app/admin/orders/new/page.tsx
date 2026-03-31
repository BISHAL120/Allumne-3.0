import NewOrder from "@/components/admin/orders/new/newOrders";
import React from "react";
import { OrdersProps } from "../page";
import { getOrders } from "@/lib/data-layer/admin/admin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Order",
  description: "Manage new orders",
};


const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const page = params?.page || "1";
  const perPage = params?.perPage || "10";

  const search = params?.search || "";
  const status = "PENDING";

  const { orders, pagination } = await getOrders({
    search,
    status,
    page: Number(page),
    perPage: Number(perPage),
  });
  return (
    <div>
      <NewOrder orders={orders as OrdersProps[]} pagination={pagination} />
    </div>
  );
};

export default Page;
