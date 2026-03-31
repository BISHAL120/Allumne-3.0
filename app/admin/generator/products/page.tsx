import GenerateProducts from "@/components/admin/generator/products/generate-products";
import { getAllCategory } from "@/lib/data-layer/admin/admin";
import { getServerSession } from "@/lib/get-session";

const Page = async () => {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Please login first");
  }
  const categories = await getAllCategory();

  return (
    <div className="p-6">
      <GenerateProducts categories={categories} />
    </div>
  );
};

export default Page;
