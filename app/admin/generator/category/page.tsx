import GenerateCategories from "@/components/admin/generator/categories/generate-categories";
import { getServerSession } from "@/lib/get-session";
import React from "react";

const Page = async () => {
  const session = await getServerSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Please login first");
  }

  return (
    <div className="p-6">
      <GenerateCategories />
    </div>
  );
};

export default Page;