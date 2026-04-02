"use server";

import { CartItemFormValues, CustomerFormValues, OrderStatusFormValues } from "@/components/admin/orders/edit/schema";
import db from "@/lib/prisma";

export async function searchProducts(query: string, skip: number = 0, take: number = 10) {
  try {
    const products = await db.product.findMany({
      where: {
        OR: [
          { productName: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
        isDeleted: false,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

export async function findCustomerByPhone(phone: string) {
  try {
    const customer = await db.customer.findFirst({
      where: { phone },
    });
    return customer;
  } catch (error) {
    console.error("Error finding customer:", error);
    return null;
  }
}

export async function getAllProducts() {
  try {
    const products = await db.product.findMany({
      where: { isDeleted: false },
      take: 50,
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}


export interface OrderInput {
  userId: string;
  customer: {
    id: string;
    name: string;
    email: string | null | undefined;
    phone: string;
    address: string;
    notes: string | null | undefined;
  };
  items: Array<{
    productId: string;
    name: string;
    size: string | undefined;
    price: number;
    quantity: number;
    total: number;
  }>;
  summary: {
    subtotal: number;
    shipping: number;
    total: number;
  };
}

export type CreateOrderResponse =
  | { success: true; orderId: string; orderNumber: string }
  | { success: false; error: string };

export async function createOrder(
  orderData: OrderInput
): Promise<CreateOrderResponse> {
  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Find or Create Customer
      let customerId = orderData.customer.id;

      if (customerId === "NEW") {
        const existingCustomer = await tx.customer.findFirst({
          where: { phone: orderData.customer.phone },
        });

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const newCustomer = await tx.customer.create({
            data: {
              fullName: orderData.customer.name,
              phone: orderData.customer.phone,
              fullAddress: orderData.customer.address,
              email: orderData.customer.email || null,

            },
          });
          customerId = newCustomer.id;
        }
      }

      // 2. Get the next order number
      const orderCount = await tx.order.count();
      const nextOrderNumber = `ORD-${String(orderCount + 1).padStart(6, "0")}`;

      // 3. Create the Order
      const order = await tx.order.create({
        data: {
          orderNumber: nextOrderNumber,
          totalPrice: orderData.summary.total.toString(),
          customerId: customerId,
          userId: orderData.userId,
          status: "PENDING",
          customRequirements: orderData.customer.notes || null,
        },
      });

      // 4. Create CartItems and Update Stock
      for (const item of orderData.items) {
        // Fetch the product with its current variants
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: {
            thumbnail: true,
            variants: true,
            totalStock: true,
            totalSold: true,
            status: true,
          },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }

        if (product.status !== "PUBLISHED") {
          throw new Error(
            `Product "${item.name}" is not available for ordering (Status: ${product.status}).`
          );
        }

        // Update the specific variant's stock
        let variantFound = false;
        const updatedVariants = product.variants.map((variant) => {
          if (variant.size === item.size) {
            variantFound = true;
            const currentStock = parseInt(variant.stock || "0");

            if (currentStock < item.quantity) {
              throw new Error(`Insufficient stock for product "${item.name}" (Size: ${item.size}). Available: ${currentStock}, Requested: ${item.quantity}`);
            }

            const newStock = currentStock - item.quantity;
            return {
              ...variant,
              stock: newStock.toString(),
            };
          }
          return variant;
        });

        if (!variantFound) {
          throw new Error(`Variant with size "${item.size}" not found for product "${item.name}".`);
        }

        // Update product's total stock and total sold
        const newTotalStock = Math.max(0, product.totalStock - item.quantity);
        const newTotalSold = product.totalSold + item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: {
            variants: updatedVariants,
            totalStock: newTotalStock,
            totalSold: newTotalSold,
          },
        });

        // Create the cart item record
        await tx.cartItem.create({
          data: {
            title: item.name,
            thumbnail: product.thumbnail || "",
            size: item.size || "N/A",
            price: item.price.toString(),
            subTotal: item.total.toString(),
            quantity: item.quantity,
            userId: orderData.userId,
            orderId: order.id,
            productId: item.productId,
          },
        });
      }

      return {
        success: true,
        orderId: order.id,
        orderNumber: nextOrderNumber,
      } as const;
    });

    return result as CreateOrderResponse;
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order. Please try again.",
    } as const;
  }
}


export const updateCartItems = async ({
  orderId,
  totalPrice,
  changedItems,
}: {
  orderId: string;
  totalPrice: string | number;
  changedItems: CartItemFormValues[];
}) => {

  const normalizedTotalPrice = Number(totalPrice).toFixed(2);

  const result = await db.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: {
        id: orderId
      },
      data: {
        totalPrice: normalizedTotalPrice
      },
      select: {
        id: true,
        totalPrice: true
      }
    });

    for (const item of changedItems) {
      console.log(`item ID: ${item.id} item: ${item}`)


      await tx.cartItem.update({
        where: {
          id: item.id,
        },
        data: {
          price: Number(item.price).toFixed(2),
          quantity: item.quantity,
          subTotal: (Number(item.price) * item.quantity).toFixed(2),
        }
      });

    }

    return {
      order: updatedOrder,
    };
  });

  console.log("Update Cart Items Result:", result);

  return result;
}


export const updateCustomerInformation = async ({
  customerId,
  customer,
}: {
  customerId: string;
  customer: CustomerFormValues;
}) => {
  await db.customer.update({
    where: {
      id: customerId,
    },
    data: {
      ...customer,
    },
  });
}

export const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatusFormValues;
}) => {
  await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      ...status,
    },
  });
}