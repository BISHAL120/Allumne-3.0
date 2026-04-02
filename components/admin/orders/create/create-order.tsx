"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/hooks/use-cart";
import {
  createOrder,
  findCustomerByPhone,
  searchProducts,
} from "@/lib/actions/order-actions";
import { authClient } from "@/lib/auth-client";
import { DiscountType, Product } from "@prisma/client";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Minus,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  Trash2,
  User as UserIcon,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import PageTitle from "../../shared/pageTittle";

const COUNTRY_CODES = [
  { code: "+880", country: "BD", label: "🇧🇩 BD (+880)" },
  { code: "+1", country: "US", label: "🇺🇸 US (+1)" },
  { code: "+44", country: "GB", label: "🇬🇧 UK (+44)" },
  { code: "+91", country: "IN", label: "🇮🇳 IN (+91)" },
  { code: "+92", country: "PK", label: "🇵🇰 PK (+92)" },
  { code: "+971", country: "AE", label: "🇦🇪 AE (+971)" },
  { code: "+966", country: "SA", label: "🇸🇦 SA (+966)" },
  { code: "+1", country: "CA", label: "🇨🇦 CA (+1)" },
  { code: "+61", country: "AU", label: "🇦🇺 AU (+61)" },
];

const customerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  fullAddress: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().regex(/^\d+$/, "Phone number must contain only digits").min(7, "Phone number is too short").max(15, "Phone number is too long"),
  countryCode: z.string(),
});

// Define local Customer type in case of Prisma Client issues
interface Customer {
  id: string;
  fullName: string;
  phone: string;
  fullAddress: string;
  email?: string | null;
  paymentScreenshot?: string | null;
  customRequirements?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Define variant type that exactly matches Prisma's type ProductVariant
interface ProductVariant {
  size: string;
  price: string;
  stock: string | null;
  discountType: DiscountType | null;
  discountPrice: string | null;
}

// Extend Product type to include variants and category
interface ExtendedProduct extends Omit<Product, "variants"> {
  variants: ProductVariant[];
  category?: {
    name: string;
  };
}

interface OrderSummary {
  orderId: string;
  userId: string;
  customer: {
    id: string;
    name: string;
    email: string | null | undefined;
    phone: string;
    address: string;
    notes: string | null | undefined;
  };
  items: Array<{
    productId: string;
    name: string;
    size: string | undefined;
    price: number;
    quantity: number;
    total: number;
  }>;
  summary: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  metadata: {
    source: string;
    status: string;
    createdAt: string;
  };
}

export default function CreateOrder() {
  const {
    items,
    addToCart,
    removeFromCart,
    incrementItem,
    decrementItem,
    getSubtotal,
    getCartTotal,
    getCartItemCount,
    clearCart,
  } = useCart();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState("products");
  const [productSearch, setProductSearch] = useState("");
  const [foundProducts, setFoundProducts] = useState<ExtendedProduct[]>([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);

  const [customerPhone, setCustomerPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+880");
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    fullName: "",
    email: "",
    fullAddress: "",
    customRequirements: "",
  });

  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination states for infinite scroll
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const TAKE = 10;

  // Search Products
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (productSearch.length >= 2) {
        setIsSearchingProducts(true);
        setPage(0);
        setHasMore(true);
        try {
          const results = await searchProducts(productSearch, 0, TAKE);
          setFoundProducts(results as unknown as ExtendedProduct[]);
          if (results.length < TAKE) setHasMore(false);
        } catch (error) {
          toast.error("Error searching products");
          setFoundProducts([]);
        } finally {
          setIsSearchingProducts(false);
        }
      } else if (productSearch.length === 0) {
        setFoundProducts([]);
        setPage(0);
        setHasMore(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [productSearch]);

  // Load more products for infinite scroll
  const loadMoreProducts = async () => {
    if (isFetchingMore || !hasMore || productSearch.length < 2) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;
    const skip = nextPage * TAKE;

    try {
      const results = await searchProducts(productSearch, skip, TAKE);
      if (results.length === 0) {
        setHasMore(false);
      } else {
        setFoundProducts((prev) => [
          ...prev,
          ...(results as unknown as ExtendedProduct[]),
        ]);
        setPage(nextPage);
        if (results.length < TAKE) setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // Scroll handler for infinite scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      loadMoreProducts();
    }
  };

  const handleAddToCart = (
    product: ExtendedProduct,
    variant: ProductVariant,
  ) => {
    // 1. Check if product is published
    if (product.status !== "PUBLISHED") {
      toast.error("Unavailable", {
        description: `This product is currently ${product.status.toLowerCase()} and cannot be added to orders.`,
      });
      return;
    }

    // 2. Check if variant has stock
    const currentStock = parseInt(variant.stock || "0");
    if (currentStock <= 0) {
      toast.error("Out of Stock", {
        description: `The size ${variant.size} for ${product.productName} is currently out of stock.`,
      });
      return;
    }

    const isAlreadyInCart = items.some(
      (item) => item.productId === product.id && item.size === variant.size,
    );

    if (isAlreadyInCart) {
      toast.warning("Product already selected", {
        description: `${product.productName} (${variant.size}) is already in your cart. You can adjust quantity in the cart.`,
      });
      return;
    }

    addToCart({
      id: product.id,
      title: product.productName,
      price: Number(variant.price),
      thumbnail: product.thumbnail || "",
      size: variant.size,
      stock: currentStock,
    });
    toast.success(`${product.productName} added to cart`);
  };

  const handleSearchCustomer = async () => {
    if (!customerPhone) {
      toast.error("Please enter a phone number to search.");
      return;
    }

    // Validate phone is only digits
    if (!/^\d+$/.test(customerPhone)) {
      toast.error("Invalid phone number", {
        description: "Phone number must contain only digits.",
      });
      return;
    }

    const fullPhone = `${countryCode}${customerPhone}`;
    setIsSearchingCustomer(true);
    try {
      const customer = (await findCustomerByPhone(
        fullPhone,
      )) as unknown as Customer | null;
      setFoundCustomer(customer);
      if (!customer) {
        toast.info("Customer not found. Please fill in the details below.");
      } else {
        toast.success("Customer found!");
      }
    } catch (error) {
      toast.error("Error searching for customer.");
    } finally {
      setIsSearchingCustomer(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to create an order.");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add products to your cart first.");
      setActiveTab("products");
      return;
    }

    const fullPhone = `${countryCode}${customerPhone}`;
    const customerData = foundCustomer || {
      ...newCustomer,
      phone: fullPhone,
    };

    // Zod validation for new customer if no existing found
    if (!foundCustomer) {
      try {
        customerSchema.parse({
          ...newCustomer,
          phone: customerPhone,
          countryCode: countryCode,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast.error(error.errors[0].message);
          return;
        }
      }
    }

    if (
      !customerData.fullName ||
      !customerData.phone ||
      !customerData.fullAddress
    ) {
      toast.error("Please complete customer information.");
      setActiveTab("customer");
      return;
    }

    const finalOrder = {
      userId: user.id,
      customer: {
        id: foundCustomer?.id || "NEW",
        name: customerData.fullName,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.fullAddress,
        notes: customerData.customRequirements,
      },
      items: items.map((item) => ({
        productId: item.productId,
        name: item.title,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      summary: {
        subtotal: getSubtotal(),
        shipping: 0,
        total: getCartTotal(),
      },
    };

    setIsSubmitting(true);
    try {
      const result = await createOrder(finalOrder);

      if (result.success) {
        toast.success(`Order ${result.orderNumber} created successfully!`);
        clearCart();
        handleClearCustomer();
        setActiveTab("products");
        setOrderSummary(null);
      } else {
        toast.error(result.error || "Failed to create order");
      }
    } catch (error) {
      console.log("Error submitting order:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearCustomer = () => {
    setFoundCustomer(null);
    setCustomerPhone("");
    setCountryCode("+880");
    setNewCustomer({
      fullName: "",
      email: "",
      fullAddress: "",
      customRequirements: "",
    });
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageTitle
          title="Create New Order"
          description="Streamlined order creation workflow with 3-step process"
        />
        <Button
          variant="outline"
          onClick={() => {
            clearCart();
            handleClearCustomer();
            setActiveTab("products");
            setOrderSummary(null);
            toast.success("Form cleared successfully");
          }}
          className=" border-dashed hover:border-slate-400"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Start New Order
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid place-items-center gap-5 grid-cols-3 h-20 pb-5 bg-transparent ">
          <TabsTrigger
            value="products"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:font-semibold gap-2 transition-colors py-3 border border-secondary shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">1. Products</span>
            <span className="sm:hidden">1.</span>
          </TabsTrigger>
          <TabsTrigger
            value="customer"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:font-semibold gap-2 transition-colors py-3 border border-secondary shadow-md"
          >
            <UserIcon className="w-4 h-4" />
            <span className="hidden sm:inline">2. Customer</span>
            <span className="sm:hidden">2.</span>
          </TabsTrigger>
          <TabsTrigger
            value="summary"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:font-semibold gap-2 transition-colors py-3 border border-secondary shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">3. Summary</span>
            <span className="sm:hidden">3.</span>
          </TabsTrigger>
        </TabsList>
        {/* TAB 1: PRODUCT SELECTION */}
        <TabsContent
          value="products"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Search Products */}
            <div className="lg:col-span-7 space-y-6">
              <Card className=" shadow-md border-none overflow-hidden bg-transparent">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <div className="p-2 bg-primary/10 ">
                      <Search className="w-5 h-5 text-primary" />
                    </div>
                    Browse Products
                  </CardTitle>
                  <CardDescription className="text-slate-500">
                    Search and select items to add to your order cart
                  </CardDescription>
                  <div className="relative mt-4">
                    <Input
                      placeholder="Search by product name or slug..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-12 h-14 bg-slate-100/50 border-transparent focus:border-primary/20 focus:ring-primary/10 transition-all text-lg"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea
                    className="h-137.5 pr-4"
                    onScrollCapture={handleScroll}
                  >
                    {isSearchingProducts ? (
                      <div className="flex flex-col items-center justify-center h-48 space-y-4">
                        <div className="animate-spin h-10 w-10 border-4 border-primary/20 border-t-primary" />
                        <p className="text-slate-500 font-medium">
                          Searching products...
                        </p>
                      </div>
                    ) : foundProducts.length > 0 ? (
                      <div className="p-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                          {foundProducts.map((product) => (
                            <Card
                              key={product.id}
                              className="p-0 border hover:border-slate-100 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group overflow-hidden flex flex-col h-full relative"
                            >
                              {/* Modern Status Overlay for Non-Published Products */}
                              {product.status !== "PUBLISHED" && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[6px] transition-all duration-300">
                                  <Badge
                                    variant="outline"
                                    className={`
                                      px-6 py-2.5 text-sm font-black uppercase tracking-[0.2em] shadow-2xl border-2
                                      ${
                                        product.status === "DRAFT"
                                          ? "bg-amber-500/90 border-amber-300 text-white"
                                          : product.status === "PENDING"
                                            ? "bg-blue-500/90 border-blue-300 text-white"
                                            : "bg-red-500/90 border-red-300 text-white"
                                      }
                                    `}
                                  >
                                    {product.status}
                                  </Badge>
                                  <p className="text-white/80 text-[10px] mt-3 font-bold uppercase tracking-widest drop-shadow-md">
                                    Not available for ordering
                                  </p>
                                </div>
                              )}

                              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                                {product.thumbnail ? (
                                  <Image
                                    src={product.thumbnail}
                                    alt={product.productName}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-12 h-12 text-slate-300" />
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-4 flex-1 flex flex-col relative">
                                <h4 className="font-bold text-lg line-clamp-1">
                                  {product.productName}
                                </h4>
                                <p className="text-sm text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                                  {product.shortDescription}
                                </p>
                                <div className="mt-4 space-y-2.5">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Available Variants
                                  </p>
                                  {product.variants &&
                                    product.variants.map(
                                      (v: ProductVariant, idx: number) => {
                                        const isOutOfStock =
                                          parseInt(v.stock || "0") <= 0;
                                        return (
                                          <Button
                                            key={idx}
                                            variant="outline"
                                            size="sm"
                                            disabled={isOutOfStock}
                                            className={`
                                              w-full justify-between h-12 border-slate-100 px-4 transition-all duration-300 group/btn
                                              ${
                                                isOutOfStock
                                                  ? "opacity-60 cursor-not-allowed bg-slate-50 grayscale-[0.5]"
                                                  : "hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                                              }
                                            `}
                                            onClick={() =>
                                              handleAddToCart(product, v)
                                            }
                                          >
                                            <div className="flex items-center gap-3">
                                              <div
                                                className={`
                                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border
                                                ${
                                                  isOutOfStock
                                                    ? "bg-slate-200 border-slate-300 text-slate-400"
                                                    : "bg-white border-slate-100 text-slate-700 group-hover/btn:border-primary group-hover/btn:text-primary transition-colors"
                                                }
                                              `}
                                              >
                                                {v.size}
                                              </div>
                                              <div className="flex flex-col items-start leading-none">
                                                <span
                                                  className={`text-[10px] font-bold uppercase tracking-tighter ${isOutOfStock ? "text-red-400" : "text-slate-400"}`}
                                                >
                                                  {isOutOfStock
                                                    ? "Out of Stock"
                                                    : "Available"}
                                                </span>
                                                {!isOutOfStock && (
                                                  <span className="text-[11px] font-bold text-slate-600 mt-0.5">
                                                    {v.stock} units
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                              <span
                                                className={`font-black text-base ${isOutOfStock ? "text-slate-400" : "text-primary"}`}
                                              >
                                                ${v.price}
                                              </span>
                                            </div>
                                          </Button>
                                        );
                                      },
                                    )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {/* Infinite Scroll Loader */}
                        {hasMore && (
                          <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm animate-pulse">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {isFetchingMore
                                ? "LOADING MORE PRODUCTS..."
                                : "SCROLL FOR MORE"}
                            </div>
                            <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary animate-[loading_1.5s_infinite]" />
                            </div>
                          </div>
                        )}

                        {!hasMore && foundProducts.length > 0 && (
                          <div className="flex flex-col items-center justify-center py-10 opacity-40">
                            <div className="w-12 h-[1px] bg-slate-300 mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                              End of Results
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-100 text-center p-8">
                        <div className="w-20 h-20 border border-slate-300 flex items-center justify-center mb-6">
                          <Package className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold">No products found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2">
                          Try searching for a different product name or slug to
                          get started.
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Cart Details */}
            <div className="lg:col-span-5 space-y-6">
              <Card className=" shadow-md border-none bg-transparent sticky top-8 overflow-hidden flex flex-col h-fit max-h-[calc(100vh-120px)]">
                <CardHeader className=" border-b border-slate-500 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        Order Cart
                      </CardTitle>
                      <CardDescription className="text-slate-500">
                        {getCartItemCount()} items selected
                      </CardDescription>
                    </div>
                    {items.length > 0 && (
                      <Button
                        size="sm"
                        onClick={clearCart}
                        className="text-red-500 border-red-500 hover:text-white bg-transparent hover:bg-red-600 border h-9 hover:cursor-pointer duration-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-hidden">
                  <ScrollArea className="h-100 px-6 py-4">
                    {items.length > 0 ? (
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div
                            key={`${item.productId}-${item.size}`}
                            className="flex gap-4 p-4 group border"
                          >
                            <div className="relative w-16 h-16 overflow-hidden shrink-0 shadow-sm">
                              {item.thumbnail ? (
                                <Image
                                  src={item.thumbnail}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-slate-200" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <h5 className="font-bold text-base truncate leading-tight">
                                  {item.title}
                                </h5>
                                <button
                                  onClick={() =>
                                    removeFromCart({
                                      id: item.productId,
                                      size: item.size,
                                      title: item.title,
                                      price: item.price,
                                    })
                                  }
                                  className=" border p-1 hover:text-red-500 transition-colors cursor-pointer hover:border-red-500 duration-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-xs font-medium text-primary mt-0.5">
                                Size: {item.size}
                              </p>

                              <div className="flex items-center justify-between mt-2.5">
                                <div className="flex items-center border p-0.5 shadow-sm">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 hover:bg-slate-100"
                                    onClick={() =>
                                      decrementItem({
                                        id: item.productId,
                                        size: item.size,
                                        title: item.title,
                                        price: item.price,
                                      })
                                    }
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm font-bold ">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 hover:bg-slate-100"
                                    onClick={() => {
                                      if (
                                        item.stock !== undefined &&
                                        item.quantity + 1 > item.stock
                                      ) {
                                        toast.error("Limit Reached", {
                                          description: `${item.stock} amount of item for ${item.size} size are available`,
                                        });
                                        return;
                                      }
                                      incrementItem({
                                        id: item.productId,
                                        size: item.size,
                                        title: item.title,
                                        price: item.price,
                                      });
                                    }}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <span className="font-bold">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-75 text-center">
                        <div className="w-16 h-16 flex items-center justify-center mb-4 border border-slate-300">
                          <ShoppingCart className="w-8 h-8" />
                        </div>
                        <p className=" font-medium">Your cart is empty</p>
                        <p className="text-xs mt-1 max-w-50">
                          Add products from the left panel to start your order
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex-col gap-4 border-t border-slate-400 p-6">
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm ">
                      <span>Subtotal</span>
                      <span className="font-medium">
                        ${getSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-500">
                      <span>Total Amount</span>
                      <span className="">${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2"
                    disabled={items.length === 0}
                    onClick={() => setActiveTab("customer")}
                  >
                    Proceed to Customer Info
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: CUSTOMER INFORMATION */}
        <TabsContent
          value="customer"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className=" mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5">
              <Card className="shadow-md border-none overflow-hidden h-full">
                <CardHeader className="pb-8">
                  <div className="w-12 h-12 flex items-center justify-center mb-4">
                    <Search className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    Search Customer
                  </CardTitle>
                  <CardDescription>
                    Enter customer phone number to find existing records
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone-search"
                      className="font-semibold flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <div className="flex gap-2 h-12">
                      <div className="w-32 h-12">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full h-12 px-3 border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.country} value={c.code}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Input
                        id="phone-search"
                        placeholder="e.g. 1312604691"
                        value={customerPhone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setCustomerPhone(value);
                        }}
                        className="h-12 flex-1"
                      />
                    </div>
                      <Button
                        onClick={handleSearchCustomer}
                        disabled={isSearchingCustomer || !customerPhone}
                        className="w-full h-12 px-6"
                      >
                        {isSearchingCustomer ? (
                          <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white" />
                        ) : (
                          "Search"
                        )}
                      </Button>
                  </div>

                  {foundCustomer && (
                    <div className="p-6 space-y-4 animate-in zoom-in-95 duration-300">
                      <div className="flex items-center justify-between">
                        <Badge className="border-none">Customer Found</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearCustomer}
                          className="hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider">
                              Full Name
                            </p>
                            <p className="font-bold">
                              {foundCustomer.fullName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider">
                              Email Address
                            </p>
                            <p className="font-medium">
                              {foundCustomer.email || "No email provided"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider">
                              Shipping Address
                            </p>
                            <p className="font-medium line-clamp-2">
                              {foundCustomer.fullAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-7">
              <Card className="shadow-md border-none overflow-hidden">
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {foundCustomer
                          ? "Update Details"
                          : "New Customer Information"}
                      </CardTitle>
                      <CardDescription>
                        {foundCustomer
                          ? "Review existing information for this order"
                          : "Enter new customer details to save to database"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={
                          foundCustomer
                            ? foundCustomer.fullName
                            : newCustomer.fullName
                        }
                        onChange={(e) =>
                          foundCustomer
                            ? setFoundCustomer({
                                ...foundCustomer,
                                fullName: e.target.value,
                              })
                            : setNewCustomer({
                                ...newCustomer,
                                fullName: e.target.value,
                              })
                        }
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={
                          foundCustomer
                            ? foundCustomer.email || ""
                            : newCustomer.email
                        }
                        onChange={(e) =>
                          foundCustomer
                            ? setFoundCustomer({
                                ...foundCustomer,
                                email: e.target.value,
                              })
                            : setNewCustomer({
                                ...newCustomer,
                                email: e.target.value,
                              })
                        }
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone-input" className="font-semibold">
                      Phone Number *
                    </Label>
                    <div className="flex gap-2">
                      <div className="w-32 h-12">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full h-12 px-3 border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.country} value={c.code}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Input
                        id="phone-input"
                        placeholder="e.g. 1312604691"
                        value={customerPhone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setCustomerPhone(value);
                        }}
                        className="h-12 flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-semibold">
                      Shipping Address *
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter full shipping address..."
                      rows={3}
                      value={
                        foundCustomer
                          ? foundCustomer.fullAddress
                          : newCustomer.fullAddress
                      }
                      onChange={(e) =>
                        foundCustomer
                          ? setFoundCustomer({
                              ...foundCustomer,
                              fullAddress: e.target.value,
                            })
                          : setNewCustomer({
                              ...newCustomer,
                              fullAddress: e.target.value,
                            })
                      }
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="requirements"
                      className="font-semibold flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Custom Requirements / Notes
                    </Label>
                    <Textarea
                      id="requirements"
                      placeholder="Any special instructions or preferences..."
                      rows={3}
                      value={
                        foundCustomer
                          ? foundCustomer.customRequirements || ""
                          : newCustomer.customRequirements
                      }
                      onChange={(e) =>
                        foundCustomer
                          ? setFoundCustomer({
                              ...foundCustomer,
                              customRequirements: e.target.value,
                            })
                          : setNewCustomer({
                              ...newCustomer,
                              customRequirements: e.target.value,
                            })
                      }
                      className="resize-none"
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t p-8 flex justify-between gap-4">
                  <Button
                    variant="outline"
                    className="h-12 px-8"
                    onClick={() => setActiveTab("products")}
                  >
                    Back to Products
                  </Button>
                  <Button
                    className="h-12 px-8 font-bold gap-2"
                    onClick={() => {
                      // Validate with Zod before proceeding
                      try {
                        customerSchema.parse({
                          ...newCustomer,
                          fullName: foundCustomer ? foundCustomer.fullName : newCustomer.fullName,
                          email: foundCustomer ? foundCustomer.email : newCustomer.email,
                          fullAddress: foundCustomer ? foundCustomer.fullAddress : newCustomer.fullAddress,
                          phone: customerPhone,
                          countryCode: countryCode,
                        });
                        setActiveTab("summary");
                      } catch (error) {
                        if (error instanceof z.ZodError) {
                          toast.error(error.errors[0].message);
                        } else {
                          toast.error("Please fill in all required fields correctly.");
                        }
                      }
                    }}
                  >
                    Review Order Summary
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: ORDER SUMMARY */}
        <TabsContent
          value="summary"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className=" mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Customer & Order Status Summary */}
              <div className="lg:col-span-1 space-y-6">
                <Card className=" shadow-md border-none overflow-hidden">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <UserIcon className="w-5 h-5" />
                      Customer Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-5">
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest">
                        Name
                      </p>
                      <p className="font-bold text-lg">
                        {foundCustomer
                          ? foundCustomer.fullName
                          : newCustomer.fullName || "Not provided"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest">
                        Contact
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {customerPhone || foundCustomer?.phone || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {foundCustomer?.email || newCustomer.email || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest">
                        Shipping To
                      </p>
                      <div className="flex gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium leading-relaxed">
                          {foundCustomer
                            ? foundCustomer.fullAddress
                            : newCustomer.fullAddress || "N/A"}
                        </span>
                      </div>
                    </div>
                    {(foundCustomer?.customRequirements ||
                      newCustomer.customRequirements) && (
                      <div className="space-y-1 pt-2 border-t">
                        <p className="text-xs font-bold uppercase tracking-widest">
                          Special Instructions
                        </p>
                        <p className="text-sm italic p-3  mt-2">
                          &quot;
                          {foundCustomer?.customRequirements ||
                            newCustomer.customRequirements}
                          &quot;
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className=" shadow-md border-none overflow-hidden">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Order Total</span>
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-4xl font-black">
                        ${getCartTotal().toFixed(2)}
                      </p>
                      <p className="text-sm font-medium">
                        Includes taxes and fees
                      </p>
                    </div>
                    <Button
                      className="w-full h-14 font-black text-lg shadow-xl group transition-all"
                      onClick={handleFinalSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          Creating Order...
                          <RefreshCw className="w-5 h-5 ml-2 animate-spin" />
                        </>
                      ) : (
                        <>
                          Confirm & Create Order
                          <CheckCircle2 className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items Table */}
              <div className="lg:col-span-2">
                <Card className=" shadow-md border-none overflow-hidden h-full">
                  <CardHeader className="border-b flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Order Items
                      </CardTitle>
                      <CardDescription>
                        Review selected products and quantities
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className=" px-3 py-1 font-bold">
                      {getCartItemCount()} Items
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[500px]">
                      {items.length > 0 ? (
                        <div className="divide-y">
                          {items.map((item) => (
                            <div
                              key={`${item.productId}-${item.size}`}
                              className="p-6 flex items-center gap-6 group hover:transition-colors"
                            >
                              <div className="relative w-20 h-20  overflow-hidden shrink-0 shadow-sm border">
                                {item.thumbnail ? (
                                  <Image
                                    src={item.thumbnail}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-8 h-8" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-lg mb-1">
                                  {item.title}
                                </h5>
                                <div className="flex items-center gap-3">
                                  <Badge
                                    variant="secondary"
                                    className=" px-2.5 py-0.5 border-none font-bold text-[11px]"
                                  >
                                    SIZE: {item.size}
                                  </Badge>
                                  <span className="text-sm font-medium">
                                    ${item.price.toFixed(2)} × {item.quantity}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-black text-xl">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-xs font-bold uppercase tracking-widest mt-1">
                                  Confirmed
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
                          <div className="w-20 h-20  flex items-center justify-center mb-6">
                            <ShoppingCart className="w-10 h-10" />
                          </div>
                          <h3 className="text-lg font-bold">
                            No items in cart
                          </h3>
                          <p className="max-w-xs mx-auto mt-2">
                            Go back to the first tab to add products to your
                            order.
                          </p>
                          <Button
                            variant="outline"
                            className="mt-6 "
                            onClick={() => setActiveTab("products")}
                          >
                            Add Products
                          </Button>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                  {items.length > 0 && (
                    <CardFooter className="border-t p-8 flex justify-between items-center">
                      <div className="flex gap-8">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest mb-1">
                            Subtotal
                          </p>
                          <p className="text-xl font-bold">
                            ${getSubtotal().toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest mb-1">
                            Tax/Fees
                          </p>
                          <p className="text-xl font-bold">$0.00</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-widest mb-1">
                          Final Total
                        </p>
                        <p className="text-3xl font-black">
                          ${getCartTotal().toFixed(2)}
                        </p>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
