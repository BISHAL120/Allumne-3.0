"use client";

import { OrdersProps } from "@/app/admin/orders/page";
import PaginatioComponent, { PaginationProps } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { Eye, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "RETURNED":
      return "bg-purple-100 text-purple-800";
    case "CANCELLED":
      return "bg-orange-100 text-orange-800";
    case "REJECTED":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AllOrdersPage({
  orders,
  pagination,
}: {
  orders: OrdersProps[];
  pagination: PaginationProps;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [debounceSearchTerm, searchTerm]);

  useEffect(() => {
    if (debounceSearchTerm) {
      router.push(
        `/admin/orders?search=${debounceSearchTerm}${status !== "all" ? `&status=${status}` : ""}`,
      );
    } else if (status !== "all") {
      router.push(`/admin/orders?status=${status}`);
    } else {
      router.push(`/admin/orders`);
    }
  }, [debounceSearchTerm, router, status]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search order number or customer..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                Filter By:
              </span>
            </div>

            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="RETURNED">Returned</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/*  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select> */}

            <div className="flex items-center gap-2">
              {/* <Select defaultValue="8">
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button> */}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    CUSTOMER
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    PRODUCT
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    TOTAL
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    STATUS
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-200 dark:hover:bg-black"
                  >
                    {/*  <td className="px-6 py-4">
                      <input type="checkbox" className="rounded" />
                    </td> */}
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {index + 1 + (pagination.page - 1) * pagination.per_page}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {order.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.phone}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-foreground">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="truncate max-w-md">
                            {order.cartItems
                              .map((item) => item.product.productName)
                              .join(", ")}{" "}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md text-base font-medium">
                          <ScrollArea
                            className={
                              order.cartItems
                                .map((item) => item.product.productName)
                                .join(", ").length > 100
                                ? "h-40"
                                : ""
                            }
                          >
                            <p>
                              {order.cartItems
                                .map((item) => item.product.productName)
                                .join(", ")}{" "}
                            </p>
                          </ScrollArea>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {order.cartItems.reduce(
                            (total, item) => total + Number(item.subTotal),
                            0,
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Qty:{" "}
                          {order.cartItems.reduce(
                            (total, item) => total + item.quantity,
                            0,
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(order.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/orders/id/${order.id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Pencil className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="group flex items-center gap-2 text-red-600 focus:text-white focus:bg-red-600">
                            <Trash2 className="w-4 h-4 group-hover:text-white" />
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
       {pagination.hasNext && <PaginatioComponent pagination={pagination} />}
      </div>
    </div>
  );
}
