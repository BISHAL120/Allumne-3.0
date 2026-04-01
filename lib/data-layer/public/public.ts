import db from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
import { cache } from "react";

// Get Original Paintings
export const getOriginalProducts = cache(async ({
  page,
  per_page = 10,
  search,
  loadAll = false,
  categoryId,
}: {
  page: number;
  per_page: number;
  search: string;
  loadAll?: boolean;
  categoryId?: string;
}) => {

  interface WhereClause {
    productName?: {
      contains: string,
      mode: "insensitive"
    },
    categoryId?: string,
    isDeleted?: boolean,
    status?: ProductStatus,
    type?: "PHYSICAL" | "DIGITAL",
  }

  // Search Query
  const whereClause: WhereClause = {
    isDeleted: false,
    status: "PUBLISHED",
    type: "PHYSICAL",
  };

  if (search && search.trim() !== '') {
    whereClause.productName = {
      contains: search,
      mode: "insensitive"
    }
  }

  if (categoryId && categoryId.trim() !== '') {
    whereClause.categoryId = categoryId.trim();
  }

  const skip = loadAll ? 0 : (page - 1) * per_page;
  const take = loadAll ? page * per_page : per_page;

  const productCount = await db.product.count({
    where: whereClause,
  });
  const totalPage = Math.ceil(productCount / per_page);
  const hasNext = page < totalPage;
  const products = await db.product.findMany({
    where: whereClause,
    select: {
      id: true,
      productName: true,
      slug: true,
      thumbnail: true,
      images: true,
      isFeatured: true,
      variants: true,
      shortDescription: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    products,
    pagination: {
      totalItems: productCount,
      totalPage,
      page,
      per_page,
      hasNext,
    },
  };
});

// Get Decore Paintings
export const getDecoreProducts = cache(async ({
  page,
  per_page = 10,
  search,
  loadAll = false,
  categoryId,
}: {
  page: number;
  per_page: number;
  search: string;
  loadAll?: boolean;
  categoryId?: string;
}) => {

  interface WhereClause {
    productName?: {
      contains: string,
      mode: "insensitive"
    },
    categoryId?: string,
    isDeleted?: boolean,
    status?: ProductStatus,
    type?: "DIGITAL",
  }

  // Search Query
  const whereClause: WhereClause = {
    isDeleted: false,
    status: "PUBLISHED",
    type: "DIGITAL",
  };

  if (search && search.trim() !== '') {
    whereClause.productName = {
      contains: search,
      mode: "insensitive"
    }
  }

  if (categoryId && categoryId.trim() !== '') {
    whereClause.categoryId = categoryId.trim();
  }

  const skip = loadAll ? 0 : (page - 1) * per_page;
  const take = loadAll ? page * per_page : per_page;

  const productCount = await db.product.count({
    where: whereClause,
  });
  const totalPage = Math.ceil(productCount / per_page);
  const hasNext = page < totalPage;
  const products = await db.product.findMany({
    where: whereClause,
    select: {
      id: true,
      productName: true,
      slug: true,
      thumbnail: true,
      images: true,
      isFeatured: true,
      variants: true,
      shortDescription: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    products,
    pagination: {
      totalItems: productCount,
      totalPage,
      page,
      per_page,
      hasNext,
    },
  };
});

// Get Single Product Details
export const getProductDetailsById = cache(async (id: string) => {

  const product = await db.product.findUnique({
    where: {
      id
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })
  return product;
});


export const getAllCategories = cache(async () => {

  const result = await db.category.findMany({
    where: {
      isDeleted: false
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      slug: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return result
})

// Get All Artists
export const getAllArtists = cache(async ({
  page,
  per_page,
  search,
  loadAll = false,
}: {
  page: number;
  per_page: number;
  search: string;
  loadAll?: boolean;
}) => {
  interface WhereClause {
    isDeleted: boolean;
    isActive: boolean;
    name?: {
      contains: string;
      mode: "insensitive";
    };
    OR: [
      {
        role: {
          hasSome: ["MANAGER", "EDITOR"],
        };
      },
    ];
  }

  // Search Query
  const whereClause: WhereClause = {
    isDeleted: false,
    isActive: true,
    OR: [
      {
        role: {
          hasSome: ["MANAGER", "EDITOR"],
        },
      },
    ],
  };

  if (search && search.trim() !== "") {
    whereClause.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  const skip = loadAll ? 0 : (page - 1) * per_page;
  const take = loadAll ? page * per_page : per_page;

  const totalItems = await db.user.count({
    where: whereClause,
  });
  const totalPage = Math.ceil(totalItems / per_page);
  const hasNext = page < totalPage;

  const artists = await db.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
    },
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    artists,
    pagination: {
      totalItems,
      totalPage,
      page,
      per_page,
      hasNext,
    },
  };
});

// Store details by store ID
export const getStoreDetailsById = cache(async (id: string) => {
  const store = await db.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
      createdAt: true,
    }
  })
  return store;
})


export const getProductByuserId = cache(async ({
  userId,
  page,
  per_page = 10,
  search,
  loadAll = false,
}: {
  userId: string;
  page: number;
  per_page: number;
  search: string;
  loadAll?: boolean;
}) => {
  const skip = loadAll ? 0 : (page - 1) * per_page;
  const take = loadAll ? page * per_page : per_page;

  const productCount = await db.product.count({
    where: {
      userId,
      isDeleted: false,
      status: "PUBLISHED",
      productName: {
        contains: search ? search : undefined,
        mode: "insensitive",
      },
    },
  });
  const totalPage = Math.ceil(productCount / per_page);
  const hasNext = page < totalPage;
  const products = await db.product.findMany({
    where: {
      userId,
      isDeleted: false,
      status: "PUBLISHED",
      productName: {
        contains: search ? search : undefined,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      productName: true,
      thumbnail: true,
      images: true,
      isFeatured: true,
      variants: true,
      shortDescription: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    products,
    pagination: {
      totalItems: productCount,
      totalPage,
      page,
      per_page,
      hasNext,
    },
  };
});


export const getFeaturedCategories = async ({ skipValue = 0, takeValue = 4 }: { skipValue?: number, takeValue?: number }) => {
  const categories = await db.category.findMany({
    where: {
      isDeleted: false,
      isFeatured: true,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      createdAt: true,
      slug: true
    },
    orderBy: {
      createdAt: "desc"
    },
    skip: skipValue,
    take: takeValue,
  })

  return categories
}

export const getFeaturedProducts = async ({ skipValue = 0, takeValue = 4 }: { skipValue?: number, takeValue?: number }) => {
  const products = await db.product.findMany({
    where: {
      isDeleted: false,
      isFeatured: true,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      productName: true,
      slug: true,
      thumbnail: true,
      variants: true,
      images: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    skip: skipValue,
    take: takeValue,
  });

  return products
}


export const getCategoryInfo = async ({ categoryId }: { categoryId: string }) => {
  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
      name: true,
      desc: true,
    },
  })

  return category
}
