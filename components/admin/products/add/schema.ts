import z from "zod";

export const formSchema = z.object({
    productName: z
        .string()
        .min(5, "Product name must be at least 5 characters.")
        .max(32, "Product name must be at most 32 characters."),
    shortDescription: z.string().optional(),
    fullDescription: z
        .string()
        .min(20, "Description must be at least 20 characters.")
        .max(1000, "Description must be at most 1000 characters."),
    slug: z.string().min(1, "Product URL is required"),
    variants: z.array(
        z.object({
            size: z.string().optional(),
            price: z.number().optional(),
            stock: z.number().optional(),
            discountType: z.enum(["FIXED", "NONE"]).optional(),
            discountPrice: z.number().optional(),
        })
    ).optional(),
    totalStock: z.number().min(1, "Total stock must be 1 or more"),
    restockAlert: z.boolean(),
    restockAlertThreshold: z.string().optional(),
    isFeatured: z.boolean(),
    status: z.enum(["PUBLISHED", "PENDING", "DRAFT", "DELETED"]),
    type: z.enum(["PHYSICAL", "DIGITAL"]),
    categoryId: z.string().min(1, "Category is required"),
    images: z
        .array(
            z.object({
                imageUrl: z.string(),
                imageID: z.string(),
            })
        )
        .optional(),
    thumbnail: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
});