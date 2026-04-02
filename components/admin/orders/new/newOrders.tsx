"use client";

import { OrdersProps } from "@/app/admin/orders/page";
import PaginatioComponent, {
  PaginationProps,
} from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { Eye, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewOrdersPage({
  orders,
  pagination,
}: {
  orders: OrdersProps[];
  pagination: PaginationProps;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="customer Name, Number or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                          {order.customer.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer.phone}
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
                        <Badge className="bg-blue-100 text-blue-800">
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
                          <DropdownMenuItem
                            asChild
                            className="flex items-center gap-2"
                          >
                            <Link
                              href={`/admin/orders/edit/${order.id}`}
                              className="flex items-center gap-2"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Link>
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
        {pagination.totalPage > 1 && (
          <PaginatioComponent pagination={pagination} />
        )}
      </div>
    </div>
  );
}
