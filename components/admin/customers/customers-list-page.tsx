"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { CustomerFilter, CustomerListItem, CustomerSort } from "@/lib/data-layer/admin/customers";

const perPage = 10;

export default function CustomersListPage({
  customers,
  pagination,
  initialQuery,
}: {
  customers: CustomerListItem[];
  pagination: {
    totalItems: number;
    totalPage: number;
    page: number;
    per_page: number;
    hasNext: boolean;
  };
  initialQuery: {
    search: string;
    filter: CustomerFilter;
    sort: CustomerSort;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [search, setSearch] = useState(initialQuery.search);
  const [filter, setFilter] = useState<CustomerFilter>(initialQuery.filter);
  const [sort, setSort] = useState<CustomerSort>(initialQuery.sort);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsString);
      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }

      if (filter !== "all") {
        params.set("filter", filter);
      } else {
        params.delete("filter");
      }

      if (sort !== "newest") {
        params.set("sort", sort);
      } else {
        params.delete("sort");
      }

      params.set("page", "1");
      params.set("per_page", perPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    }, 450);

    return () => clearTimeout(timer);
  }, [search, filter, sort, pathname, router, searchParamsString]);

  const pageNumbers = useMemo(() => {
    if (pagination.totalPage <= 1) return [1];
    const result: (number | "ellipsis")[] = [1];
    const start = Math.max(2, pagination.page - 1);
    const end = Math.min(pagination.totalPage - 1, pagination.page + 1);

    if (start > 2) result.push("ellipsis");
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    if (end < pagination.totalPage - 1) result.push("ellipsis");
    result.push(pagination.totalPage);
    return result;
  }, [pagination.page, pagination.totalPage]);

  const navigateToPage = (targetPage: number) => {
    const params = new URLSearchParams(searchParamsString);
    params.set("page", String(targetPage));
    params.set("per_page", perPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen p-8">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            Search, sort, and filter customers with pagination.
          </CardDescription>
          <div className="flex flex-col gap-3 pt-2 md:flex-row">
            <div className="relative md:flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                placeholder="Search name, phone, or email..."
              />
            </div>
            <Select value={filter} onValueChange={(value) => setFilter(value as CustomerFilter)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="with_orders">With Orders</SelectItem>
                <SelectItem value="without_orders">Without Orders</SelectItem>
                <SelectItem value="repeat">Repeat Customers</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(value) => setSort(value as CustomerSort)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name_asc">Name A-Z</SelectItem>
                <SelectItem value="name_desc">Name Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Orders</th>
                  <th className="px-4 py-3 text-left">Spent</th>
                  <th className="px-4 py-3 text-left">Last Order</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>
                      No customers found for this query.
                    </td>
                  </tr>
                )}
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b">
                    <td className="px-4 py-3">
                      <p className="font-medium">{customer.fullName}</p>
                      <p className="text-xs text-muted-foreground">{customer.id.slice(-8)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{customer.phone}</p>
                      <p className="text-xs text-muted-foreground">{customer.email || "No email"}</p>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3">{customer.fullAddress}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{customer.orderCount}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">${customer.totalSpent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {customer.lastOrderAt
                        ? formatDistanceToNow(customer.lastOrderAt, { addSuffix: true })
                        : "No orders"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDistanceToNow(customer.createdAt, { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPage > 1 && (
            <div className="p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.page > 1) navigateToPage(pagination.page - 1);
                      }}
                      className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {pageNumbers.map((item, index) => (
                    <PaginationItem key={`${item}-${index}`}>
                      {item === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={pagination.page === item}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToPage(item);
                          }}
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.hasNext) navigateToPage(pagination.page + 1);
                      }}
                      className={!pagination.hasNext ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
