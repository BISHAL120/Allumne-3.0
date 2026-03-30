"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft, Check, Loader2, Plus, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { showError, showSuccess } from "@/lib/toast";

const cartItemSchema = z.object({
  id: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  productId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  size: z.string().min(1, "Size is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  artist: z.string().optional(),
  thumbnail: z.string().optional(),
  subTotal: z.string().optional(),
});

const orderFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  fullAddress: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  orderNumber: z.string().min(1, "Order number is required"),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  customRequirements: z.string().optional().or(z.literal("")),
  cartItems: z.array(cartItemSchema),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface EditOrderProps {
  initialData: {
    id: string;
    fullName: string;
    phone: string;
    fullAddress: string;
    email?: string | null;
    orderNumber: string;
    status:
      | "PENDING"
      | "CONFIRMED"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED";
    customRequirements?: string | null;
    cartItems: {
      id: string;
      productId?: string;
      title: string;
      size: string;
      price: string;
      quantity: number;
      artist?: string;
      thumbnail?: string;
      subTotal?: string;
      orderId: string;
    }[];
  } | null;
}

const EditOrder: React.FC<EditOrderProps> = ({ initialData }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      phone: initialData?.phone || "",
      fullAddress: initialData?.fullAddress || "",
      email: initialData?.email || "",
      orderNumber: initialData?.orderNumber || "",
      status: initialData?.status || "PENDING",
      customRequirements: initialData?.customRequirements || "",
      cartItems:
        initialData?.cartItems?.map((item) => ({
          id: item.id,
          productId: item.productId,
          title: item.title,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
          artist: item.artist,
          thumbnail: item.thumbnail,
          subTotal: item.subTotal,
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "cartItems",
    control: form.control,
  });

  const onSubmit = async (values: OrderFormValues) => {
    try {
      setIsLoading(true);
      // Calculate subtotal for each item before sending
      const updatedValues = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        fullAddress: values.fullAddress,
        status: values.status,
        customRequirements: values.customRequirements,
        
      };
      await axios.patch(`/api/admin/orders/?orderId=${initialData?.id}`, updatedValues);
      showSuccess({ message: "Order updated successfully" });
      router.refresh();
      router.push("/admin/orders");
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to update order";
      showError({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    const items = form.watch("cartItems");
    return items
      .reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  // const handleAddToCartChange = () => {
  //   const cartItems = form.getValues("cartItems");

  //   console.log(cartItems);
  // };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Order</h2>
            <p className="text-sm text-muted-foreground">
              Update order details and managed items for #
              {initialData?.orderNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Customer contact and delivery details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john@example.com"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="019XXXXXXXX"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="fullAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Street, City, State, ZIP"
                          {...field}
                          disabled={isLoading}
                          className="min-h-25"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Order Status & Meta */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>
                    Control order status and tracking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="orderNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Number</FormLabel>
                        <FormControl>
                          <Input disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Status</FormLabel>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PROCESSING">
                              Processing
                            </SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="RETURNED">Returned</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Requirements / Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special instructions..."
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Order Total Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Subtotal
                      </span>
                      <span className="font-medium">${calculateTotal()}</span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-2">
                      <span className="text-base font-bold">Total</span>
                      <span className="text-base font-bold">
                        ${calculateTotal()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Cart Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  Manage products included in this order
                </CardDescription>
              </div>
              {/* <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ title: "", size: "", price: "0", quantity: 1 })
                  }
                  disabled={isLoading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
                {initialData?.cartItems !== form.watch("cartItems") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToCartChange()}
                    disabled={isLoading}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </div> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="group relative">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 rounded-lg border bg-muted/20 transition-colors hover:bg-muted/30">
                      {/* Thumbnail Display */}
                      <div className="md:col-span-1 flex items-center justify-center">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted border">
                          {form.watch(`cartItems.${index}.thumbnail`) ? (
                            <Image
                              src={form.watch(`cartItems.${index}.thumbnail`)!}
                              alt="Product"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                              N/A
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-4 space-y-2">
                        <FormField
                          control={form.control}
                          name={`cartItems.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className={index !== 0 ? "sr-only" : ""}
                              >
                                Product Title
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Product Name"
                                  disabled
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`cartItems.${index}.artist`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Artist Name"
                                  disabled
                                  className="text-xs h-7"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`cartItems.${index}.size`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className={index !== 0 ? "sr-only" : ""}
                              >
                                Size
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Size"
                                  disabled
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`cartItems.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className={index !== 0 ? "sr-only" : ""}
                              >
                                Price
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    className="pl-6"
                                    placeholder="0.00"
                                    disabled
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`cartItems.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className={index !== 0 ? "sr-only" : ""}
                              >
                                Qty
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                  disabled
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* <div className="md:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={isLoading || fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div> */}
                    </div>
                  </div>
                ))}

                {fields.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg bg-muted/10">
                    <p className="text-sm text-muted-foreground">
                      No items in this order.
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() =>
                        append({ title: "", size: "", price: "0", quantity: 1 })
                      }
                      className="mt-2"
                    >
                      Add your first item
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default EditOrder;
