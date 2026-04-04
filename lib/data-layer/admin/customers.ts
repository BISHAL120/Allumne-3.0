import db from "@/lib/prisma";
import { OrderStatus, Prisma } from "@prisma/client";
import { isAdmin } from "../check-Access";

export type CustomerFilter = "all" | "with_orders" | "without_orders" | "repeat";
export type CustomerSort = "newest" | "oldest" | "name_asc" | "name_desc";

interface CustomerQueryParams {
  page: number;
  per_page: number;
  search: string;
  filter: CustomerFilter;
  sort: CustomerSort;
}

type CustomerBase = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  fullAddress: string;
  paymentScreenshot: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type CustomerMetrics = {
  orderCount: number;
  totalSpent: number;
  lastOrderAt: Date | null;
};

export type CustomerListItem = CustomerBase & CustomerMetrics;

export interface CustomersStats {
  totalCustomers: number;
  newThisMonth: number;
  activeLast30Days: number;
  repeatCustomers: number;
  avgOrderValue: number;
}

export interface CustomersPageData {
  stats: CustomersStats;
  topCustomers: CustomerListItem[];
  customers: CustomerListItem[];
  pagination: {
    totalItems: number;
    totalPage: number;
    page: number;
    per_page: number;
    hasNext: boolean;
  };
}

const getOrderCustomerGroups = async () => {
  return db.order.groupBy({
    by: ["customerId"],
    _count: { _all: true },
    _sum: { totalPrice: true },
    _max: { createdAt: true },
    where: {
      status: {
        not: OrderStatus.CANCELLED,
      },
    },
  });
};

const mapCustomerMetrics = async (
  customers: CustomerBase[],
): Promise<CustomerListItem[]> => {
  const customerIds = customers.map((customer) => customer.id);
  const pageOrderGroups = customerIds.length
    ? await db.order.groupBy({
        by: ["customerId"],
        _count: { _all: true },
        _sum: { totalPrice: true },
        _max: { createdAt: true },
        where: {
          customerId: { in: customerIds },
          status: { not: OrderStatus.CANCELLED },
        },
      })
    : [];

  const metricsMap = new Map(
    pageOrderGroups.map((item) => [
      item.customerId,
      {
        orderCount: item._count._all,
        totalSpent: item._sum.totalPrice ?? 0,
        lastOrderAt: item._max.createdAt ?? null,
      },
    ]),
  );

  return customers.map((customer) => {
    const metrics = metricsMap.get(customer.id) ?? {
      orderCount: 0,
      totalSpent: 0,
      lastOrderAt: null,
    };

    return {
      ...customer,
      ...metrics,
    };
  });
};

export const getCustomerStatisticsData = async (): Promise<{
  stats: CustomersStats;
  topCustomers: CustomerListItem[];
}> => {
  await isAdmin();

  const orderGroups = await getOrderCustomerGroups();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalCustomers, newThisMonth, activeLast30DaysGroups, avgOrderValueAgg] =
    await Promise.all([
      db.customer.count(),
      db.customer.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      db.order.groupBy({
        by: ["customerId"],
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
          status: {
            not: OrderStatus.CANCELLED,
          },
        },
      }),
      db.order.aggregate({
        where: {
          status: {
            not: OrderStatus.CANCELLED,
          },
        },
        _avg: {
          totalPrice: true,
        },
      }),
    ]);

  const repeatCustomers = orderGroups.filter((item) => item._count._all > 1).length;
  const avgOrderValue = Math.round(avgOrderValueAgg._avg.totalPrice ?? 0);
  const topGroups = [...orderGroups]
    .sort((a, b) => (b._sum.totalPrice ?? 0) - (a._sum.totalPrice ?? 0))
    .slice(0, 5);
  const topCustomerIds = topGroups.map((item) => item.customerId);
  const topCustomersRaw = topCustomerIds.length
    ? await db.customer.findMany({
        where: { id: { in: topCustomerIds } },
      })
    : [];

  const topCustomerMap = new Map(topCustomersRaw.map((item) => [item.id, item]));
  const topCustomers = topGroups
    .map((group) => {
      const customer = topCustomerMap.get(group.customerId);
      if (!customer) return null;
      return {
        ...customer,
        orderCount: group._count._all,
        totalSpent: group._sum.totalPrice ?? 0,
        lastOrderAt: group._max.createdAt ?? null,
      };
    })
    .filter(Boolean) as CustomerListItem[];

  return {
    stats: {
      totalCustomers,
      newThisMonth,
      activeLast30Days: activeLast30DaysGroups.length,
      repeatCustomers,
      avgOrderValue,
    },
    topCustomers,
  };
};

export const getCustomersListData = async ({
  page,
  per_page,
  search,
  filter,
  sort,
}: CustomerQueryParams): Promise<{
  customers: CustomerListItem[];
  pagination: {
    totalItems: number;
    totalPage: number;
    page: number;
    per_page: number;
    hasNext: boolean;
  };
}> => {
  await isAdmin();

  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const perPage = Number.isFinite(per_page) && per_page > 0 ? per_page : 10;

  const orderGroups = await getOrderCustomerGroups();
  const customerWithOrders = orderGroups.map((item) => item.customerId);
  const repeatCustomerIds = orderGroups
    .filter((item) => item._count._all > 1)
    .map((item) => item.customerId);

  const baseWhere: Prisma.CustomerWhereInput = {
    OR: search
      ? [
          { fullName: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ]
      : undefined,
  };

  if (filter === "with_orders") {
    baseWhere.id = customerWithOrders.length ? { in: customerWithOrders } : "__none__";
  } else if (filter === "without_orders") {
    if (customerWithOrders.length) {
      baseWhere.id = { notIn: customerWithOrders };
    }
  } else if (filter === "repeat") {
    baseWhere.id = repeatCustomerIds.length ? { in: repeatCustomerIds } : "__none__";
  }

  const totalItems = await db.customer.count({ where: baseWhere });
  const totalPage = Math.max(1, Math.ceil(totalItems / perPage));
  const hasNext = currentPage < totalPage;
  const skip = (currentPage - 1) * perPage;

  const orderByMap: Record<CustomerSort, Prisma.CustomerOrderByWithRelationInput> = {
    newest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    name_asc: { fullName: "asc" },
    name_desc: { fullName: "desc" },
  };

  const customers = await db.customer.findMany({
    where: baseWhere,
    skip,
    take: perPage,
    orderBy: orderByMap[sort] ?? orderByMap.newest,
  });

  const listCustomers = await mapCustomerMetrics(customers);

  return {
    customers: listCustomers,
    pagination: {
      totalItems,
      totalPage,
      page: currentPage,
      per_page: perPage,
      hasNext,
    },
  };
};

export const getCustomersPageData = async (
  params: CustomerQueryParams,
): Promise<CustomersPageData> => {
  const [statisticsData, listData] = await Promise.all([
    getCustomerStatisticsData(),
    getCustomersListData(params),
  ]);

  return {
    stats: statisticsData.stats,
    topCustomers: statisticsData.topCustomers,
    customers: listData.customers,
    pagination: listData.pagination,
  };
};
