"use client";

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
import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { generateProducts } from "@/lib/seeds/seed-products";
import {
  Loader2,
  Search,
  Sparkles,
  FolderTree,
  X,
  Check,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

interface GeneratedProduct {
  productName: string;
  slug: string;
  thumbnail: string;
  totalStock: number;
  variants: {
    price: number;
  }[];
}

interface GenerateProductsProps {
  categories: Category[];
}

const GenerateProducts = ({ categories }: GenerateProductsProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [productCount, setProductCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [generatedProducts, setGeneratedProducts] = useState<
    GeneratedProduct[]
  >([]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const filteredCategories = categories
    .filter((cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const handleGenerate = async () => {
    if (!selectedCategoryId) {
      toast.error("Please select a category");
      return;
    }

    if (productCount <= 0 || productCount > 50) {
      toast.error("Please enter a count between 1 and 50");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading(
      `Generating ${productCount} products...`,
    );

    try {
      const result = (await generateProducts({
        categoryId: selectedCategoryId,
        count: productCount,
      })) as GeneratedProduct[];

      if (result) {
        setGeneratedProducts(result);
        toast.success(`Successfully generated ${productCount} products`, {
          id: loadingToast,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate products";
      toast.error(message, {
        id: loadingToast,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="shadow-lg border-2 border-primary/10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/50 via-primary to-primary/50" />
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 w-14 h-14 flex items-center justify-center mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">
            Product Factory
          </CardTitle>
          <CardDescription className="text-balance">
            Generate high-quality mock products for your catalog in seconds.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 bg-primary/10 text-primary text-[10px]">
                1
              </span>
              Target Category
            </Label>

            <Combobox
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
              onInputValueChange={setSearchQuery}
            >
              <div className="relative group">
                <ComboboxChips className="min-h-14 w-full border-2 border-primary/10 bg-muted/20 px-4 py-2 transition-all focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/30 overflow-hidden group">
                  <AnimatePresence mode="popLayout">
                    {selectedCategory && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        key="selected-chip"
                      >
                        <ComboboxChip
                          showRemove={false}
                          className="bg-primary text-primary-foreground font-bold px-4 py-1.5 h-auto flex items-center gap-2 shadow-lg shadow-primary/20 border-none group/chip"
                        >
                          <FolderTree className="w-3.5 h-3.5" />
                          <span>{selectedCategory.name}</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedCategoryId(null);
                            }}
                            className="-mr-2 hover:bg-white/20 p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </ComboboxChip>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <ComboboxChipsInput
                    disabled={selectedCategory !== undefined}
                    placeholder={
                      !selectedCategory ? "Search and select category..." : ""
                    }
                    className={`text-base font-medium placeholder:text-muted-foreground/50 h-full py-2 ${selectedCategory ? "ml-4" : "ml-0"}`}
                  />
                </ComboboxChips>
              </div>

              <ComboboxContent className="z-100 min-w-(--anchor-width) p-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-primary/10 bg-popover/95 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-4 duration-300">
                <div className="px-3 py-2 mb-2 border-b border-primary/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">
                    {searchQuery ? "Search Results" : "Available Categories"}
                  </p>
                </div>
                <ComboboxList className="space-y-1">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <ComboboxItem
                        key={category.id}
                        value={category.id}
                        className="py-3 px-4 flex flex-col items-start gap-1 transition-all hover:bg-primary/5 data-highlighted:bg-primary/10 data-selected:bg-primary/20 group relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-sm tracking-tight group-data-selected:text-primary">
                            {category.name}
                          </span>
                          {selectedCategoryId === category.id && (
                            <motion.div
                              layoutId="active-check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="bg-primary/10 p-1"
                            >
                              <Check className="w-3 h-3 text-primary" />
                            </motion.div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-[9px] py-0 px-1.5 font-mono text-muted-foreground/60 border-primary/5 group-data-highlighted:border-primary/20"
                          >
                            #{category.id.slice(-6)}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground/50 italic font-medium">
                            /{category.slug}
                          </span>
                        </div>
                        {/* Hover decoration */}
                        <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-data-highlighted:opacity-100 transition-opacity" />
                      </ComboboxItem>
                    ))
                  ) : (
                    <ComboboxEmpty className="py-12">
                      <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="bg-muted w-16 h-16 flex items-center justify-center shadow-inner"
                        >
                          <Search className="w-7 h-7 opacity-20" />
                        </motion.div>
                        <div className="text-center px-6">
                          <p className="font-bold text-sm text-foreground/80">
                            No categories found
                          </p>
                          <p className="text-xs opacity-60 mt-1 leading-relaxed">
                            Try searching for something else or create a new
                            category first.
                          </p>
                        </div>
                      </div>
                    </ComboboxEmpty>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <div className="space-y-4">
            <Label
              htmlFor="product-count"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"
            >
              <span className="flex items-center justify-center w-5 h-5 bg-primary/10 text-primary text-[10px]">
                2
              </span>
              Product Quantity
            </Label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1 group">
                <Input
                  id="product-count"
                  type="number"
                  min={1}
                  max={50}
                  value={productCount}
                  onChange={(e) =>
                    setProductCount(parseInt(e.target.value) || 0)
                  }
                  className="w-full h-12 text-xl font-black text-center sm:text-left pr-16 bg-muted/20 border-primary/10 focus-visible:ring-primary/20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold pointer-events-none text-xs bg-primary/5 px-2 py-1">
                  ITEMS
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center px-4 py-2 sm:p-0 bg-muted/30 sm:bg-transparent text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-500" />
                  Recommended: 10-20
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-red-500" />
                  Max Limit: 50
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2 bg-muted/5">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedCategoryId}
            className="w-full h-14 text-lg font-black transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            {isGenerating ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="animate-pulse">Building Your Store...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <span>Fire Up The Generator</span>
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Generated Product List */}
      <AnimatePresence>
        {generatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6 pt-8 border-t border-primary/10"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  Latest Batch
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Newly minted products in your catalog
                </p>
              </div>
              <Badge
                variant="outline"
                className="px-4 py-1.5 font-bold bg-primary/5 border-primary/20 text-primary"
              >
                {generatedProducts.length} Items Created
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {generatedProducts.map((product, idx) => (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-card hover:bg-muted/30 transition-all border border-primary/5 hover:border-primary/20 p-3 flex items-center gap-4 relative overflow-hidden"
                >
                  <div className="relative w-16 h-16 overflow-hidden shrink-0 bg-muted shadow-inner border border-primary/5">
                    <img
                      src={product.thumbnail}
                      alt={product.productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-bold text-sm truncate">
                        {product.productName}
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-[9px] py-0 px-1 bg-muted/50 font-mono opacity-60"
                      >
                        {product.slug.split("-")[0]}...
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                          Stock:{" "}
                          <span className="text-foreground">
                            {product.totalStock}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-primary/10 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-primary">
                            $
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                          Starts at:{" "}
                          <span className="text-primary">
                            ${product.variants[0].price}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 pr-2">
                    <div className="bg-primary/10 p-2">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  {/* Shimmer on hover */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                </motion.div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setGeneratedProducts([])}
              className="w-full border-dashed border-2 hover:border-primary/30 hover:bg-primary/5 h-12 font-bold text-muted-foreground hover:text-primary transition-all"
            >
              Clear Batch History
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: "Variants",
            desc: "2 variants per product (Small & Large)",
            icon: "📐",
          },
          {
            title: "Inventory",
            desc: "Randomized stock levels (5-100)",
            icon: "📦",
          },
          {
            title: "Pricing",
            desc: "Smart random pricing by size",
            icon: "💰",
          },
          {
            title: "Ownership",
            desc: "Linked to your current profile",
            icon: "👤",
          },
        ].map((feat, i) => (
          <div
            key={i}
            className="bg-card hover:bg-muted/50 transition-colors p-4 border border-border/50 flex items-start gap-4 group"
          >
            <div className="text-2xl grayscale group-hover:grayscale-0 transition-all">
              {feat.icon}
            </div>
            <div className="space-y-1">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                {feat.title}
              </h5>
              <p className="text-xs text-muted-foreground font-medium leading-tight">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerateProducts;
