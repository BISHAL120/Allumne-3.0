"use client";

import { SingleOrderProps } from "@/app/admin/orders/id/[id]/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Package,
  Paintbrush,
  Phone,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";

interface OrderDetailsProps {
  order: SingleOrderProps;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const getStatusColor = (status: SingleOrderProps["status"]) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Back Button - Left Side */}
        <Button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Order Info - Right Side */}
        <div className="text-right">
          <div className="flex items-center gap-3 mb-1 justify-end">
            <h1 className="text-3xl font-bold tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <Badge
              className={`${getStatusColor(order.status)} border-none px-3 py-1 font-medium`}
            >
              {order.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground justify-end">
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              <span>{format(new Date(order.createdAt), "PPP")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{format(new Date(order.createdAt), "p")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm overflow-hidden p-0 gap-0">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Paintbrush className="w-5 h-5 text-muted-foreground" />
                Artworks & Paintings
              </CardTitle>
              <CardDescription>
                {order.cartItems.length}{" "}
                {order.cartItems.length === 1 ? "item" : "items"} in this order
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent ">
                    <TableHead className="w-100 pl-6 py-4">Product</TableHead>
                    <TableHead className="text-center py-4">Quantity</TableHead>
                    <TableHead className="text-right py-4 pr-6">
                      Subtotal
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.cartItems.map((item) => (
                    <TableRow key={item.id} className=" hover:bg-muted/5">
                      <TableCell className="pl-6 py-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 border ">
                            <Image
                              width={200}
                              height={200}
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-center space-y-1">
                            <span className="font-semibold text-base">
                              {item.title}
                            </span>
                            <div className="flex flex-col text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <UserIcon className="w-3 h-3" />
                                {item.artist}
                              </span>
                              <span>Size: {item.size}</span>
                              <span>
                                Price: ৳{Number(item.price).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 font-medium">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right py-4 pr-6 font-semibold">
                        ৳{Number(item.subTotal).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {order.customRequirements && (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-muted-foreground">
                  <Package className="w-5 h-5" />
                  Custom Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/30 rounded-lg text-sm leading-relaxed italic">
                  &quot;{order.customRequirements}&quot;
                </div>
              </CardContent>
            </Card>
          )}

          {order.paymentScreenshot && (
            <div>
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Payment Screenshot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                    <Image
                      src={order.paymentScreenshot || "/placeholder.svg"}
                      alt="Payment screenshot"
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ৳{Number(order.totalPrice).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <Separator className="my-2 bg-muted/50" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-bold">Total</span>
                <span className="text-xl font-bold tracking-tight">
                  ৳{Number(order.totalPrice).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Details */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted/50 rounded-full">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Full Name
                  </p>
                  <p className="text-sm font-semibold">{order.fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted/50 rounded-full">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-1 text-wrap overflow-hidden">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold break-all">
                    {order.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted/50 rounded-full">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold">{order.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted/50 rounded-full">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Shipping Address
                  </p>
                  <p className="text-sm font-semibold leading-relaxed">
                    {order.fullAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
