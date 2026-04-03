import db from "@/lib/prisma";
import { NextResponse } from "next/server";
import { categoryFormSchema } from "@/components/admin/category/id/category-schema";
import { deleteFirebaseImage } from "@/lib/firebase/deleteImage";
import { uploadImageFirebase } from "@/lib/firebase/upload";
import { logActivity, generateChangeMessage } from "@/lib/actions/activity-log";
import { getUserId } from "@/lib/get-session";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: categoryId } = await params;
    const formData = await req.formData();
    const categoryImage = formData.get("categoryImage") as File;
    const details = JSON.parse(formData.get("details") as string);

    let imageUrl = details.imageUrl;

    if (categoryImage) {

      // Delete Existing Image
      try {
        await deleteFirebaseImage(imageUrl);
      } catch (error) {
        console.log("Category Image deletion error:", error)
      }

      // Upload category image if provided
      const { url } = await uploadImageFirebase(categoryImage, "Categories");
      imageUrl = url;
    }

    const validatedData = categoryFormSchema.parse(details);

    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    const existingCategory = await db.category.findUnique({
      where: { id: categoryId }
    });

    const category = await db.category.update({
      where: {
        id: categoryId,
      },
      data: { ...validatedData, imageUrl },
    });

    if (existingCategory) {
      const message = await generateChangeMessage(`category '${category.name}'`, existingCategory, category, {
        name: "Name",
        desc: "Description",
        slug: "Slug",
        isFeatured: "Featured status",
        imageUrl: "Image",
      });

      if (message) {
        await logActivity({
          action: "CATEGORY_UPDATED",
          description: message,
          entityId: category.id,
          entityType: "CATEGORY",
          userId: await getUserId(),
        });
      }
    }

    return NextResponse.json(
      { message: "Category updated successfully", data: category },
      { status: 200 }
    );
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
