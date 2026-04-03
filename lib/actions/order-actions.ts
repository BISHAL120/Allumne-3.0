"use server";

import { CartItemFormValues, CustomerFormValues, OrderStatusFormValues } from "@/components/admin/orders/edit/schema";
import db from "@/lib/prisma";
import { logActivityTx, logActivity, generateChangeMessage } from "./activity-log";
import { getUserId } from "../get-session";

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
          totalPrice: orderData.summary.total,
          customerId: customerId,
          userId: orderData.userId,
          status: "PENDING",
          customRequirements: orderData.customer.notes || null,
        },
      });

      // 4. Create CartItems and Update Stock
      for (const item of orderData.items) {
        // Fetch the product with its current variants.
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
            const currentStock = variant.stock || 0;

            if (currentStock < item.quantity) {
              throw new Error(`Insufficient stock for product "${item.name}" (Size: ${item.size}). Available: ${currentStock}, Requested: ${item.quantity}`);
            }

            const newStock = currentStock - item.quantity;
            return {
              ...variant,
              stock: newStock,
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
            price: item.price,
            subTotal: item.total,
            quantity: item.quantity,
            userId: orderData.userId,
            orderId: order.id,
            productId: item.productId,
          },
        });
      }

      await logActivityTx(tx, {
        action: "ORDER_CREATED",
        description: `Order ${nextOrderNumber} created by user`,
        entityId: order.id,
        entityType: "ORDER",
        userId: orderData.userId,
      });

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
  changedItems: (CartItemFormValues & { changedQuantity: number })[];
}) => {

  const normalizedTotalPrice = Number(totalPrice);

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
        orderNumber: true,
        totalPrice: true
      }
    });

    for (const item of changedItems) {
      console.log(`item ID: ${item.id} item: ${item}`)

      // Fetch the old cart item to compare quantities
      const oldCartItem = await tx.cartItem.findUnique({
        where: { id: item.id },
        select: { quantity: true, title: true, size: true }
      });


      await tx.cartItem.update({
        where: {
          id: item.id,
        },
        data: {
          price: Number(item.price),
          quantity: item.quantity,
          subTotal: Number(item.price) * item.quantity,
        }
      });

      if (oldCartItem && oldCartItem.quantity !== item.quantity) {
        await logActivityTx(tx, {
          action: "ORDER_UPDATED",
          description: `User updated order "${updatedOrder.orderNumber}" product quantity from ${oldCartItem.quantity} to ${item.quantity} for ${item.size} size of ${item.title}`,
          entityId: orderId,
          entityType: "ORDER",
          userId: await getUserId(),
        });
      } else {
        await logActivityTx(tx, {
          action: "ORDER_UPDATED",
          description: `Order "${updatedOrder.orderNumber}" cart item ${item.title} updated`,
          entityId: orderId,
          entityType: "ORDER",
          userId: await getUserId(),
        });
      }

      // increase or Decrease the stock of the variant and also increase or decrease the total stock and total sold

      // 1. get the product
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: {
          productName: true,
          variants: true,
          totalStock: true,
          totalSold: true,
        }
      });

      if (!product || !product.variants) {
        throw new Error(`Product or variant with ID ${item.productId} not found.`);
      }

      // 2. check if the requested variant stock available
      const variant = product.variants.find((v) => v.size === item.size);
      if(variant?.stock && variant?.stock < item.changedQuantity) {
        throw new Error(`Insufficient stock for product "${product.productName}" (Size: ${item.size}). Available: ${variant?.stock || 0}, Requested: ${item.changedQuantity}`);
      }


      // 3. update the variant stock
      const updatedVariants = product.variants.map((variant) => {
        if (variant.size === item.size && variant?.stock) {
          return {
            ...variant,
            stock: variant?.stock - item.changedQuantity,
          };
        }
        return variant;
      });

      // 4. update the product stock and total sold
      const newTotalStock = Math.max(0, product.totalStock - item.changedQuantity);
      const newTotalSold = product.totalSold + item.changedQuantity;

      // 5. update the product
      await tx.product.update({
        where: { id: item.productId },
        data: {
          variants: updatedVariants,
          totalStock: newTotalStock,
          totalSold: newTotalSold,
        },
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
  const oldCustomer = await db.customer.findUnique({
    where: { id: customerId }
  });

  const updatedCustomer = await db.customer.update({
    where: {
      id: customerId,
    },
    data: {
      ...customer,
    },
  });

  if (oldCustomer) {
    const message = await generateChangeMessage("Customer Information", oldCustomer, updatedCustomer, {
      fullName: "Name",
      email: "Email",
      phone: "Phone",
      fullAddress: "Address",
      paymentScreenshot: "Payment Screenshot"
    });

    if (message) {
      await logActivity({
        action: "CUSTOMER_UPDATED",
        description: message,
        entityId: customerId,
        entityType: "CUSTOMER",
        userId: await getUserId(),
      });
    }
  }
}

export const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatusFormValues;
}) => {
  const updatedOrder = await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      ...status,
    },
  });

  await logActivity({
    action: "ORDER_STATUS_CHANGED",
    description: `Order ${updatedOrder.orderNumber} marked as ${status.status}`,
    entityId: orderId,
    entityType: "ORDER",
    userId: await getUserId(),
  });
}