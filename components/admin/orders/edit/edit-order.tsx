"use client";

import { showLoading, showSuccess, showWarning } from "@/lib/toast";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  customerSchema,
  orderStatusSchema,
  type CartItemFormValues,
  type CustomerFormValues,
  type OrderStatusFormValues,
} from "./schema";
import {
  updateCartItems,
  updateCustomerInformation,
  updateOrderStatus,
} from "@/lib/actions/order-actions";
import { toast } from "sonner";
import Error from "next/error";

interface EditOrderProps {
  initialData: {
    id: string;
    orderNumber: string;
    status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalPrice: number;
    customRequirements?: string | null;
    customer: {
      id: string;
      fullName: string;
      email: string | null;
      phone: string;
      fullAddress: string;
      paymentScreenshot?: string | null;
    };
    cartItems: Array<{
      id: string;
      productId: string;
      title: string;
      size: string;
      price: number;
      quantity: number;
      thumbnail: string | null;
      subTotal: number | null;
      user: {
        name: string;
        phoneNumber: string | null;
        email: string;
      };
    }>;
  };
}

export const EditOrder: React.FC<EditOrderProps> = ({ initialData }) => {
  const router = useRouter();
  const isLoading = false; // Always false since we're just logging

  // 1. Customer Information Form
  const customerForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: initialData?.customer?.fullName || "",
      phone: initialData?.customer?.phone || "",
      fullAddress: initialData?.customer?.fullAddress || "",
      email: initialData?.customer?.email || "",
      paymentScreenshot: initialData?.customer?.paymentScreenshot || null,
    },
  });

  // 2. Order Status Form
  const orderStatusForm = useForm<OrderStatusFormValues>({
    resolver: zodResolver(orderStatusSchema),
    defaultValues: {
      status: initialData?.status || "PENDING",
      totalPrice: initialData?.totalPrice || 0,
      customRequirements: initialData?.customRequirements || "",
    },
  });

  // 3. Cart Items Form (Using useFieldArray for dynamic management)
  const cartForm = useForm<{ cartItems: CartItemFormValues[] }>({
    defaultValues: {
      cartItems:
        initialData?.cartItems?.map((item) => ({
          id: item.id,
          productId: item.productId,
          title: item.title,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail || "",
          subTotal: item.subTotal || 0,
          user: {
            name: item.user?.name || "",
            phoneNumber: item.user?.phoneNumber ?? undefined,
            email: item.user?.email || "",
          },
        })) || [],
    },
  });

  const { fields: cartFields } = useFieldArray({
    name: "cartItems",
    control: cartForm.control,
  });

  // Update Handlers
  const onUpdateCustomer: SubmitHandler<CustomerFormValues> = async (
    values,
  ) => {
    showLoading("Updating customer information...");
    try {
      const payload = {
        customerId: initialData?.customer.id || "",
        customer: values,
      };
      await updateCustomerInformation(payload);
      toast.dismiss();
      // window.location.reload();
      showSuccess({ message: "Customer information updated successfully" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.dismiss();
      // window.location.reload();
      showWarning({ message: error?.message || "Failed to update customer information" });
      console.error("Customer update error:", error);
    }
  };

  const onUpdateOrderStatus: SubmitHandler<OrderStatusFormValues> = async (
    values,
  ) => {
    showLoading("Updating order status...");
    try {
      const payload = {
        orderId: initialData?.id || "",
        status: {
          status: values.status,
          customRequirements: values.customRequirements,
          totalPrice: values.totalPrice,
        },
      };
      await updateOrderStatus(payload);
      toast.dismiss();
      // window.location.reload();
      showSuccess({ message: "Order status updated successfully" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.dismiss();
      // window.location.reload();
      showWarning({ message: error?.message || "Failed to update order status" });
      console.error("Order status update error:", error);
    }
  };
  
  const onUpdateCartItems: SubmitHandler<{
    cartItems: CartItemFormValues[];
  }> = async (values) => {
    showLoading("Updating cart items...");

    try {
      // Compare with initialData to find only changed items
      const changedItems = values.cartItems.filter((item) => {
        const original = initialData?.cartItems.find((i) => i.id === item.id);
        if (!original) return false;
        // Check if price or quantity has changed
        return (
          item.price !== original.price || item.quantity !== original.quantity
        );
      });

      // If no items changed, skip the update
      if (changedItems.length === 0) {
        toast.dismiss();
        showSuccess({ message: "No changes detected" });
        return;
      }

      const payload = {
        orderId: initialData?.id,
        totalPrice: calculateTotal(values.cartItems),
        changedItems: changedItems.map((item) => {
          const original = initialData?.cartItems.find((i) => i.id === item.id);
          const changedQuantity = item.quantity - (original?.quantity || 0);
          return {
            ...item,
            changedQuantity,
          };
        }),
      };

      await updateCartItems(payload);
      toast.dismiss();
      // window.location.reload();
      showSuccess({ message: "Cart items updated successfully" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.dismiss();
      // window.location.reload();
      showWarning({ message: error?.message || "Failed to update cart items" });
      console.error("Cart update error:", error);
    }
  };

  const calculateTotal = (items: CartItemFormValues[]) => {
    return items
      .reduce((total, item) => {
        const price = item.price || 0;
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
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Customer and Order Management */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Information Form */}
          <Form {...customerForm}>
            <form
              onSubmit={customerForm.handleSubmit(onUpdateCustomer)}
              className="space-y-4"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Customer Information</CardTitle>
                    <CardDescription>
                      Contact and delivery details
                    </CardDescription>
                  </div>
                  <Button type="submit" size="sm" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span className="ml-2 hidden sm:inline">Update</span>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={customerForm.control}
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
                  <FormField
                    control={customerForm.control}
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
                    control={customerForm.control}
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
                  <FormField
                    control={customerForm.control}
                    name="fullAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Street, City, State, ZIP"
                            {...field}
                            disabled={isLoading}
                            className="min-h-20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={customerForm.control}
                    name="paymentScreenshot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Screenshot URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/screenshot.jpg"
                            value={field.value || ""}
                            onChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="">
                  <CardTitle className="text-sm">
                    Staff Member Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="space-y-1 flex items-center gap-3">
                    <p className="text-xs text-muted-foreground">Name :</p>
                    <p className="text-sm font-medium">
                      {initialData?.cartItems?.[0]?.user?.name || "—"}
                    </p>
                  </div>
                  <div className="space-y-1 flex items-center gap-3">
                    <p className="text-xs text-muted-foreground">Phone :</p>
                    <p className="text-sm font-medium">
                      {initialData?.cartItems?.[0]?.user?.phoneNumber || "—"}
                    </p>
                  </div>
                  <div className="space-y-1 flex items-center gap-3">
                    <p className="text-xs text-muted-foreground">Email :</p>
                    <p className="text-sm font-medium">
                      {initialData?.cartItems?.[0]?.user?.email || "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Order Status & Info Form */}
            <Form {...orderStatusForm}>
              <form
                onSubmit={orderStatusForm.handleSubmit(onUpdateOrderStatus)}
                className="space-y-4"
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Order Status</CardTitle>
                      <CardDescription>Status and pricing</CardDescription>
                    </div>
                    <Button type="submit" size="sm" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span className="ml-2 hidden sm:inline">Update</span>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormItem>
                      <FormLabel>Order Number</FormLabel>
                      <FormControl>
                        <Input value={initialData?.orderNumber} disabled />
                      </FormControl>
                    </FormItem>
                    <FormField
                      control={orderStatusForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
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
                              <SelectItem value="CONFIRMED">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="SHIPPED">Shipped</SelectItem>
                              <SelectItem value="DELIVERED">
                                Delivered
                              </SelectItem>
                              <SelectItem value="CANCELLED">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderStatusForm.control}
                      name="totalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Price</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="0.00"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderStatusForm.control}
                      name="customRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Requirements / Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special instructions..."
                              {...field}
                              disabled={isLoading}
                              className="min-h-20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </form>
            </Form>

            {/* Order Total Summary (Read-only) */}
            <Card>
              <CardHeader>
                <CardTitle>Calculated Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Subtotal (Items)
                    </span>
                    <span className="font-medium">
                      ${calculateTotal(cartForm.watch("cartItems"))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-base font-bold">Total</span>
                    <span className="text-base font-bold">
                      ${calculateTotal(cartForm.watch("cartItems"))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Form {...cartForm}>
            <form
              onSubmit={cartForm.handleSubmit(onUpdateCartItems)}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Order Items</CardTitle>
                    <CardDescription>
                      Products included in this order
                    </CardDescription>
                  </div>
                  <Button type="submit" size="sm" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span className="ml-2 hidden sm:inline">Update Cart</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartFields.map((field, index) => (
                      <div key={field.id} className="group relative">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 rounded-lg border bg-muted/20 transition-colors hover:bg-muted/30">
                          {/* Thumbnail Display */}
                          <div className="md:col-span-1 flex items-center justify-center">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted border">
                              {cartForm.watch(
                                `cartItems.${index}.thumbnail`,
                              ) ? (
                                <Image
                                  src={
                                    cartForm.watch(
                                      `cartItems.${index}.thumbnail`,
                                    )!
                                  }
                                  alt="Product"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground text-[10px]">
                                  NO IMG
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="md:col-span-4 space-y-2">
                            <FormField
                              control={cartForm.control}
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
                              control={cartForm.control}
                              name={`cartItems.${index}.productId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Product ID"
                                      disabled
                                      className="text-[10px] h-6"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="md:col-span-1">
                            <FormField
                              control={cartForm.control}
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
                              control={cartForm.control}
                              name={`cartItems.${index}.price`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    className={index !== 0 ? "sr-only" : ""}
                                  >
                                    Price
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="0.00"
                                      onChange={(e) => {
                                        const newPrice = e.target.value;
                                        field.onChange(newPrice);
                                        const qty = cartForm.getValues(
                                          `cartItems.${index}.quantity`,
                                        );
                                        cartForm.setValue(
                                          `cartItems.${index}.subTotal`,
                                          qty * parseFloat(newPrice || "0"),
                                        );
                                      }}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="md:col-span-2">
                            <FormField
                              control={cartForm.control}
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
                                      onChange={(e) => {
                                        const qty =
                                          parseInt(e.target.value) || 0;
                                        field.onChange(qty);
                                        const price = cartForm.getValues(
                                          `cartItems.${index}.price`,
                                        );
                                        cartForm.setValue(
                                          `cartItems.${index}.subTotal`,
                                          qty * price,
                                        );
                                      }}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="md:col-span-2">
                            <FormField
                              control={cartForm.control}
                              name={`cartItems.${index}.subTotal`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    className={index !== 0 ? "sr-only" : ""}
                                  >
                                    Subtotal
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="0.00"
                                      disabled
                                      className="bg-muted/50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {cartFields.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed rounded-lg bg-muted/10">
                        <p className="text-sm text-muted-foreground">
                          No items in this order.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
