import NewCategory from "@/components/admin/category/id/new-category";
import { getCategoryDetailsById } from "@/lib/data-layer/admin/admin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Category",
  description: "Create a new category manually",
};


const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const categoryId = params?.categoryId || "";

  let category = null;
  if (categoryId) category = await getCategoryDetailsById(categoryId);

  return (
    <div>
      <NewCategory initialData={category} />
    </div>
  );
};

export default Page;
