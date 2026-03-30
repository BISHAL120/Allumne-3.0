import DraftsProducts from "@/components/admin/products/drafts/draftsProducts";
import { getAllDraftsProducts } from "@/lib/data-layer/admin/admin";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;

  const search = params?.search || "";
  const page = Number(params?.page || 1);
  const per_page = Number(params?.per_page || 10);

  const result = await getAllDraftsProducts({ page, per_page, search });

  return (
    <div>
      <DraftsProducts
        products={result.products}
        pagination={result.pagination}
      />
    </div>
  );
};

export default Page;
