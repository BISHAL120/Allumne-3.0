"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ImagePlus, Loader2, Save, Trash2, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { showError, showSuccess } from "@/lib/toast";
import { Category } from "@prisma/client";
import { categoryFormSchema, CategoryFormValues } from "./category-schema";

interface NewCategoryProps {
  initialData?: Category | null;
}

const NewCategory = ({ initialData }: NewCategoryProps) => {
  const router = useRouter();
  const path = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [initialImageUrl, setInitialImageUrl] = useState(
    initialData?.imageUrl || "",
  );
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          desc: initialData.desc || "",
          slug: initialData.slug,
          metaTitle: initialData.metaTitle || "",
          metaDescription: initialData.metaDescription || "",
          isFeatured: initialData.isFeatured || false,
          isDeleted: initialData.isDeleted ? initialData.isDeleted : false,
        }
      : {
          name: "",
          desc: "",
          slug: "",
          metaTitle: "",
          metaDescription: "",
          isFeatured: false,
          isDeleted: false,
        },
  });

  const loadingText = initialData
    ? "Updating Category..."
    : "Creating Category...";
  const submitButtonText = initialData ? "Update Category" : "Create Category";

  // Auto-generate slug from name
  const name = form.watch("name");
  useEffect(() => {
    if (name && !initialData) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [name, form, initialData]);

  // Sync Meta Title with Name if not dirty
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name") {
        const { isDirty } = form.getFieldState("metaTitle");
        if (!isDirty) {
          form.setValue("metaTitle", (value.name as string) || "");
        }
      }
      if (name === "desc") {
        const { isDirty } = form.getFieldState("metaDescription");
        if (!isDirty) {
          form.setValue("metaDescription", (value.desc as string) || "");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (!categoryImage && !initialData?.imageUrl) {
        showError({ message: "Category image is required" });
        return;
      }

      toast.loading(loadingText);
      setIsLoading(true);

      const formData = new FormData();
      formData.append(
        "details",
        initialData
          ? JSON.stringify({ ...values, imageUrl: initialData.imageUrl })
          : JSON.stringify(values),
      );
      if (categoryImage) {
        formData.append("categoryImage", categoryImage);
      }

      if (initialData) {
        const response = await axios.patch(
          `/api/admin/categories/${initialData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        toast.dismiss();
        showSuccess({
          message: response.data.message || "Category updated successfully",
        });
      } else {
        const response = await axios.post("/api/admin/categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.dismiss();
        showSuccess({
          message: response.data.message || "Category created successfully",
        });
      }

      router.push(
        path.includes("dashboard")
          ? "/dashboard/categories"
          : "/admin/categories",
      );
      router.refresh();
    } catch (error) {
      toast.dismiss();
      showError({
        message: axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Check for file type
    const allowedFileType = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
    ];
    const file = e.target.files?.[0];
    if (file && !allowedFileType.includes(file.type)) {
      showError({
        message: "Please upload an image file (JPEG, PNG, JPG, GIF)",
      });
      return;
    }

    // Check for file size (max 5MB)
    const maxFileSize = 5 * 1024 * 1024;
    if (file && file.size > maxFileSize) {
      showError({ message: "File size must be less than 5MB" });
      return;
    }

    if (file) {
      setCategoryImage(file);
    }
  };

  const title = initialData ? "Edit Category" : "Add Category";
  const description = initialData
    ? "Edit category details"
    : "Add a new category to your store";

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <PageTittle title={title} description={description} />
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Essential details about the category
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Controller
                      name="name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="category-name">
                            Category Name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="category-name"
                            disabled={isLoading}
                            placeholder="e.g. Contemporary Paintings"
                            autoComplete="off"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="slug"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="category-slug">Slug</FieldLabel>
                          <Input
                            {...field}
                            id="category-slug"
                            disabled={isLoading}
                            placeholder="contemporary-paintings"
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Unique identifier for URLs (auto-generated from
                            name)
                          </p>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="desc"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="category-desc">
                            Description
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupTextarea
                              {...field}
                              id="category-desc"
                              disabled={isLoading}
                              placeholder="Describe this category..."
                              rows={6}
                              className="min-h-32 resize-none"
                            />
                          </InputGroup>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="isFeatured"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
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
                                Featured Category
                              </Label>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground ml-14">
                            Featured Category will be displayed on the homepage.
                          </p>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="isDeleted"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Switch
                                id="is-deleted"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isLoading}
                              />
                              <Label
                                htmlFor="is-deleted"
                                className="font-semibold cursor-pointer text-destructive"
                              >
                                Delete Category
                              </Label>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground ml-14">
                            Soft delete this category. It will be hidden but not removed.
                          </p>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {/* Image Upload Section */}
                    <div className="pt-4 border-t">
                      <FieldLabel className="mb-4">Category Image</FieldLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                          className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                            categoryImage
                              ? "border-primary/50 bg-primary/5"
                              : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                          }`}
                        >
                          {categoryImage ? (
                            <>
                              <Image
                                src={URL.createObjectURL(categoryImage)}
                                alt="Category preview"
                                fill
                                className="object-cover rounded-lg p-2"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setCategoryImage(null);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : initialImageUrl ? (
                            <>
                              <Image
                                src={initialImageUrl}
                                alt="Category preview"
                                fill
                                className="object-cover rounded-lg p-2"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setInitialImageUrl("");
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                              <ImagePlus className="w-10 h-10 text-slate-400 mb-2" />
                              <span className="text-sm font-medium text-slate-600">
                                Upload Image
                              </span>
                              <span className="text-xs text-slate-400 mt-1">
                                JPG, PNG, WebP up to 5MB
                              </span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  handleImageChange(e);
                                }}
                              />
                            </label>
                          )}
                        </div>
                        <div className="flex flex-col justify-center space-y-2 text-sm text-slate-500">
                          <p>• High-quality image (800x800px recommended)</p>
                          <p>• Image will be shown on category cards</p>
                          <p className="text-red-500 font-medium">
                            • Required for category visibility
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Optimization</CardTitle>
                    <CardDescription>
                      Improve search engine visibility
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Controller
                      name="metaTitle"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="meta-title">
                            Meta Title
                          </FieldLabel>
                          <Input
                            {...field}
                            id="meta-title"
                            disabled={isLoading}
                            placeholder="SEO-friendly title"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="metaDescription"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="meta-description">
                            Meta Description
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupTextarea
                              {...field}
                              id="meta-description"
                              disabled={isLoading}
                              placeholder="Brief description for search results..."
                              rows={4}
                              className="min-h-24 resize-none"
                            />
                            <InputGroupAddon align="block-end">
                              <InputGroupText className="tabular-nums">
                                {field.value?.length || 0}/160 characters
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
              </div>

              {/* Right Column - Actions/Status */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>
                      Publish or save your changes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {submitButtonText}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                      onClick={() => router.back()}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

export default NewCategory;
