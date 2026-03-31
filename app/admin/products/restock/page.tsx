import RestockQueue from "@/components/admin/products/restock/restock-queue";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restock Queue",
  description: "Manage products with low stock",
};

export default function RestockQueuePage() {
  return <RestockQueue />;
}