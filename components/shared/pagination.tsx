"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

export interface PaginationProps {
  totalItems: number;
  totalPage: number;
  page: number;
  per_page: number;
  hasNext: boolean;
}

const PaginatioComponent = ({
  pagination,
  query
}: {
  pagination: PaginationProps;
  query?: Record<string, string>;
}) => {
  const router = useRouter();
  const queryString = Object.entries(query || {})
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
    

  return (
    <div>
      <div className="flex items-center justify-between my-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`${pagination.page > 1 ? `?page=${pagination.page - 1}&${queryString}` : ""}`}
                className={
                  pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {/* Always show page 1 */}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`?page=1`);
                }}
                isActive={pagination.page === 1}
              >
                1
              </PaginationLink>
            </PaginationItem>

            {/* Ellipsis if current page > 3 */}
            {pagination.page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Show up to 3 pages around current */}
            {Array.from(
              {
                length: Math.min(
                  3,
                  pagination.totalPage - Math.max(2, pagination.page - 1),
                ),
              },
              (_, i) => {
                const p = Math.max(2, pagination.page - 1) + i;
                if (p >= pagination.totalPage) return null;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`?page=${p}`);
                      }}
                      isActive={pagination.page === p}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              },
            )}

            {/* Ellipsis if current page < total - 2 */}
            {pagination.page < pagination.totalPage - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Always show last page if total > 1 */}
            {pagination.totalPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`?page=${pagination.totalPage}`);
                  }}
                  isActive={pagination.page === pagination.totalPage}
                >
                  {pagination.totalPage}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href={`${pagination.page < pagination.totalPage ? `?page=${pagination.page + 1}&${queryString}` : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.hasNext) {
                    router.push(`?page=${pagination.page + 1}&${queryString}`);
                  }
                }}
                className={
                  !pagination.hasNext ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginatioComponent;
