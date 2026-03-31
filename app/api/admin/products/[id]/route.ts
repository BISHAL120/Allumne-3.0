export const runtime = "nodejs";

import { storage } from "@/lib/firebase/firebase";
import { uploadImageFirebase } from "@/lib/firebase/upload";
import db from "@/lib/prisma";
import { deleteObject, ref } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuIdV4 } from "uuid";


export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const formData = await req.formData()
        const images = formData.getAll("imageUrl") as File[] | null
        const newThumbnail = formData.get("thumbnail") as File;
        const body = JSON.parse(formData.get("Details") as string)

        interface imageProps {
            imageUrl: string
            imageID: string
        }


        const existingImages = body.images // Initialize with existing URL
        let thumbnailURL = body.thumbnail

        if (body.deletedImages) {
            try {
                body.deletedImages.forEach(async (image: imageProps) => {
                    await deleteObject(ref(storage, image.imageUrl))
                })
            } catch (error) {
                console.log("Product Image deletion error:", error)
            }
        }

        // Check if new image is added and update image Object
        if (images && images.length > 0) {
            try {

                await Promise.all(images.map(async (image) => {

                    // Upload new images
                    const customID = uuIdV4()
                    const { url } = await uploadImageFirebase(image, "Products", customID + "_");
                    existingImages.push({
                        imageUrl: url,
                        imageID: customID,
                    })
                }))


            } catch (error) {
                console.log("Product Image processing error:", error)
                if (error instanceof Error) {
                    return NextResponse.json(
                        { message: `Image update failed: ${error.message}` },
                        { status: 500 }
                    );
                }
            }
        }



        // If new thumbnail image found delete the previous one and upload new one
        if (newThumbnail) {
            try {
                await deleteObject(ref(storage, thumbnailURL));
                const { url: newImage } = await uploadImageFirebase(newThumbnail, "Thumbnails", uuIdV4() + "_");
                thumbnailURL = newImage
            } catch (error) {
                console.log("Thumbnail Image deletion error:", error)
            }
        }


        const { id: _, deletedImages: __, ...rest } = body

        console.log(_, __)

        // Check if slug already exists
        const existingSlug = await db.product.findUnique({
            where: { slug: body.slug },
            select: {
                id: true,
                slug: true,
            }
        });

        if (existingSlug && existingSlug.id !== id) {
            return NextResponse.json(
                { message: "Already exists. Change the Product URL." },
                { status: 400 }
            );
        }


        const updateProduct = await db.product.update({
            where: { id },
            data: {
                ...rest,
                images: existingImages, // Use existing and new images
                thumbnail: thumbnailURL,
            },
        });

        return NextResponse.json(
            { data: updateProduct, message: "Product updated successfully" },
            { status: 200 }
        );


    } catch (error) {
        console.log("PRODUCT UPDATE PATCH ERROR:", error)
        return NextResponse.json("Internal Server Error", { status: 500 })
    }
}