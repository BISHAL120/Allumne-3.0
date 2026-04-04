"use server";

import { OrderStatus } from "@prisma/client";
import { getServerSession } from "@/lib/get-session";
import db from "@/lib/prisma";
import { generateProductsForSeed } from "./seed-products";

export interface DashboardSeedOptions {
  customerCount?: number;
  productCount?: number;
  historicOrderCount?: number;
  todayOrderCount?: number;
}

export interface DashboardSeedSummary {
  customersCreated: number;
  productsCreated: number;
  ordersCreated: number;
  todayOrdersCreated: number;
  revenueGenerated: number;
  statusBreakdown: Array<{ status: OrderStatus; count: number }>;
}

const DEFAULT_OPTIONS = {
  customerCount: 20,
  productCount: 6,
  historicOrderCount: 50,
  todayOrderCount: 5,
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const generateDashboardDummyData = async (
  options: DashboardSeedOptions = {},
): Promise<DashboardSeedSummary> => {
  const session = await getServerSession();
  const userId = session?.user?.id;
  const roles = session?.user?.role ?? [];
  const roleList = Array.isArray(roles) ? roles : [roles];

  if (!userId || !roleList.includes("ADMIN")) {
    throw new Error("Unauthorized");
  }

  const customerCount = clamp(
    options.customerCount ?? DEFAULT_OPTIONS.customerCount,
    1,
    100,
  );
  const productCount = clamp(
    options.productCount ?? DEFAULT_OPTIONS.productCount,
    1,
    50,
  );
  const historicOrderCount = clamp(
    options.historicOrderCount ?? DEFAULT_OPTIONS.historicOrderCount,
    1,
    300,
  );
  const todayOrderCount = clamp(
    options.todayOrderCount ?? DEFAULT_OPTIONS.todayOrderCount,
    1,
    100,
  );

  const category = await db.category.findFirst({
    select: { id: true },
  });

  if (!category) {
    throw new Error("No category found. Please create a category first.");
  }

  const runTag = Date.now().toString();
  const customers = [];

  for (let i = 1; i <= customerCount; i++) {
    const customer = await db.customer.create({
      data: {
        fullName: `Dashboard Customer ${runTag}-${i}`,
        phone: `8801700${runTag.slice(-4)}${i.toString().padStart(2, "0")}`,
        fullAddress: `${i} Seed Street, Dashboard City`,
        email: `dashboard-customer-${runTag}-${i}@example.com`,
      },
      select: { id: true },
    });
    customers.push(customer);
  }

  const seededProducts = await generateProductsForSeed({
    categoryId: category.id,
    userId,
    count: productCount,
  });

  const products = seededProducts.map((product) => ({
    id: product.id,
    productName: product.productName,
    thumbnail: product.thumbnail ?? "",
    price: Number(product.variants[0]?.price ?? 100),
  }));

  const statuses: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ];

  const statusCounter: Record<OrderStatus, number> = {
    [OrderStatus.PENDING]: 0,
    [OrderStatus.CONFIRMED]: 0,
    [OrderStatus.SHIPPED]: 0,
    [OrderStatus.DELIVERED]: 0,
    [OrderStatus.CANCELLED]: 0,
  };

  let revenueGenerated = 0;

  for (let i = 0; i < historicOrderCount; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 180));

    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const subTotal = product.price * quantity;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const order = await db.order.create({
      data: {
        totalPrice: subTotal,
        orderNumber: `ORD-SEED-${runTag}-${i}`,
        customerId: customer.id,
        userId,
        status,
        createdAt: date,
        updatedAt: date,
      },
      select: { id: true },
    });

    await db.cartItem.create({
      data: {
        title: product.productName,
        thumbnail: product.thumbnail,
        size: "Default",
        price: product.price,
        subTotal,
        quantity,
        userId,
        orderId: order.id,
        productId: product.id,
        createdAt: date,
        updatedAt: date,
      },
    });

    statusCounter[status] += 1;
    if (status !== OrderStatus.CANCELLED) {
      revenueGenerated += subTotal;
    }
  }

  for (let i = 0; i < todayOrderCount; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = 1;
    const subTotal = product.price * quantity;

    const order = await db.order.create({
      data: {
        totalPrice: subTotal,
        orderNumber: `ORD-SEED-TODAY-${runTag}-${i}`,
        customerId: customer.id,
        userId,
        status: OrderStatus.PENDING,
      },
      select: { id: true },
    });

    await db.cartItem.create({
      data: {
        title: product.productName,
        thumbnail: product.thumbnail,
        size: "Default",
        price: product.price,
        subTotal,
        quantity,
        userId,
        orderId: order.id,
        productId: product.id,
      },
    });

    statusCounter[OrderStatus.PENDING] += 1;
    revenueGenerated += subTotal;
  }

  return {
    customersCreated: customerCount,
    productsCreated: productCount,
    ordersCreated: historicOrderCount,
    todayOrdersCreated: todayOrderCount,
    revenueGenerated,
    statusBreakdown: statuses.map((status) => ({
      status,
      count: statusCounter[status],
    })),
  };
};
