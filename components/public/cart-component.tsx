"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const CartComponent = () => {
  const {
    items,
    incrementItem,
    decrementItem,
    removeFromCart,
    getCartTotal,
    getCartItemCount,
    getSubtotal,
  } = useCart();

  const itemCount = getCartItemCount();
  const subtotal = getSubtotal();
  const total = getCartTotal();

  return (
    <div className="fixed hidden md:flex right-0 top-1/2 -translate-y-1/2 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="relative h-14 w-14 rounded-l-2xl rounded-r-none bg-black hover:bg-gray-800 text-white shadow-2xl flex flex-col items-center justify-center gap-1 border-y border-l border-gray-800 group transition-all duration-300 hover:w-16">
            <div className="">
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -left-2 h-5 min-w-5 px-1 flex items-center justify-center bg-[#C9A227] text-white border-none text-[10px] font-bold">
                  {itemCount}
                </Badge>
              )}
            </div>
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l-0 sm:border-l">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-black flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Your Cart
                {itemCount > 0 && (
                  <span className="text-sm font-medium text-gray-400 ml-2">
                    ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </span>
                )}
              </SheetTitle>
            </div>
          </SheetHeader>

          <div className="grow flex flex-col overflow-hidden">
            {items.length === 0 ? (
              <div className="grow flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center">
                  <ShoppingCart className="w-12 h-12 text-gray-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 max-w-62.5 mx-auto">
                    Looks like you haven&apos;t added any beautiful art to your
                    cart yet.
                  </p>
                </div>
                <SheetClose asChild>
                  <Button className="bg-black text-white hover:bg-gray-800 rounded-xl px-8">
                    Start Shopping
                  </Button>
                </SheetClose>
              </div>
            ) : (
              <>
                <ScrollArea className="grow h-[calc(100vh-370px)] px-6">
                  <div className="py-6 space-y-6">
                    <AnimatePresence initial={false}>
                      {items.map((item, idx) => (
                        <motion.div
                          key={`${idx}`}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex gap-4 group"
                        >
                          <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                            <Image
                              src={item.thumbnail || "/placeholder-art.jpg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="grow flex flex-col justify-between py-1">
                            <div className="space-y-0.5">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                                  {item.title}
                                </h4>
                                <button
                                  onClick={() =>
                                    removeFromCart({
                                      ...item,
                                      id: item.productId,
                                    })
                                  }
                                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-500">
                                {item.artist || "Unknown Artist"}
                              </p>
                              <Badge
                                variant="secondary"
                                className="text-[10px] h-4 px-1.5 font-normal bg-gray-100 text-gray-600"
                              >
                                {item.size || "Unknown Size"}
                              </Badge>
                              {item.options && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {Object.entries(item.options).map(
                                    ([key, value]) => (
                                      <Badge
                                        key={key}
                                        variant="secondary"
                                        className="text-[10px] h-4 px-1.5 font-normal bg-gray-100 text-gray-600"
                                      >
                                        {key}: {value}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border border-gray-200 rounded-lg p-0.5">
                                <button
                                  onClick={() =>
                                    decrementItem({
                                      ...item,
                                      id: item.productId,
                                    })
                                  }
                                  className="p-1 hover:bg-gray-50 rounded text-gray-500 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    incrementItem({
                                      ...item,
                                      id: item.productId,
                                    })
                                  }
                                  className="p-1 hover:bg-gray-50 rounded text-gray-500 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-sm font-black text-gray-900">
                                {(item.price * item.quantity).toLocaleString()} BDT
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>

                <div className="p-6 bg-gray-50 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-gray-900 font-bold">{(subtotal).toLocaleString()} BDT</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">
                        Calculated at checkout
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <div className="text-right">
                        <p className="text-2xl font-black text-gray-900">
                          ${total.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          Including VAT
                        </p>
                      </div>
                    </div>
                  </div>

                  <SheetClose
                    asChild
                    className="w-full h-14 bg-[#88926E] text-white rounded-2xl font-bold text-lg group flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-black/10"
                  >
                    <Link href={"/cart"}>
                      Checkout Now
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link href={"/shop"}>
                      <button className="w-full text-center text-xs text-gray-400 hover:text-gray-900 font-medium transition-colors">
                        Continue Browsing
                      </button>
                    </Link>
                  </SheetClose>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartComponent;
