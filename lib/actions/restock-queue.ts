"use server";

import db from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
import { logActivity } from "./activity-log";
import { getUserId } from "../get-session";

interface QueueItem {
  id: string;
  productId: string;
  variantSize: string | null;
  name: string;
  sku: string;
  currentStock: number;
  threshold: number;
  category: string;
  priority: string;
}

export async function getLowStockProducts() {
  try {
    const products = await db.product.findMany({
      where: {

        status: {
          in: [ProductStatus.PUBLISHED, ProductStatus.PENDING],
        },
        OR: [
          {
            variants: {
              some: {
                stock: {
                  lt: 11 // Check for variants with stock below than restockAlertThreshold
                },
              },
            }
          },
          {
            totalStock: {
              lt: 11 // Check for simple products with totalStock below than restockAlertThreshold
            },
          }
        ]
      },
      select: {
        id: true,
        productName: true,
        slug: true,
        totalStock: true,
        restockAlertThreshold: true,
        variants: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const lowStockQueue: QueueItem[] = [];

    products.forEach((product) => {
      const threshold = product.restockAlertThreshold || 10;

      // If the product has variants, we add the variants that have low stock
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          const variantStock = variant.stock || 0;
          // The database query already filtered for products that have at least one variant < 11 
          // or totalStock < 11. We only want to add the specific variants that are actually low.
          if (variantStock < 11) {
            lowStockQueue.push({
              id: `${product.id}-${variant.size}`, // Composite ID for variant
              productId: product.id,
              variantSize: variant.size,
              name: `${product.productName} (${variant.size})`,
              sku: product.slug,
              currentStock: variantStock,
              threshold: threshold,
              category: product.category.name,
              priority: variantStock <= 3 ? "High" : variantStock <= 7 ? "Medium" : "Low",
            });
          }
        });
      } else {
        // If no variants or just checking totalStock for simple products
        if (product.totalStock < 11) {
          lowStockQueue.push({
            id: product.id,
            productId: product.id,
            variantSize: null,
            name: product.productName,
            sku: product.slug,
            currentStock: product.totalStock,
            threshold: threshold,
            category: product.category.name,
            priority: product.totalStock <= 3 ? "High" : product.totalStock <= 7 ? "Medium" : "Low",
          });
        }
      }
    });

    // Sort by lowest stock first
    lowStockQueue.sort((a, b) => a.currentStock - b.currentStock);

    return { success: true, queue: lowStockQueue };
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return { success: false, error: "Failed to fetch low stock products" };
  }
}

export async function restockProduct(id: string, amount: number) {
  if (amount <= 0) {
    return { success: false, error: "Restock amount must be greater than 0" };
  }

  try {
    // Determine if we are restocking a variant or a whole product based on composite ID
    let productId = id;
    let variantSize = null;

    if (id.includes("-")) {
      const parts = id.split("-");
      productId = parts[0];
      variantSize = parts.slice(1).join("-");
    }

    const product = await db.product.findUnique({
      where: { id: productId },
      select: { totalStock: true, variants: true, productName: true },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    if (variantSize) {
      // Update specific variant
      let variantFound = false;
      const updatedVariants = product.variants.map((v) => {
        if (v.size === variantSize) {
          variantFound = true;
          return {
            ...v,
            stock: (v.stock || 0) + amount,
          };
        }
        return v;
      });

      if (!variantFound) {
        return { success: false, error: "Variant not found" };
      }

      // Recalculate total stock
      const newTotalStock = updatedVariants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);

      await db.product.update({
        where: { id: productId },
        data: {
          variants: updatedVariants,
          totalStock: newTotalStock,
        },
      });

      await logActivity({
        action: "STOCK_RESTOCKED",
        description: `Restocked ${amount} items for product '${product.productName}' (Variant: ${variantSize})`,
        entityId: productId,
        entityType: "PRODUCT",
        userId: await getUserId(),
      });

      return { success: true };
    } else {
       // Update overall product (fallback if no variants or updating simple product)
       const newStock = product.totalStock + amount;

       await db.product.update({
         where: { id: productId },
         data: {
           totalStock: newStock,
         },
       });

       await logActivity({
         action: "STOCK_RESTOCKED",
         description: `Restocked ${amount} items for product '${product.productName}'`,
         entityId: productId,
         entityType: "PRODUCT",
         userId: await getUserId(),
       });

       return { success: true };
    }
  } catch (error) {
    console.error("Error restocking product:", error);
    return { success: false, error: "Failed to restock product" };
  }
}
