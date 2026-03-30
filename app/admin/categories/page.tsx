import AllCategories from "@/components/admin/category/all/all-categories";
import { getAllCategory } from "@/lib/data-layer/admin/admin";
import { Category } from "@prisma/client";

const Page = async () => {
  const categories = await getAllCategory();

  return (
    <div>
      <AllCategories categories={categories as Category[]} />
    </div>
  );
};

export default Page;
