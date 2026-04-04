export const runtime = "nodejs";

import db from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { isAdmin } from "../check-Access";

const getStartOfDay = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start;
};

const getMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

const buildMonthBuckets = (months: number) => {
  const buckets: { key: string; label: string; year: number; month: number }[] = [];
  const now = new Date();

  for (let offset = months - 1; offset >= 0; offset--) {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    buckets.push({
      key: getMonthKey(d),
      label: d.toLocaleString("default", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }

  return buckets;
};

export const getMetricsOverviewData = async () => {
  await isAdmin();
  const startOfDay = getStartOfDay();
  const yesterday = new Date(startOfDay);
  yesterday.setDate(yesterday.getDate() - 1);

  const [
    totalOrdersToday,
    totalOrdersYesterday,
    pendingOrders,
    completedOrders,
    lowStockProducts,
    revenueTodayAggr,
    revenueYesterdayAggr,
  ] = await Promise.all([
    db.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
        }
      }
    }),
    db.order.count({
      where: {
        createdAt: {
          gte: yesterday,
          lt: startOfDay,
        }
      }
    }),
    db.order.count({
      where: {
        status: OrderStatus.PENDING
      }
    }),
    db.order.count({
      where: {
        status: OrderStatus.DELIVERED
      }
    }),
    db.product.count({
      where: {
        totalStock: {
          lte: 10
        },
        isDeleted: false
      }
    }),
    db.order.aggregate({
      where: {
        createdAt: {
          gte: startOfDay
        },
        status: {
          not: OrderStatus.CANCELLED
        }
      },
      _sum: {
        totalPrice: true
      }
    }),
    db.order.aggregate({
      where: {
        createdAt: {
          gte: yesterday,
          lt: startOfDay
        },
        status: {
          not: OrderStatus.CANCELLED
        }
      },
      _sum: {
        totalPrice: true
      }
    }),
  ]);

  const revenueToday = revenueTodayAggr._sum.totalPrice || 0;
  const revenueYesterday = revenueYesterdayAggr._sum.totalPrice || 0;
  const completionRate = pendingOrders + completedOrders === 0
    ? 0
    : Math.round((completedOrders / (pendingOrders + completedOrders)) * 100);

  return {
    totalOrdersToday,
    totalOrdersYesterday,
    pendingOrders,
    completedOrders,
    completionRate,
    lowStockProducts,
    revenueToday,
    revenueYesterday,
  };
};

export const getSalesChartData = async (months = 6) => {
  await isAdmin();
  const buckets = buildMonthBuckets(months);
  const firstBucket = buckets[0];
  const startDate = new Date(firstBucket.year, firstBucket.month, 1);

  const orders = await db.order.findMany({
    where: {
      createdAt: {
        gte: startDate
      },
      status: {
        not: OrderStatus.CANCELLED
      }
    },
    select: {
      totalPrice: true,
      createdAt: true
    }
  });

  const salesByMonth: Record<string, number> = Object.fromEntries(
    buckets.map((bucket) => [bucket.key, 0])
  );

  for (const order of orders) {
    const key = getMonthKey(order.createdAt);
    if (salesByMonth[key] !== undefined) {
      salesByMonth[key] += order.totalPrice;
    }
  }

  return buckets.map((bucket, index) => {
    const sales = salesByMonth[bucket.key] || 0;
    const previousBucket = buckets[index - 1];
    const previousSales = previousBucket ? (salesByMonth[previousBucket.key] || 0) : sales;

    return {
      month: bucket.label,
      sales,
      target: previousSales,
    };
  });
};

export const getRevenueBreakdownData = async () => {
  await isAdmin();

  const cartItems = await db.cartItem.findMany({
    where: {
      order: {
        status: {
          not: OrderStatus.CANCELLED
        }
      }
    },
    include: {
      product: {
        include: {
          category: true
        }
      }
    }
  });

  const categoryRevenue: Record<string, number> = {};

  for (const item of cartItems) {
    const catName = item.product?.category?.name || "Uncategorized";
    categoryRevenue[catName] = (categoryRevenue[catName] || 0) + item.subTotal;
  }

  return Object.entries(categoryRevenue)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);
};

export const getTopProductsData = async () => {
  await isAdmin();

  const products = await db.product.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      totalStock: 'asc'
    },
    take: 5,
    include: {
      category: true
    }
  });

  return products.map((p) => ({
    id: p.id,
    name: p.productName,
    stock: p.totalStock,
    status: p.totalStock === 0 ? "Out of Stock" : p.totalStock <= 10 ? "Low Stock" : "OK",
    category: p.category?.name || "Uncategorized"
  }));
};

export const getCustomerInsightsData = async () => {
  await isAdmin();

  const months = 6;
  const buckets = buildMonthBuckets(months);
  const firstBucket = buckets[0];
  const startDate = new Date(firstBucket.year, firstBucket.month, 1);

  const [customers, orders, totalCustomers, avgOrderValueAgg] = await Promise.all([
    db.customer.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true,
      }
    }),
    db.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        status: {
          not: OrderStatus.CANCELLED
        }
      },
      select: {
        customerId: true,
        createdAt: true,
      }
    }),
    db.customer.count(),
    db.order.aggregate({
      where: {
        status: {
          not: OrderStatus.CANCELLED
        }
      },
      _avg: {
        totalPrice: true
      }
    }),
  ]);

  const newCustomersByMonth: Record<string, number> = Object.fromEntries(
    buckets.map((bucket) => [bucket.key, 0])
  );
  const activeCustomersByMonth: Record<string, Set<string>> = Object.fromEntries(
    buckets.map((bucket) => [bucket.key, new Set<string>()])
  );
  const orderCountByCustomerMonth: Record<string, Record<string, number>> = {};

  for (const customer of customers) {
    const key = getMonthKey(customer.createdAt);
    if (newCustomersByMonth[key] !== undefined) {
      newCustomersByMonth[key] += 1;
    }
  }

  for (const order of orders) {
    const monthKey = getMonthKey(order.createdAt);
    if (activeCustomersByMonth[monthKey]) {
      activeCustomersByMonth[monthKey].add(order.customerId);
    }

    if (!orderCountByCustomerMonth[monthKey]) {
      orderCountByCustomerMonth[monthKey] = {};
    }
    orderCountByCustomerMonth[monthKey][order.customerId] =
      (orderCountByCustomerMonth[monthKey][order.customerId] || 0) + 1;
  }

  const repeatCustomersByMonth: Record<string, number> = {};

  for (const bucket of buckets) {
    const customerCounts = orderCountByCustomerMonth[bucket.key] || {};
    repeatCustomersByMonth[bucket.key] = Object.values(customerCounts).filter((count) => count > 1).length;
  }

  const uniqueOrderingCustomers = new Set(orders.map((order) => order.customerId)).size;
  const repeatOrderingCustomers = Object.values(
    orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.customerId] = (acc[order.customerId] || 0) + 1;
      return acc;
    }, {})
  ).filter((count) => count > 1).length;

  const repeatRate = uniqueOrderingCustomers === 0
    ? 0
    : Number(((repeatOrderingCustomers / uniqueOrderingCustomers) * 100).toFixed(1));

  const trend = buckets.map((bucket) => ({
    month: bucket.label,
    newCustomers: newCustomersByMonth[bucket.key] || 0,
    repeatCustomers: repeatCustomersByMonth[bucket.key] || 0,
    activeCustomers: activeCustomersByMonth[bucket.key]?.size || 0,
  }));

  return {
    trend,
    summary: {
      totalCustomers,
      repeatRate,
      avgOrderValue: Math.round(avgOrderValueAgg._avg.totalPrice || 0),
    }
  };
};
