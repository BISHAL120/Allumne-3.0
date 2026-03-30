import * as z from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),
  desc: z.string().max(500, "Description must be at most 500 characters.").optional(),
  isFeatured: z.boolean({message: "Is Featured must be a boolean value."}),
  isDeleted: z.boolean({message: "Is Deleted must be a boolean value."}).optional(),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters.")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  metaTitle: z.string().max(70, "Meta Title must be at most 70 characters.").optional(),
  metaDescription: z.string().max(160, "Meta Description must be at most 160 characters.").optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
