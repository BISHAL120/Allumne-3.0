"use client";

import React, { useState } from "react";
import { generateCategories } from "@/lib/seeds/seed-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Sparkles, FolderTree } from "lucide-react";

const GenerateCategories = () => {
  const [categoryCount, setCategoryCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (categoryCount <= 0 || categoryCount > 50) {
      toast.error("Please enter a count between 1 and 50");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading(`Generating ${categoryCount} categories...`);

    try {
      const result = await generateCategories({
        count: categoryCount,
      });

      if (result) {
        toast.success(`Successfully generated ${categoryCount} categories`, {
          id: loadingToast,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate categories";
      toast.error(message, {
        id: loadingToast,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="shadow-lg border-2 border-primary/10">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <FolderTree className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Category Generator</CardTitle>
          <CardDescription>
            Quickly generate categories for your store catalog.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category-count" className="text-sm font-medium">
              Number of Categories
            </Label>
            <Input
              id="category-count"
              type="number"
              min={1}
              max={50}
              value={categoryCount}
              onChange={(e) => setCategoryCount(parseInt(e.target.value) || 0)}
              className="w-full"
            />
            <p className="text-[10px] text-muted-foreground">
              Enter a value between 1 and 50.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Categories
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <FolderTree className="w-4 h-4" />
          Generation Details
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
          <li>Categories will be assigned random names and slugs.</li>
          <li>Each category will have a sample description and image.</li>
          <li>Meta information will be automatically generated.</li>
          <li>Featured status will be randomly assigned to some categories.</li>
        </ul>
      </div>
    </div>
  );
};

export default GenerateCategories;
