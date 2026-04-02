import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search + Filter Bar Skeleton */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* "Filter By:" label */}
            <Skeleton className="h-4 w-16" />

            {/* Status Select */}
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>
        </div>

        {/* Orders Table Skeleton */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {[
                    "ID",
                    "CUSTOMER",
                    "PRODUCT",
                    "TOTAL",
                    "STATUS",
                    "ACTIONS",
                  ].map((col) => (
                    <th key={col} className="px-6 py-4 text-left">
                      <Skeleton className="h-4 w-16" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {/* ID */}
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-4" />
                    </td>

                    {/* Customer — fullName + phone */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </td>

                    {/* Product — truncated product names */}
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-48" />
                    </td>

                    {/* Total — subTotal + Qty */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </td>

                    {/* Status — colored badge + createdAt */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </td>

                    {/* Actions — ghost icon button */}
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-8 rounded-md" />
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
