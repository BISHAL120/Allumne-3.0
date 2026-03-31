import CreateOrder from "@/components/admin/orders/create/create-order";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Order",
  description: "Create a new customer order manually",
};

export default function CreateOrderPage() {
  return <CreateOrder />;
}