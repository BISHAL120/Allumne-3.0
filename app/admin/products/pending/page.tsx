import PendingProducts from "@/components/admin/products/pending/pending-products";
import { getAllPendingProducts } from "@/lib/data-layer/admin/admin";
import React from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;

  const search = params?.search || "";
  const page = Number(params?.page || 1);
  const per_page = Number(params?.per_page || 10);

  const result = await getAllPendingProducts({ page, per_page, search });

  return (
    <div>
      <PendingProducts
        products={result.products}
        pagination={result.pagination}
      />
    </div>
  );
};

export default Page;
