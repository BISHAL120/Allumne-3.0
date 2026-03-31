import AllProductsPage from "@/components/admin/products/allProducts";
import { getAllCategory, getAllProducts } from "@/lib/data-layer/admin/admin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage all products",
};



const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  
  const page = Number(params?.page || 1);
  const per_page = Number(params?.per_page || 10);
  const category = params.category || "";
  const search = params.search || "";
  const status = params.status || "";

  const result = await getAllProducts({ page, per_page, category, search, status });
  const categories = await getAllCategory();

  return (
    <div>
      <AllProductsPage categories={categories} products={result.products} pagination={result.pagination} />
    </div>
  );
};

export default Page;
