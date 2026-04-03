"use server";

import db from "@/lib/prisma";
import { getServerSession } from "../get-session";
import { Prisma } from "@prisma/client";

export type ActivityAction = 
  | "ORDER_CREATED"
  | "ORDER_UPDATED"
  | "ORDER_STATUS_CHANGED"
  | "PRODUCT_CREATED"
  | "PRODUCT_UPDATED"
  | "PRODUCT_DELETED"
  | "STOCK_RESTOCKED"
  | "STOCK_UPDATED"
  | "CATEGORY_CREATED"
  | "CATEGORY_UPDATED"
  | "CATEGORY_DELETED"
  | "CUSTOMER_UPDATED"
  | "SYSTEM_ALERT";

export interface LogActivityParams {
  action: ActivityAction;
  description: string;
  entityId?: string;
  entityType?: "ORDER" | "PRODUCT" | "CATEGORY" | "USER" | "SYSTEM" | "CUSTOMER";
  userId?: string; // Optional: If not provided, it will try to get from session
}

/**
 * Utility function to compare old and new objects and generate a human-readable 
 * string of what fields changed.
 * @param entityName The name of the entity being updated (e.g. "Customer", "Product")
 * @param oldData The original object data
 * @param newData The new object data
 * @param fieldsToWatch An array of keys to compare, or a record mapping keys to human-readable labels
 * @returns A formatted string describing the changes, or null if no changes were found
 */
export async function generateChangeMessage(
  entityName: string,
  oldData: Record<string, any>,
  newData: Record<string, any>,
  fieldsToWatch: Record<string, string> | string[]
): Promise<string | null> {
  const changes: string[] = [];

  const fields = Array.isArray(fieldsToWatch)
    ? fieldsToWatch.reduce((acc, key) => ({ ...acc, [key]: key }), {} as Record<string, string>)
    : fieldsToWatch;

  for (const [key, label] of Object.entries(fields)) {
    const oldVal = oldData[key];
    const newVal = newData[key];

    // Skip if unchanged or if new value is explicitly undefined (not part of update)
    if (oldVal === newVal || newVal === undefined) continue;

    // Use a switch case to format the message cleanly depending on the field
    switch (key) {
      case "price":
      case "totalPrice":
      case "subTotal":
        changes.push(`${label} from ৳${oldVal || 0} to ৳${newVal || 0}`);
        break;
      case "status":
      case "isFeatured":
      case "isActive":
        changes.push(`${label} changed to '${newVal}'`);
        break;
      case "paymentScreenshot":
      case "imageUrl":
      case "thumbnail":
        changes.push(`${label} was updated`);
        break;
      case "desc":
      case "shortDescription":
      case "fullDescription":
      case "customRequirements":
        changes.push(`${label} was modified`);
        break;
      default:
        // Generic text/number field changes
        changes.push(`${label} from '${oldVal || "empty"}' to '${newVal || "empty"}'`);
    }
  }

  if (changes.length === 0) return null;
  return `User updated ${entityName}: ` + changes.join(", ");
}

/**
 * Logs an activity to the database.
 * If userId is not provided, it attempts to extract it from the current server session.
 */
export async function logActivity(params: LogActivityParams) {
  try {
    let currentUserId = params.userId;

    if (!currentUserId) {
      const session = await getServerSession();
      if (session?.user?.id) {
        currentUserId = session.user.id;
      }
    }

    if (!currentUserId) {
      console.warn("Attempted to log activity without a user context:", params.description, "falling back to system user.");
      currentUserId = "system";
    }

    const log = await db.activityLog.create({
      data: {
        action: params.action,
        description: params.description,
        entityId: params.entityId || null,
        entityType: params.entityType || null,
        userId: currentUserId,
      },
    });

    return { success: true, log };
  } catch (error) {
    console.error("Failed to log activity:", error);
    // We don't want activity logging failures to crash the main processes
    return { success: false, error: "Failed to create activity log" };
  }
}

/**
 * Helper to log activity within an existing Prisma transaction.
 * Requires the transaction client (tx) to be passed in.
 */
export async function logActivityTx(
  tx: Prisma.TransactionClient, 
  params: LogActivityParams
) {
  try {
    let currentUserId = params.userId;

    if (!currentUserId) {
      const session = await getServerSession();
      if (session?.user?.id) {
        currentUserId = session.user.id;
      }
    }

    if (!currentUserId) {
      console.warn("Attempted to log activity without a user context:", params.description, "falling back to system user.");
      currentUserId = "system";
    }

    await tx.activityLog.create({
      data: {
        action: params.action,
        description: params.description,
        entityId: params.entityId || null,
        entityType: params.entityType || null,
        userId: currentUserId,
      },
    });
  } catch (error) {
    console.error("Failed to log activity in transaction:", error);
    // Throwing here will abort the transaction, which might be desired if logging is critical
    // but usually we don't want a failed log to rollback a successful order.
    // However, since it's a Prisma transaction, failing a query usually invalidates the tx.
  }
}
