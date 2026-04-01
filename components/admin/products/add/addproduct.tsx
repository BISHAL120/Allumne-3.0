"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import PageTittle from "@/components/admin/shared/pageTittle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/lib/toast";
import { Category, ImageObj, Product } from "@prisma/client";
import axios from "axios";
import { Check, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { formSchema } from "./schema";

export function AddProduct({
  initialData,
  categories,
}: {
  initialData?: Product;
  categories?: Category[];
}) {
  const path = usePathname();

  const [productImages, setProductImages] = useState<File[] | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [thumbnailURL, setThumbnailURL] = useState<string>(
    initialData?.thumbnail || "",
  );
  const [initialImages, setInitialImages] = useState<ImageObj[]>(
    initialData?.images || [],
  );
  const [deletedImages, setDeletedImages] = useState<ImageObj[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const loadingText = initialData
    ? "Updating Product..."
    : "Creating Product...";
  const submitButtonText = initialData ? "Update Product" : "Create Product";
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          productName: initialData.productName,
          shortDescription: initialData.shortDescription || "",
          fullDescription: initialData.fullDescription,
          slug: initialData.slug || "",
          variants: initialData.variants.map((variant) => ({
            size: variant.size,
            price: variant.price,
            stock: variant?.stock || "",
            discountType: variant.discountType || "NONE",
            discountPrice: variant.discountPrice || "",
          })),
          isFeatured: initialData.isFeatured ? initialData.isFeatured : false,
          status: initialData.status || "PENDING",
          type: initialData.type || "PHYSICAL",
          metaTitle: initialData.metaTitle || "",
          metaDescription: initialData.metaDescription || "",
          categoryId: initialData.categoryId || "",
          totalStock: initialData.variants
            .reduce((acc, variant) => acc + (Number(variant.stock) || 0), 0)
            .toString(),
          restockAlert: initialData.restockAlert
            ? initialData.restockAlert
            : false,
          restockAlertThreshold: initialData.restockAlertThreshold?.toString() || "",
        }
      : {
          productName: "",
          shortDescription: "",
          fullDescription: "",
          slug: "",
          variants: [
            {
              size: "",
              price: "",
              stock: "",
              discountType: "NONE",
              discountPrice: "",
            },
          ],
          totalStock: "0",
          restockAlert: false,
          restockAlertThreshold: "0",
          isFeatured: false,
          status: "PENDING",
          type: "PHYSICAL",
          categoryId: "",
        },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((value, { name }) => {
      if (name === "productName") {
        const { isDirty } = form.getFieldState("metaTitle");
        if (!isDirty) {
          form.setValue("metaTitle", (value.productName as string) || "");
        }
      }

      if (name === "productName") {
        const { isDirty } = form.getFieldState("slug");
        if (!isDirty) {
          form.setValue(
            "slug",
            (value.productName as string).toLowerCase().replace(/\s+/g, "-") ||
              "",
          );
        }
      }

      if (name === "fullDescription") {
        const { isDirty } = form.getFieldState("metaDescription");
        if (!isDirty) {
          form.setValue(
            "metaDescription",
            (value.fullDescription as string) || "",
          );
        }
      }

      if (name?.startsWith("variants")) {
        const variants = value.variants || [];
        const total = variants.reduce((acc, variant) => {
          return acc + (Number(variant?.stock) || 0);
        }, 0);
        form.setValue("totalStock", total.toString());
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!thumbnailURL && !thumbnailImage) {
      showError({
        message: "Please upload Thumbnail Image.",
        duration: 5000,
      });
      return;
    }

    // if (!initialImages.length && !productImages?.length) {
    //   showError({
    //     message: "Please upload at least one image.",
    //     duration: 5000,
    //   });
    //   return;
    // }

    toast.loading(loadingText);
    setIsLoading(true);

    const formdata = new FormData();
    productImages?.forEach((image) => {
      formdata.append("imageUrl", image);
    });
    formdata.append("thumbnail", thumbnailImage || "");

    if (initialData) {
      formdata.append(
        "Details",
        JSON.stringify({
          deletedImages: deletedImages,
          slug: values.slug || initialData.slug,
          productName: values.productName || initialData.productName,
          fullDescription:
            values.fullDescription || initialData.fullDescription,
          shortDescription:
            values.shortDescription || initialData.shortDescription,
          thumbnail: values.thumbnail || initialData.thumbnail,
          categoryId: values.categoryId || initialData.categoryId,
          status: values.status || initialData.status,
          type: values.type || initialData.type,
          variants: values.variants || initialData.variants,
          totalStock: Number(values.totalStock),
          isFeatured: values.isFeatured || initialData.isFeatured,
          metaTitle: values.metaTitle || initialData.metaTitle,
          metaDescription:
            values.metaDescription || initialData.metaDescription,
          restockAlert: values.restockAlert,
          restockAlertThreshold: Number(values.restockAlertThreshold),
          images: initialImages || initialData.images,
        }),
      );
    } else {
      formdata.append("Details", JSON.stringify(values));
    }

    if (initialData) {
      axios
        .patch(`/api/admin/products/${initialData.id}`, formdata)
        .then((response) => {
          // Handle success, e.g., show a success message or redirect
          toast.dismiss();
          setIsLoading(false);
          showSuccess({
            message: response.data.message,
            duration: 5000,
          });
          router.push(
            `${
              path.includes("dashboard")
                ? "/manager/products"
                : "/admin/products"
            }`,
          ); // Redirect to the products list page after
        })
        .catch((error) => {
          console.log("Error creating product:", error);
          // Handle error, e.g., show an error message
          toast.dismiss();
          setIsLoading(false);
          showError({
            message: error.response.data.message,
            duration: 5000,
          });
        });
    } else {
      console.log("Form Data from Admin:", formdata);
      axios
        .post("/api/admin/products", formdata)
        .then((response) => {
          toast.dismiss();
          setIsLoading(false);
          showSuccess({
            message: response.data.message,
            duration: 5000,
          });
          router.push(
            `${
              path.includes("dashboard")
                ? "/manager/products"
                : "/admin/products"
            }`,
          ); // Redirect to the products list page after
        })
        .catch((error) => {
          console.log(error);
          toast.dismiss();
          setIsLoading(false);
          showError({
            message: error.response.data.message,
            duration: 5000,
          });
        });
    }
  }

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files).filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isUnder2MB = file.size <= 2 * 1024 * 1024; // 2MB in bytes
      if (!isImage) {
        showError({
          message: `${file.name} is not an image file.`,
          duration: 5000,
        });
      }
      if (!isUnder2MB) {
        showError({
          message: `${file.name} exceeds 2MB size limit.`,
          duration: 5000,
        });
      }
      return isImage && isUnder2MB;
    });

    setProductImages((prev) => [...(prev || []), ...fileArray]);
  };

  const handleThumbnail = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isUnder2MB = file.size <= 2 * 1024 * 1024; // 2MB in bytes
    if (!isImage) {
      showError({
        message: `${file.name} is not an image file.`,
        duration: 5000,
      });
    }
    if (!isUnder2MB) {
      showError({
        message: `${file.name} exceeds 2MB size limit.`,
        duration: 5000,
      });
    }
    if (isImage && isUnder2MB) {
      setThumbnailImage(file);
    }
  };

  const handleImageDelete = (idx: string) => {
    const removedImage = initialImages?.filter(
      (image) => image.imageID !== idx,
    );
    setInitialImages(removedImage);
    const findImageObj = initialImages.find((image) => image.imageID === idx);
    if (findImageObj) {
      setDeletedImages((prev) => [...prev, findImageObj]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (idx: number) => {
    const newImages = productImages?.filter((_, i) => i !== idx) || [];
    setProductImages(newImages);
  };

  const clearAll = () => {
    productImages?.forEach((img) =>
      URL.revokeObjectURL(URL.createObjectURL(img)),
    );
    setProductImages(null);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start">
          <PageTittle
            title="Add Product"
            description="Add a new product to the catalog"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="Product-form"
              disabled={isLoading}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {submitButtonText}
            </Button>
          </div>
        </div>
        <form id="Product-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="w-full flex justify-center items-strat gap-3">
              {/* Product Details */}
              <Card className="w-full">
                <CardContent className="space-y-4">
                  <Controller
                    name="productName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="product-name">
                          Product Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id="product-name"
                          disabled={isLoading}
                          placeholder="Enter Product Name"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="shortDescription"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="short-description">
                          Short Description
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            id="short-description"
                            disabled={isLoading}
                            placeholder="Product Short Description"
                            rows={6}
                            className="min-h-16 resize-none"
                            aria-invalid={fieldState.invalid}
                          />
                        </InputGroup>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="slug"
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel className="font-semibold">
                          Product URL (slug)
                        </FieldLabel>

                        <Input
                          disabled={isLoading}
                          placeholder="product-url"
                          className=""
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="fullDescription"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="full-description">
                          Full Description
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            id="full-description"
                            disabled={isLoading}
                            placeholder="Product Full Description"
                            rows={6}
                            className="min-h-24 resize-none"
                            aria-invalid={fieldState.invalid}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              {field.value.length}/1000 characters
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Thumbnail Images Section */}

              <Card className="w-full">
                <CardHeader>
                  <FieldLabel htmlFor="thumbnail-images">
                    Thumbnail Images
                  </FieldLabel>
                  <CardDescription>
                    Upload thumbnail images here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleThumbnail(file);
                    }}
                  />

                  {thumbnailURL ? (
                    <div className="">
                      <div className="relative group">
                        <Image
                          width={200}
                          height={200}
                          src={thumbnailURL}
                          alt="Thumbnail Image"
                          className="w-87.5 h-87.5 rounded-lg object-contain border mx-auto"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setThumbnailURL("");
                          }}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-opacity"
                          aria-label="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {thumbnailImage ? (
                        <div className="">
                          <div className="relative group">
                            <Image
                              width={200}
                              height={200}
                              src={URL.createObjectURL(thumbnailImage)}
                              alt="Thumbnail Image"
                              className="w-87.5 h-87.5 rounded-lg object-contain border mx-auto"
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setThumbnailImage(null);
                              }}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-opacity"
                              aria-label="Remove image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onDrop={(e) =>
                            handleThumbnail(e.dataTransfer.files[0])
                          }
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onClick={() => thumbnailInputRef.current?.click()}
                          className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                            isDragging
                              ? "border-violet-500 bg-violet-50 scale-[1.02]"
                              : "border-slate-300 hover:border-violet-400 hover:bg-slate-800"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-4">
                            <div
                              className={`p-4 rounded-full transition-all duration-300 ${
                                isDragging ? " scale-110" : "hover:bg-slate-800"
                              }`}
                            >
                              <Upload
                                className={`w-8 h-8 ${
                                  isDragging
                                    ? "text-violet-600"
                                    : "text-slate-400"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-slate-200 mb-1">
                                {isDragging
                                  ? "Drop images here"
                                  : "Click to upload or drag and drop"}
                              </p>
                              <p className="text-sm text-slate-400">
                                PNG, JPG, GIF up to 2MB each
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardDescription className="w-full text-center text-slate-500">
                  This image will be used in the product listing and product
                  card.
                </CardDescription>
              </Card>
            </div>

            {/* Art Images Section */}
            <Card className="col-span-2">
              <CardContent>
                <div className="p-6">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                  />

                  {/* Upload area */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                      isDragging
                        ? "border-violet-500 hover:bg-slate-600 scale-[1.02]"
                        : "border-slate-300 hover:border-violet-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className={`p-4 rounded-full transition-all duration-300 ${
                          isDragging
                            ? "bg-violet-100 scale-110"
                            : "hover:bg-slate-800"
                        }`}
                      >
                        <Upload
                          className={`w-8 h-8 ${
                            isDragging ? "text-violet-600" : "text-slate-400"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-200 mb-1">
                          {isDragging
                            ? "Drop images here"
                            : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-sm text-slate-400">
                          PNG, JPG, GIF up to 2MB each
                        </p>
                      </div>
                    </div>
                  </div>
                  {initialData ? (
                    <div>
                      {/* Initial Images Preview */}
                      {initialImages && initialImages.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Check className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-semibold text-slate-700">
                                {initialImages.length}{" "}
                                {initialImages.length === 1
                                  ? "image"
                                  : "images"}{" "}
                                uploaded
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setProductImages([]);
                                setInitialImages([]);
                                setDeletedImages((prev) => [
                                  ...prev,
                                  ...initialImages,
                                ]);
                              }}
                              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
                            >
                              Clear all
                            </button>
                          </div>

                          {/* Shopify-style layout */}
                          <div className={`grid grid-cols-6 gap-x-2 gap-y-4`}>
                            {/* Main image - large square on the left */}

                            {initialImages.map((image, idx) => (
                              <div
                                key={idx}
                                className={`${
                                  idx === 0
                                    ? "row-span-4 lg:row-span-2 col-span-4 lg:col-span-2 "
                                    : "col-span-2 lg:col-span-1 row-span-2 lg:row-span-1"
                                } aspect-square`}
                              >
                                <div className="relative group rounded-xl overflow-hidden bg-slate-100 shadow-md hover:shadow-xl transition-all duration-300 w-full h-full">
                                  <Image
                                    width={300}
                                    height={300}
                                    src={image.imageUrl}
                                    alt={image?.imageID}
                                    className={`w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-300`}
                                  />

                                  {/* Overlay */}
                                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                  {/* Remove button */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleImageDelete(image.imageID);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg"
                                    aria-label="Remove image"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>

                                  {/* Main label */}
                                  {idx === 0 ? (
                                    <div className="absolute bottom-2 left-2 border border-slate-800 bg-white/90 backdrop-blur-sm text-slate-800 text-xs px-2 py-1 rounded-md font-semibold">
                                      Main
                                    </div>
                                  ) : (
                                    <span className="absolute bottom-2 left-2 border border-slate-800 bg-white/90 backdrop-blur-sm text-slate-800 text-xs px-2 py-1 rounded-md font-semibold">
                                      {idx + 1}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                            {/* Additional images */}
                            {productImages && productImages.length > 0
                              ? productImages.map((image, idx) => (
                                  <div
                                    key={idx}
                                    className={`col-span-2 lg:col-span-1 row-span-2 lg:row-span-1 aspect-square`}
                                  >
                                    <div className="relative group rounded-xl overflow-hidden bg-slate-100 shadow-md hover:shadow-xl transition-all duration-300 w-full h-full">
                                      <Image
                                        width={300}
                                        height={300}
                                        src={URL.createObjectURL(image)}
                                        alt={image?.name}
                                        className={`w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-300`}
                                      />

                                      {/* Overlay */}
                                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                      {/* Remove button */}
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          removeImage(idx);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg"
                                        aria-label="Remove image"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>

                                      {/* new label */}

                                      <div className="absolute bottom-2 left-2 border border-black/70 bg-white/90 backdrop-blur-sm text-slate-800 text-xs px-2 py-1 rounded-md font-semibold">
                                        New
                                      </div>
                                    </div>
                                  </div>
                                ))
                              : null}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {/* Local Images */}
                      {productImages && productImages.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Check className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-semibold text-slate-700">
                                {productImages.length}{" "}
                                {productImages.length === 1
                                  ? "image"
                                  : "images"}{" "}
                                uploaded
                              </span>
                            </div>
                            <button
                              onClick={clearAll}
                              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
                            >
                              Clear all
                            </button>
                          </div>

                          {/* Shopify-style layout */}
                          <div className={`grid grid-cols-6 gap-x-2 gap-y-4`}>
                            {/* Main image - large square on the left */}

                            {productImages.map((image, idx) => (
                              <div
                                key={idx}
                                className={`${
                                  idx === 0
                                    ? "row-span-4 lg:row-span-2 col-span-4 lg:col-span-2 "
                                    : "col-span-2 lg:col-span-1 row-span-2 lg:row-span-1"
                                } aspect-square`}
                              >
                                <div className="relative group rounded-xl overflow-hidden bg-slate-100 shadow-md hover:shadow-xl transition-all duration-300 w-full h-full">
                                  <Image
                                    width={300}
                                    height={300}
                                    src={URL.createObjectURL(image)}
                                    alt={image?.name}
                                    className={`w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-300`}
                                  />

                                  {/* Overlay */}
                                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                  {/* Remove button */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      removeImage(idx);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg"
                                    aria-label="Remove image"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>

                                  {/* Main label */}
                                  {idx === 0 ? (
                                    <div className="absolute bottom-2 left-2 border border-slate-800 bg-white/90 backdrop-blur-sm text-slate-800 text-xs px-2 py-1 rounded-md font-semibold">
                                      Main
                                    </div>
                                  ) : (
                                    <span className="absolute bottom-2 left-2 border border-slate-800 bg-white/90 backdrop-blur-sm text-slate-800 text-xs px-2 py-1 rounded-md font-semibold">
                                      {idx + 1}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Empty state helper */}
                  {!initialData && productImages === null ? (
                    <div className="mt-6 text-center">
                      <p className="text-sm text-slate-400 italic">
                        No images uploaded yet. Start by clicking above or
                        dragging files.
                      </p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Category & Status</CardTitle>
                <CardDescription>
                  Manage product categorization and visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Category Selection */}
                  <Controller
                    name="categoryId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="categoryId">Category *</FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Status Selection */}
                  <div className=" gap-4">
                    <Controller
                      name="status"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="status">Status</FieldLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isLoading}
                          >
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PUBLISHED">
                                Published
                              </SelectItem>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="DELETED">Deleted</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <Controller
                    name="type"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="type">Type</FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PHYSICAL">Physical</SelectItem>
                            <SelectItem value="DIGITAL">Digital</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <Separator />

                {/* Switches Section */}
                <div className="space-y-6 pt-2">
                  {/* Featured Product */}
                  <Controller
                    name="isFeatured"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Switch
                              id="is-featured"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                            <Label
                              htmlFor="is-featured"
                              className="font-semibold cursor-pointer"
                            >
                              Featured Product
                            </Label>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground ml-14">
                          Featured Product will be displayed on the homepage.
                        </p>
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Variants Details */}
            <Card>
              <CardContent>
                <Controller
                  name="variants"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <CardHeader className="pl-0 pb-5">
                        <FieldLabel>
                          <CardTitle>Product Variants</CardTitle>
                        </FieldLabel>
                      </CardHeader>

                      <div className="space-y-4">
                        {field.value?.map((_, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-3 gap-4 items-center border rounded-lg p-4 hover:bg-accent transition-colors"
                          >
                            <Controller
                              name={`variants.${index}.size`}
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field>
                                  <FieldLabel>Size</FieldLabel>

                                  <Input
                                    {...field}
                                    disabled={isLoading}
                                    placeholder="Enter size"
                                  />

                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />

                            <Controller
                              name={`variants.${index}.price`}
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field>
                                  <FieldLabel>Price</FieldLabel>

                                  <Input
                                    {...field}
                                    disabled={isLoading}
                                    placeholder="Enter price"
                                  />

                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />

                            <Controller
                              name={`variants.${index}.stock`}
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field>
                                  <FieldLabel>Stock</FieldLabel>

                                  <Input
                                    {...field}
                                    disabled={isLoading}
                                    placeholder="Enter stock"
                                  />

                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />

                            <Controller
                              name={`variants.${index}.discountType`}
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field
                                  data-invalid={fieldState.invalid}
                                  className="w-full"
                                >
                                  <FieldLabel
                                    htmlFor={`variants.${index}.discountType`}
                                  >
                                    Discount Type
                                  </FieldLabel>

                                  <Select
                                    name={field.name}
                                    value={field.value}
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger
                                      id={`variants.${index}.discountType`}
                                      aria-invalid={fieldState.invalid}
                                      className="w-full"
                                    >
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                      <SelectItem value="NONE">None</SelectItem>
                                      <SelectItem value="FIXED">
                                        Fixed
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>

                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />

                            <Controller
                              name={`variants.${index}.discountPrice`}
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field>
                                  <FieldLabel>Discount Price</FieldLabel>

                                  <Input
                                    {...field}
                                    disabled={isLoading}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const price = Number(
                                        form.getValues(
                                          `variants.${index}.price`,
                                        ),
                                      );
                                      // allow empty or valid number not greater than price
                                      if (
                                        val === "" ||
                                        (Number(val) <= price &&
                                          !isNaN(Number(val)))
                                      ) {
                                        field.onChange(val);
                                      }
                                    }}
                                    placeholder="Enter discount price"
                                  />

                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />

                            <Button
                              type="button"
                              disabled={isLoading}
                              variant="destructive"
                              className="w-full mt-auto mb-1 flex items-center justify-center"
                              onClick={() => {
                                const newVariants =
                                  field.value?.filter((_, i) => i !== index) ||
                                  [];
                                field.onChange(newVariants);

                                form.setValue("variants", newVariants);
                              }}
                            >
                              <span>Remove</span>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          type="button"
                          disabled={isLoading}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            field.onChange([
                              ...(field.value || []),
                              {
                                size: "",
                                price: "",
                                stock: "",
                                discountType: "NONE",
                                discountPrice: "",
                              },
                            ]);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Variant
                        </Button>
                      </div>
                    </Field>
                  )}
                />
              </CardContent>
            </Card>

            {/* Total Stock Field */}
            <Card>
              <CardContent className="pt-6 space-y-6">
                <Controller
                  name="totalStock"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className="text-lg font-bold">
                        Total Stock
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        disabled={isLoading}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || !isNaN(Number(val))) {
                            field.onChange(val);
                          }
                        }}
                        placeholder="0"
                        className="bg-muted font-mono text-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Automatically calculated from all variant stocks
                      </p>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Separator />

                <div className="space-y-4">
                  <Controller
                    name="restockAlert"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base font-semibold">
                            Restock Alert
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when stock levels fall below a
                            threshold
                          </p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </div>
                    )}
                  />

                  {form.watch("restockAlert") && (
                    <Controller
                      name="restockAlertThreshold"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel className="font-semibold">
                            Alert Threshold
                          </FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            disabled={isLoading}
                            placeholder="10"
                            className="bg-muted font-mono"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Set the minimum stock level to trigger an alert
                          </p>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="">
                <CardTitle>SEO Optimization</CardTitle>
                <CardDescription>
                  Improve search engine visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <Controller
                  control={form.control}
                  name="metaTitle"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className="font-semibold">
                        Meta Title
                      </FieldLabel>

                      <Input
                        disabled={isLoading}
                        placeholder="SEO-friendly title"
                        className=""
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="metaDescription"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className="font-semibold">
                        Meta Description
                      </FieldLabel>

                      <Textarea
                        disabled={isLoading}
                        placeholder="Brief description for search results"
                        className=" min-h-25"
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </CardContent>
            </Card>
          </FieldGroup>
        </form>

        <Field orientation="horizontal" className="mt-10">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="Product-form" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {submitButtonText}
          </Button>
        </Field>
      </div>
    </div>
  );
}
