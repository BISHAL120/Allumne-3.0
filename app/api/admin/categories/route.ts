import { categoryFormSchema } from "@/components/admin/category/id/category-schema";
import { uploadImageFirebase } from "@/lib/firebase/upload";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {

        const formData = await req.formData();
        const categoryImage = formData.get("categoryImage") as File;
        const details = JSON.parse(formData.get("details") as string);

        // Upload category image if provided
        const { url } = await uploadImageFirebase(categoryImage, "Categories");

        const validatedData = categoryFormSchema.parse({
            name: details.name,
            desc: details.desc,
            slug: details.slug,
            isFeatured: true || false,
            metaTitle: details.metaTitle,
            metaDescription: details.metaDescription,
        });

        if (!validatedData) {
            return NextResponse.json(
                { message: "Invalid data" },
                { status: 400 }
            );
        }

        if (!categoryImage) {
            return NextResponse.json(
                { message: "Category image is required" },
                { status: 400 }
            );
        }

        const result = await db.category.create({
            data: {
                name: validatedData.name,
                imageUrl: url,
                desc: validatedData.desc,
                slug: validatedData.slug,
                isFeatured: validatedData.isFeatured,
                metaTitle: validatedData.metaTitle,
                metaDescription: validatedData.metaDescription,
            },
        });

        return NextResponse.json(
            { message: "Category created successfully", data: result },
            { status: 201 }
        );

    } catch (error) {
        console.log("[CATEGORY_POST]", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
