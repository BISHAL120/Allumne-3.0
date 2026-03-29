"use client";

import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Home,
  MapPinOff,
  PackageOpen,
  Search,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

const NotFoundPage = ({
  firstLink,
  firstText,
  secondLink,
}: {
  firstLink: string;
  firstText: string;
  secondLink?: string;
}) => {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden text-center">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div
          className="absolute top-[10%] left-[10%] w-20 h-20 bg-muted rounded-full opacity-50 animate-bounce"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute bottom-[10%] right-[10%] w-32 h-32 bg-primary/5 rounded-full opacity-50 animate-pulse"
          style={{ animationDuration: "4s" }}
        />

        {/* Floating Icons */}
        <ShoppingBag className="absolute top-[20%] right-[20%] text-muted-foreground/10 w-12 h-12 -rotate-12 animate-[pulse_4s_ease-in-out_infinite]" />
        <Search className="absolute bottom-[20%] left-[20%] text-muted-foreground/10 w-16 h-16 rotate-12 animate-[bounce_5s_infinite]" />
      </div>

      <div className="max-w-md mx-auto space-y-8 relative z-10">
        {/* 404 Illustration */}
        <div className="relative h-48 w-48 mx-auto flex items-center justify-center">
          {/* Animated Circles */}
          <div className="absolute inset-0 border-4 border-dashed border-muted-foreground/20 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-4 border-4 border-dashed border-primary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

          {/* Central Icon */}
          <div className="relative z-10 bg-background p-4 rounded-full shadow-xl border-2 border-muted">
            <PackageOpen className="w-20 h-20 text-muted-foreground" />
            <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-1.5 rounded-full border-4 border-background animate-bounce">
              <MapPinOff className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-muted-foreground/40 to-muted-foreground/10 select-none">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Oops! This shelf is empty.
          </h2>
          <p className="text-muted-foreground">
            The page or product you&apos;re looking for seems to have been
            moved, deleted, or never existed in our inventory.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <Button
            asChild
            variant="default"
            size="lg"
            className="w-full sm:w-auto gap-2 group"
          >
            <Link href={firstLink}>
              <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              Back to {firstText}
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2 group"
          >
            <Link href={secondLink || "/contact"}>
              <HelpCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Contact Support
            </Link>
          </Button>
        </div>

        {/* Search Suggestion (Optional Micro-interaction) */}
        <div className="pt-8 animate-in fade-in duration-1000 delay-500">
          <p className="text-xs text-muted-foreground mb-2">
            Still can’t find what you need?
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["New Arrivals", "Best Sellers", "Sale", "Gift Cards"].map(
              (label) => (
                <Link
                  key={label}
                  href={`/${label.toLowerCase().replace(" ", "-")}`}
                  className="px-4 py-2 rounded-full border bg-muted/30 hover:bg-primary/10 hover:border-primary transition-colors text-sm text-muted-foreground hover:text-primary"
                >
                  {label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
