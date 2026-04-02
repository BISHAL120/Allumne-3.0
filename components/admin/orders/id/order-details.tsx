"use client";

import { SingleOrderProps } from "@/app/admin/orders/id/[id]/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Package,
  Phone,
  User as UserIcon,
  Receipt,
  CreditCard,
  Image as ImageIcon,
  BadgeCheck
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OrderDetailsProps {
  order: Omit<SingleOrderProps, "cartItems"> & {
    customRequirements?: string | null;
    customer?: {
      fullName: string;
      email: string | null;
      phone: string;
      fullAddress: string;
      paymentScreenshot?: string | null;
    };
    cartItems: Array<
      Omit<SingleOrderProps["cartItems"][number], "user"> & {
        user: string | { name: string; email: string; [key: string]: unknown } | null;
      }
    >;
  };
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20";
      case "CONFIRMED":
        return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
      case "SHIPPED":
        return "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20";
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-[1200px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              Order {order.orderNumber}
            </h1>
            <Badge className={`${getStatusColor(order.status)} border-none shadow-none`}>
              {order.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground ml-11">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{format(new Date(order.createdAt), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{format(new Date(order.createdAt), "hh:mm a")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="shadow-none border-border/50 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 py-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                Order Items
                <Badge variant="secondary" className="ml-auto rounded-full font-medium">
                  {order.cartItems.length} {order.cartItems.length === 1 ? "Item" : "Items"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {order.cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 hover:bg-muted/10 transition-colors">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/50 relative">
                      <Image
                        fill
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-base leading-none">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-base">৳{Number(item.subTotal).toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × ৳{Number(item.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-md w-fit">
                          <BadgeCheck className="w-3.5 h-3.5" />
                          Added by: {typeof item.user === 'object' && item.user !== null ? (item.user as { name?: string }).name : typeof item.user === "string" ? item.user : "Staff"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Requirements */}
          {order.customRequirements && (
            <Card className="shadow-none border-border/50">
              <CardHeader className="py-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-muted-foreground" />
                  Custom Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg leading-relaxed border border-border/50">
                  {order.customRequirements}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Payment Screenshot */}
          {order.customer?.paymentScreenshot && (
            <Card className="shadow-none border-border/50">
              <CardHeader className="py-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  Payment Screenshot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden border border-border/50 bg-muted/20">
                  <Image
                    src={order.customer.paymentScreenshot}
                    alt="Payment screenshot"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="shadow-none border-border/50">
            <CardHeader className="bg-muted/30 border-b border-border/50 py-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">৳{Number(order.totalPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold tracking-tight">৳{Number(order.totalPrice).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Details */}
          <Card className="shadow-none border-border/50">
            <CardHeader className="bg-muted/30 border-b border-border/50 py-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</p>
                <p className="text-sm font-medium">{order.customer?.fullName || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</p>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{order.customer?.email || "No email provided"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{order.customer?.phone || "N/A"}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Shipping Address</p>
                <div className="flex items-start gap-2 text-sm mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{order.customer?.fullAddress || "N/A"}</span>
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
