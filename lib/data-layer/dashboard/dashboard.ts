import db from "@/lib/prisma";
import { isArtist } from "../check-Access";
import { getServerSession } from "@/lib/get-session";

export const getArtistAllProducts = async ({
    userId,
    page,
    per_page,
    search,
}: {
    userId: string;
    page: number;
    per_page: number;
    search: string;
}) => {
    await isArtist();
    const skip = (page - 1) * per_page;
    const totalItems = await db.product.count(
        {
            where: {
                userId,
                isDeleted: false,
                productName: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        }
    );
    const totalPage = Math.ceil(totalItems / per_page);
    const hasNext = page < totalPage;
    const products = await db.product.findMany({
        where: {
            userId,
            isDeleted: false,
            productName: {
                contains: search,
                mode: "insensitive",
            },
        },
        select: {
            id: true,
            productName: true,
            thumbnail: true,
            images: true,
            variants: true,
            createdAt: true,
            totalSold: true,
            user: {
                select: {
                    name: true,
                }
            }
        },
        skip,
        take: per_page,
    });
    return {
        products,
        pagination: {
            totalItems,
            totalPage,
            page,
            per_page,
            hasNext,
        },
    };
};

export const getArtistDeletedProducts = async ({
    userId,
    page,
    per_page,
}: {
    userId: string;
    page: number;
    per_page: number;
}) => {
    await isArtist();
    const skip = (page - 1) * per_page;
    const productCount = await db.product.count(
        {
            where: {
                userId,
                isDeleted: true,
            },
        }
    );
    const totalPage = Math.ceil(productCount / per_page);
    const hasNext = page < totalPage;
    const products = await db.product.findMany({
        where: {
            userId,
            isDeleted: true,
        },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
        skip,
        take: per_page,
    });
    return {
        products,
        pagination: {
            productCount,
            totalPage,
            page,
            per_page,
            hasNext,
        },
    };
};

export const getProductDetailsForPromotion = async ({
    userId,
    page,
    per_page,
}: {
    userId: string;
    page: number;
    per_page: number;
}) => {
    await isArtist();
    const skip = (page - 1) * per_page;
    const totalItems = await db.product.count(
        {
            where: {
                userId,
                isDeleted: false,
            },
        }
    );
    const totalPage = Math.ceil(totalItems / per_page);
    const hasNext = page < totalPage;

    const products = await db.product.findMany({
        where: {
            userId,
            isDeleted: false,
        },
        select: {
            id: true,
            productName: true,
            shortDescription: true,
            fullDescription: true,
            thumbnail: true,
            images: true,
        },
        skip,
        take: per_page,
    });
    return {
        products,
        pagination: {
            totalItems,
            totalPage,
            page,
            per_page,
            hasNext,
        },
    };

}

export const getDetailsForPayment = async ({
    productId,
}: {
    productId: string;
}) => {
    await isArtist();
    const product = await db.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
            productName: true,
            shortDescription: true,
            thumbnail: true,
            images: true,
        },
    });
    
    return { product };
}

export const getUserDetailsById = async () => {
    await isArtist();

    const session = await getServerSession();
    const userId = await session?.user?.id;

    const user = await db.user.findUnique({
        where: {
            id: userId,
        },
    })
    return user;
}