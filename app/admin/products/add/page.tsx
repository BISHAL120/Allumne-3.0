import { AddProduct } from "@/components/admin/products/add/addproduct";
import { getAllCategories } from "@/lib/data-layer/public/public";
import { getProductDetailsById } from "@/lib/data-layer/public/public";
import { Category, Product } from "@prisma/client";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const result = await searchParams;

  let initialData;

  if (result.id) {
    initialData = await getProductDetailsById(result.id as string);
  }

  const categories = await getAllCategories();


  return (
    <div>
      <AddProduct initialData={initialData as Product} categories={categories as Category[]} />
    </div>
  );
};

export default Page;
