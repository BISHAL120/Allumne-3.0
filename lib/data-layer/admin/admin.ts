export const runtime = "nodejs";


import db from "@/lib/prisma";
import { isAdmin } from "../check-Access";
import { OrderStatus, ProductStatus, Role } from "@prisma/client";

// Get All Category
export const getAllCategory = async () => {
    await isAdmin();
    const categories = await db.category.findMany({
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
    return categories;
}

// Get All Products
export async function getAllProducts({
    page, per_page, category, search, status
}: {
    page: number, per_page: number, category: string, search: string, status: string
}) {
    await isAdmin();

    interface WhereClause {
        productName?: {
            contains: string,
            mode: "insensitive"
        },
        status?: ProductStatus,
        categoryId?: string,
    }

    // Search Query
    const whereClause: WhereClause = {};

    // Category filter - only apply if category is specified
    if (category && category.trim() !== '') {
        whereClause.categoryId = category.trim();
    }

    if (search && search.trim() !== '') {
        whereClause.productName = {
            contains: search,
            mode: "insensitive"
        }
    }

    // Status filter - only apply if status is specified
    if (status && status.trim() !== '') {
        whereClause.status = status.trim() as ProductStatus;
    }

    const skip = (page - 1) * per_page;
    const totalItems = await db.product.count({
        where: whereClause
    });
    const totalPage = Math.ceil(totalItems / per_page);
    const hasNext = page < totalPage;

    const products = await db.product.findMany({
        where: whereClause,
        include: {
            user: {
                select: {
                    name: true
                }
            }
        },
        skip,
        take: per_page,
        orderBy: {
            createdAt: "desc"
        }
    })

    return {
        products,
        pagination: {
            totalItems,
            totalPage,
            page,
            per_page,
            hasNext
        }
    };
}

// Get All Pending Products
export async function getAllPendingProducts({ page, per_page, search }: { page: number, per_page: number, search: string }) {
    await isAdmin();

    interface WhereClause {
        productName?: {
            contains: string,
            mode: "insensitive"
        },
    }

    // Search Query
    const whereClause: WhereClause = {};
    if (search && search.trim() !== '') {
        whereClause.productName = {
            contains: search,
            mode: "insensitive"
        }
    }

    const skip = (page - 1) * per_page;
    const totalItems = await db.product.count({
        where: {
            isDeleted: false,
            status: "PENDING",
            ...whereClause
        }
    });

    const totalPage = Math.ceil(totalItems / per_page);
    const hasNext = page < totalPage;
    const products = await db.product.findMany({
        where: {
            isDeleted: false,
            status: "PENDING",
            ...whereClause
        },
        include: {
            user: {
                select: {
                    name: true
                }
            }
        },
        skip,
        take: per_page,
        orderBy: {
            createdAt: "desc"
        }
    })

    return {
        products,
        pagination: {
            totalItems,
            totalPage,
            page,
            per_page,
            hasNext
        }
    };
}

// Get All Drafts Products
export async function getAllDraftsProducts({ page, per_page, search }: { page: number, per_page: number, search: string }) {
    await isAdmin();

    interface WhereClause {
        productName?: {
            contains: string,
            mode: "insensitive"
        },
    }

    // Search Query
    const whereClause: WhereClause = {};
    if (search && search.trim() !== '') {
        whereClause.productName = {
            contains: search,
            mode: "insensitive"
        }
    }


    const skip = (page - 1) * per_page;
    const totalItems = await db.product.count({
        where: {
            isDeleted: false,
            status: "DRAFT",
            ...whereClause
        }
    });
    const totalPage = Math.ceil(totalItems / per_page);
    const hasNext = page < totalPage;
    const products = await db.product.findMany({
        where: {
            isDeleted: false,
            status: "DRAFT",
            ...whereClause
        },
        include: {
            user: {
                select: {
                    name: true
                }
            }
        },
        skip,
        take: per_page
    })

    return {
        products,
        pagination: {
            totalItems,
            totalPage,
            page,
            per_page,
            hasNext
        }
    };
}

// Get All Deleted Products
export async function getAllDeletedProducts({ page, per_page, search }: { page: number, per_page: number, search: string }) {
    await isAdmin();

    interface WhereClause {
        productName?: {
            contains: string,
            mode: "insensitive"
        },
    }

    // Search Query
    const whereClause: WhereClause = {};

    if (search && search.trim() !== '') {
        whereClause.productName = {
            contains: search,
            mode: "insensitive"
        }
    }

    const skip = (page - 1) * per_page;
    const totalItems = await db.product.count({
        where: {
            isDeleted: false,
            status: "DELETED",
            ...whereClause
        }
    });
    const totalPage = Math.ceil(totalItems / per_page);
    const hasNext = page < totalPage;
    const products = await db.product.findMany({
        where: {
            isDeleted: false,
            status: "DELETED",
            ...whereClause
        },
        include: {
            user: {
                select: {
                    name: true
                }
            }
        },
        skip,
        take: per_page
    })

    return {
        products,
        pagination: {
            totalItems,
            totalPage,
            page,
            per_page,
            hasNext
        }
    };
}

export const getCategoryDetailsById = async (categoryId: string) => {
    await isAdmin();

    const result = await db.category.findUnique({
        where: {
            id: categoryId
        }
    })

    return result
}

export const getOrders = async ({ search, status, page, perPage: per_page }: { search: string, status: string, page: number, perPage: number }) => {
    await isAdmin();

    const skip = (page - 1) * per_page;
    const totalItems = await db.order.count({
        where: {
            status: status === "all" ? undefined : status as OrderStatus,
            // OR: [
            //     {
            //         fullName: {
            //             contains: search,
            //             mode: "insensitive"
            //         }
            //     },
            //     {
            //         phone: {
            //             contains: search,
            //             mode: "insensitive"
            //         }
            //     },
            //     {
            //         email: {
            //             contains: search,
            //             mode: "insensitive"
            //         }
            //     }
            // ]
        }
    });
    const totalPage = Math.ceil(totalItems / per_page);
    const hasNext = page < totalPage;

    const orders = await db.order.findMany({
        where: {
            status: status === "all" ? undefined : status as OrderStatus,
            // OR: [
            //     {
            //         fullName: {

            //             contains: search

            //         }
            //     },
            //     {
            //         phone: {
            //             contains: search,
            //             mode: "insensitive"
            //         }
            //     },
            //     {
            //         email: {
            //             contains: search,
            //             mode: "insensitive"
            //         }
            //     }
            // ]
        },
        select: {
            id: true,
           
            status: true,
            createdAt: true,
            cartItems: {
                select: {
                    quantity: true,
                    subTotal: true,
                    product: {
                        select: {
                            productName: true,

                        }
                    }
                }
            }
        },
        skip,
        take: per_page,
        orderBy: {
            createdAt: "desc"
        }
    })

    return {
        orders,
        pagination: {
            totalItems,
            totalPage,
            page,
            per_page,
            hasNext
        }
    };
}


export const getOrderDetails = async ({ order_id }: { order_id: string }) => {
    await isAdmin();

    const result = await db.order.findUnique({
        where: {
            id: order_id
        },
        select: {
            id: true,
            orderNumber: true,
           
            totalPrice: true,
            status: true,
          
            createdAt: true,
            cartItems: {
                select: {
                    id: true,
                    thumbnail: true,
                    title: true,
                    user: true,
                    size: true,
                    price: true,
                    quantity: true,
                    subTotal: true,
                }
            }
        }
    })

    return result
}

export const getAllStores = async ({ page, per_page, search, status }: { page: number, per_page: number, search: string, status?: "active" | "inactive" }) => {
    await isAdmin();

    interface WhereClause {
        name?: {
            contains: string,
            mode: "insensitive"
        },
        isActive?: boolean;

    }

    // Search Query
    const whereClause: WhereClause = {};

    // Artist Name Search
    if (search) {
        whereClause.name = {
            contains: search,
            mode: "insensitive"
        };
    }

    // Active Status Search
    if (status && status === "active") {
        whereClause.isActive = true;
    } else if (status && status === "inactive") {
        whereClause.isActive = false;
    }

    // Pagination
    const skip = (page - 1) * per_page;
    const totalItems = await db.user.count({
        where: {
            ...whereClause,
            NOT: {
                role: {
                    has: Role.ADMIN
                }
            }
        }
    });
    const totalPage = Math.ceil(totalItems / per_page);
    const hasNext = page < totalPage;

    const stores = await db.user.findMany({
        where: {
            ...whereClause,
            NOT: {
                role: {
                    has: Role.ADMIN
                }
            }
        },
        select: {
            id: true,
            name: true,
            role: true,
            email: true,
            phoneNumber: true,
            image: true,
            isActive: true,
            products: {
                select: {
                    totalSold: true,
                }
            },
            createdAt: true,
        },
        skip,
        take: per_page,
    })

    return {
        stores,
        pagination: {
            totalItems,
            totalPage,
            page,
            per_page,
            hasNext
        }
    };
}

export const getOrderDetailsById = async (orderId: string) => {
    await isAdmin();

    const order = await db.order.findUnique({
        where: {
            id: orderId
        },
        select: {
            id: true,
           
            orderNumber: true,
            status: true,
           
            cartItems: {
                select: {
                    id: true,
                    productId: true,
                    title: true,
                    size: true,
                    price: true,
                    quantity: true,
                    user: true,
                    thumbnail: true,
                    subTotal: true,
                    orderId: true,
                }
            }
        }
    })
    return order;
}

interface AdminPanelReportProps {
    start?: Date;
    end?: Date;
}

export const AdminPanelReport = async ({ start, end }: AdminPanelReportProps = {}) => {
    await isAdmin();

    const endDate = start ? start : new Date(new Date().setMonth(new Date().getMonth()));
    const startDate = end ? end : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    // Fetch Pending Orders
    const fetchPendingOrders = await db.order.findMany({
        where: {
            status: OrderStatus.PENDING,
            createdAt: {
                gte: startDate,
                lte: endDate,
            }
        },
        select: {
            id: true,
            cartItems: {
                select: {
                    id: true,
                    subTotal: true,
                }
            }
        }
    })

    // Fetch Delivered Orders
    const fetchDeliveredOrders = await db.order.findMany({
        where: {
            status: OrderStatus.DELIVERED,
            createdAt: {
                gte: startDate,
                lte: endDate,
            }
        },
        select: {
            id: true,
            cartItems: {
                select: {
                    id: true,
                    subTotal: true,
                }
            }
        }
    })


    // Fetch Shipped Orders
    const fetchShippedOrders = await db.order.findMany({
        where: {
            status: OrderStatus.SHIPPED,
            createdAt: {
                gte: startDate,
                lte: endDate,
            }
        },
        select: {
            id: true,
            cartItems: {
                select: {
                    id: true,
                    subTotal: true,
                }
            }
        }
    })

    console.log("Processing Orders :", fetchShippedOrders)


    // Calculate Pending Order Value
    const pendingOrdervalue = fetchPendingOrders.reduce((acc, order) => {
        return acc + order.cartItems.reduce((acc, item) => {
            return acc + Number(item.subTotal);
        }, 0);
    }, 0);

    // Calculate Delivered Order Value
    const deliveredOrdervalue = fetchDeliveredOrders.reduce((acc, order) => {
        return acc + order.cartItems.reduce((acc, item) => {
            return acc + Number(item.subTotal);
        }, 0);
    }, 0);
    // Calculate Processing Order Value
    const processingOrdervalue = fetchShippedOrders.reduce((acc, order) => {
        return acc + order.cartItems.reduce((acc, item) => {
            return acc + Number(item.subTotal);
        }, 0);
    }, 0);


    return { pendingOrdervalue, deliveredOrdervalue, processingOrdervalue };

}


export const getArtistDetailsById = async (id: string) => {
    await isAdmin();

    const artist = await db.user.findUnique({
        where: {
            id
        },
    })
    return artist;
}


export const getAllUsers = async ({ page, per_page = 10, search }: { page: number, per_page: number, search?: string }) => {
    await isAdmin();

    interface WhereClause {
        OR?: {
            name?: {
                contains: string,
                mode: "insensitive"
            },
            email?: {
                contains: string,
                mode: "insensitive"
            },
            phoneNumber?: {
                contains: string,
                mode: "insensitive"
            }
        }[]
    }

    // Search Query
    const whereClause: WhereClause = {};

    // Artist Name Search
    if (search) {
        whereClause.OR = [
            {
                name: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
                email: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
                phoneNumber: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        ]
    }

    // Pagination
    const skip = (page - 1) * per_page;
    const totalItems = await db.user.count({
        where: whereClause
    });
    const totalPage = Math.ceil(totalItems / per_page);
    const hasNext = page < totalPage;

    const users = await db.user.findMany({
        where: whereClause,
        skip,
        take: per_page,
    })


    return {
        users,
        pagination: {
            totalItems,
            totalPage,
            page,
            per_page,
            hasNext
        }
    };
}