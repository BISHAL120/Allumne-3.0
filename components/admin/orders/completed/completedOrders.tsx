"use client";

import { useState } from "react";
import { Search, Eye, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const COMPLETED_ORDERS = [
  {
    id: 1,
    orderNumber: "ORD-001452",
    customer: "John Doe",
    email: "john@example.com",
    product: "Wireless Earbuds",
    quantity: 2,
    amount: "$119.98",
    date: "28 Oct, 2025 1:03 AM",
  },
  {
    id: 3,
    orderNumber: "ORD-001450",
    customer: "Mike Johnson",
    email: "mike@example.com",
    product: "Men's Running Shoes",
    quantity: 1,
    amount: "$89.00",
    date: "26 Oct, 2025 10:39 AM",
  },
  {
    id: 6,
    orderNumber: "ORD-001447",
    customer: "Lisa Anderson",
    email: "lisa@example.com",
    product: "Modern Lounge Chair",
    quantity: 1,
    amount: "$199.00",
    date: "23 Oct, 2025 2:29 AM",
  },
  {
    id: 7,
    orderNumber: "ORD-001446",
    customer: "James Taylor",
    email: "james@example.com",
    product: "Plush Toy Bear",
    quantity: 5,
    amount: "$79.95",
    date: "22 Oct, 2025 7:25 AM",
  },
];

export default function CompletedOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = COMPLETED_ORDERS.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search order number or customer..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    ORDER ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    CUSTOMER
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    PRODUCT
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    AMOUNT
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    DATE
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {order.customer}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {order.product}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {order.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/orders/id/${order.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
