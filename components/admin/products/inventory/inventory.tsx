"use client";

import { useState } from "react";
import { Search, AlertCircle, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const INVENTORY = [
  {
    id: 1,
    product: "Wireless Earbuds",
    sku: "WB-10245",
    stock: 56,
    reorderLevel: 20,
    lastRestockDate: "22 Oct, 2025",
    monthlyUsage: 45,
    status: "In Stock",
  },
  {
    id: 2,
    product: "Smart LED Desk Lamp",
    sku: "SL-89012",
    stock: 8,
    reorderLevel: 20,
    lastRestockDate: "15 Oct, 2025",
    monthlyUsage: 32,
    status: "Low Stock",
  },
  {
    id: 3,
    product: "Men's Running Shoes",
    sku: "RS-20450",
    stock: 0,
    reorderLevel: 30,
    lastRestockDate: "10 Oct, 2025",
    monthlyUsage: 78,
    status: "Out of Stock",
  },
  {
    id: 4,
    product: "Fitness Tracker Watch",
    sku: "FT-67123",
    stock: 78,
    reorderLevel: 15,
    lastRestockDate: "25 Oct, 2025",
    monthlyUsage: 28,
    status: "In Stock",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-800";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800";
    case "Out of Stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");

  const filteredItems = INVENTORY.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = status === "all" || item.status === status;
    return matchesSearch && matchesStatus;
  });

  const lowStockCount = INVENTORY.filter((i) => i.status !== "In Stock").length;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Inventory Management
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Total Products
            </div>
            <div className="text-2xl font-bold text-foreground">
              {INVENTORY.length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">In Stock</div>
            <div className="text-2xl font-bold text-green-600">
              {INVENTORY.filter((i) => i.status === "In Stock").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Low Stock</div>
            <div className="text-2xl font-bold text-yellow-600">
              {INVENTORY.filter((i) => i.status === "Low Stock").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Out of Stock
            </div>
            <div className="text-2xl font-bold text-red-600">
              {INVENTORY.filter((i) => i.status === "Out of Stock").length}
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Reorder Stock
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    PRODUCT
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    STOCK
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    REORDER LEVEL
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    MONTHLY USAGE
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    LAST RESTOCK
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {item.product}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {item.stock}
                        </span>
                        {item.status !== "In Stock" && (
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {item.reorderLevel}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-foreground">
                          {item.monthlyUsage}/month
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {item.lastRestockDate}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
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
