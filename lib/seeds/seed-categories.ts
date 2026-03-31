"use server";

import db from "@/lib/prisma";
import { getServerSession } from "../get-session";

interface CategorySeedOptions {
  count?: number;
}

export const generateCategories = async ({
  count = 5,
}: CategorySeedOptions) => {
  const session = await getServerSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: Please login first");
  }

  const categories = [];

  for (let i = 1; i <= count; i++) {
    const name = `Category ${i} ${Math.random().toString(36).substring(7)}`;
    categories.push({
      name,
      desc: `Description for ${name}`,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      imageUrl: "https://picsum.photos/400/400",
      metaTitle: `${name} Meta Title`,
      metaDescription: `Meta description for ${name}`,
      isFeatured: Math.random() > 0.7,
    });
  }

  const result = await db.category.createMany({
    data: categories,
  });

  return result;
};
