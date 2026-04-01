export const runtime = "nodejs";

import { ImageObj } from "@prisma/client";
import { deleteFirebaseImage } from "@/lib/firebase/deleteImage";
import { uploadImageFirebase } from "@/lib/firebase/upload";
import { getServerSession } from "@/lib/get-session";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuIdV4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("imageUrl") as File[];
    const thumbnail = formData.get("thumbnail") as File;
    const {
      productName,
      shortDescription,
      categoryId,
      fullDescription,
      isFeatured,
      variants,
      slug,
      type,
      status,
      metaTitle,
      metaDescription,

    } = JSON.parse(formData.get("Details") as string);

    if (!files) {
      return NextResponse.json(
        { message: "Images are missing" },
        { status: 400 }
      );
    }

    if (!productName) {
      return NextResponse.json(
        { message: "productName is missing" },
        { status: 400 }
      );
    }

    if (!fullDescription) {
      return NextResponse.json(
        { message: "fullDescription is missing" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { message: "category is missing" },
        { status: 400 }
      );
    }

    if (!variants || variants.length === 0) {
      return NextResponse.json(
        { message: "variants is missing" },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { message: "slug is missing" },
        { status: 400 }
      );
    }


    let uniqueSlug = slug;
    let counter = 1;

    while (true) {
      const existingSlug = await db.product.findUnique({
        where: { slug: uniqueSlug },
        select: {
          id: true,
          slug: true,
        }
      });

      if (!existingSlug) {
        break;
      }

      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    const newSlug = uniqueSlug;

    const session = await getServerSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized Request" },
        { status: 400 }
      );
    }

    const images: ImageObj[] = [];
    await Promise.all(
      files.map(async (file) => {
        const customID = uuIdV4();
        const { url } = await uploadImageFirebase(
          file,
          "Products",
          customID + "_"
        );
        images.push({
          imageUrl: url,
          imageID: customID,
        });
      })
    );

    let thumbnailUrl = "";
    if (thumbnail) {
      const thumbnailCustomID = uuIdV4();
      ({ url: thumbnailUrl } = await uploadImageFirebase(
        thumbnail,
        "Thumbnails",
        thumbnailCustomID + "_"
      ));
    }

    const productCount = await db.product.count()

    const product = await db.product.create({
      data: {
        userId,
        productName,
        shortDescription,
        categoryId,
        slug: newSlug,
        sortingNumber: productCount + 1,
        fullDescription,
        images: images,
        type: type ? type : "ORIGINAL",
        status: status ? status : "PENDING",
        isFeatured: isFeatured ? isFeatured : false,
        variants,
        metaTitle,
        metaDescription,
        thumbnail: thumbnailUrl,
      },
    });

    return NextResponse.json(
      { message: "Product Created successful", data: product },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating product", error },
      { status: 500 }
    );
  }
}


export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, data } = body;

    await db.product.update({
      where: { id },
      data,
    });

    // Return success response
    return NextResponse.json(
      { message: "Product Updated successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating product:", error);
    return NextResponse.json(
      { message: "Error updating product", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get the product details first
    const product = await db.product.findUnique({
      where: { id },
      select: { images: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete image from Firebase if exists
    if (product.images) {
      await Promise.all(
        product.images.map(async (image) => {
          await deleteFirebaseImage(image.imageUrl);
        })
      );
    }

    // Delete the product from database
    await db.product.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting product:", error);
    return NextResponse.json(
      { message: "Error deleting product", error },
      { status: 500 }
    );
  }
}
