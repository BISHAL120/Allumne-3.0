"use server";

import db from "@/lib/prisma";
import { DiscountType, ProductStatus, productType } from "@prisma/client";
import { getServerSession } from "../get-session";
import { logActivity } from "../actions/activity-log";

interface SeedOptions {
  categoryId: string;
  count?: number;
}

interface SeedScriptOptions extends SeedOptions {
  userId: string;
}

type SeedProductRecord = {
  id: string;
  productName: string;
  thumbnail: string | null;
  variants: { size: string; price: number; stock?: number | null; discountType?: DiscountType | null; discountPrice?: number | null }[];
};

const buildSeedProductsData = ({
  categoryId,
  userId,
  count,
}: {
  categoryId: string;
  userId: string;
  count: number;
}) => {
  const products = [];
  const generatedSlugs: string[] = [];

  for (let i = 1; i <= count; i++) {
    const variants = [
      {
        size: "Small",
        price: (Math.floor(Math.random() * 50) + 10),
        stock: (Math.floor(Math.random() * 100) + 10),
        discountType: DiscountType.NONE,
        discountPrice: 0,
      },
      {
        size: "Large",
        price: (Math.floor(Math.random() * 100) + 50),
        stock: (Math.floor(Math.random() * 50) + 5),
        discountType: DiscountType.FIXED,
        discountPrice: (Math.floor(Math.random() * 10) + 1),
      },
    ];

    const totalStock = variants.reduce(
      (acc, v) => acc + (Number(v.stock) || 0),
      0,
    );

    const slug = `product-${i}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    generatedSlugs.push(slug);

    products.push({
      productName: `Product ${i}`,
      shortDescription: `Short description for Product ${i}`,
      fullDescription: `Full description for Product ${i}. This is a detailed description with more than 20 characters as required by the schema.`,
      slug,
      status: ProductStatus.PUBLISHED,
      type: productType.PHYSICAL,
      variants,
      totalStock,
      images: [
        {
          imageUrl: "https://picsum.photos/400/400",
          imageID: `img-${i}-1`,
        },
      ],
      thumbnail: "https://picsum.photos/200/200",
      isFeatured: Math.random() > 0.8,
      userId,
      categoryId,
      metaTitle: `Product ${i} Meta Title`,
      metaDescription: `Meta description for Product ${i}`,
    });
  }

  return { products, generatedSlugs };
};

export const generateProductsForSeed = async ({
  categoryId,
  userId,
  count = 10,
}: SeedScriptOptions): Promise<SeedProductRecord[]> => {
  const { products, generatedSlugs } = buildSeedProductsData({ categoryId, userId, count });

  await db.product.createMany({
    data: products,
  });

  return db.product.findMany({
    where: {
      slug: {
        in: generatedSlugs,
      }
    },
    select: {
      id: true,
      productName: true,
      thumbnail: true,
      variants: true,
    }
  });
};


export const generateProducts = async ({
    categoryId,
    count = 10,
}: SeedOptions) => {
    const session = await getServerSession();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("Unauthorized: Please login first");
    }

  const { products } = buildSeedProductsData({ categoryId, userId, count });

  await db.product.createMany({
    data: products,
  });

  const category = await db.category.findUnique({
    where: { id: categoryId },
    select: { name: true }
  });

  await logActivity({
    action: "PRODUCT_CREATED",
    description: `User generated ${count} products in '${category?.name || categoryId}' category`,
    entityId: categoryId,
    entityType: "CATEGORY",
    userId,
  });

  return products;
};
