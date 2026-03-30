"use client";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { showError, showLoading, showSuccess } from "@/lib/toast";
import { Product } from "@prisma/client";
import axios from "axios";
import { Check, Eye, MoreHorizontal, Pencil, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageTittle from "../../shared/pageTittle";
import { format } from "date-fns";

interface ProductProps {
  products: (Product & {
    artist: {
      name: string;
    };
  })[];
  pagination: PaginationProps;
}

export default function DraftsProducts({ products, pagination }: ProductProps) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    // Create timeout to delay URL update
    const timeoutId = setTimeout(() => {
      // Build query params object
      const params = new URLSearchParams();

      if (searchTerm) params.set("search", searchTerm);
      if (page) params.set("page", page);

      // Construct URL with query params
      const url = `/admin/products/drafts${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      // Only update URL if params changed
      if (url !== window.location.pathname + window.location.search) {
        router.push(url);
      }
    }, 200); // 0.2 second delay

    // Cleanup timeout on unmount or when dependencies change
    return () => clearTimeout(timeoutId);
  }, [searchTerm, router, page]);

  const handlePublish = (id: string, status: string) => {
    showLoading("Publishing product...");
    const payload = {
      id,
      data: {
        status: status,
      },
    };
    axios
      .patch(`/api/admin/products`, payload)
      .then(() => {
        toast.dismiss();
        showSuccess({
          message: `Product ${status.toLowerCase()} successfully`,
        });
        router.refresh();
      })
      .catch(() => {
        toast.dismiss();
        showError({ message: `Failed to ${status.toLowerCase()} product` });
      });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          {/* Header */}
          <PageTittle
            title="Drafts Products"
            description={`Showing ${
              pagination.page * pagination.per_page - pagination.per_page + 1
            } to ${pagination.hasNext ? pagination.page * pagination.per_page : pagination.totalItems} of ${
              pagination.totalItems
            } products`}
          />
        </div>
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search product name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <Card className="min-h-[calc(100vh-300px)] overflow-hidden border border-border/40 bg-card shadow-sm py-0">
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="bg-muted/30">
                <tr className="border-b border-border/60">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Product
                  </th>

                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Sold
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                  {/* <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Variants
                  </th> */}
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="w-25 px-4 py-3 mx-auto text-left font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border/40 transition-colors hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Image
                          width={36}
                          height={36}
                          src={
                            product.images[0]?.imageUrl || "/placeholder.svg"
                          }
                          alt={product.productName}
                          className="w-9 h-9 rounded-md object-cover border border-border/60"
                        />
                        <div>
                          <p className="font-semibold text-foreground">
                            {product.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            by {product.artist?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {product.totalSold}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`px-2 py-0.5 text-xs rounded-full bg-amber-600 text-white font-bold`}
                      >
                        {product.status}
                      </Badge>
                    </td>
                    {/* <td className="px-4 py-3">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">S:</span>
                          <span className="font-medium">$49</span>
                          <span className="text-muted-foreground">(12)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">M:</span>
                          <span className="font-medium">$49</span>
                          <span className="text-muted-foreground">(8)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">L:</span>
                          <span className="font-medium">$49</span>
                          <span className="text-muted-foreground">(5)</span>
                        </div>
                      </div>
                    </td> */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {format(product.createdAt, "yyyy-MM-dd")}
                      <br />
                      {format(product.createdAt, "hh:mm a")}
                    </td>
                    <td className="w-25 flex justify-center items-center px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/products/details?id=${product.id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/products/add?id=${product.id}`}
                              className="flex items-center gap-2"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Edit Product
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              handlePublish(product.id, "PUBLISHED")
                            }
                            className="flex items-center gap-2"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Publish
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
