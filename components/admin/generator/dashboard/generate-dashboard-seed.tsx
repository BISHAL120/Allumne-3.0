"use client";

import { useMemo, useState } from "react";
import { Loader2, Play, BarChart3, Database } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  generateDashboardDummyData,
  type DashboardSeedSummary,
} from "@/lib/seeds/seed-dashboard-action";

type SeedFormState = {
  customerCount: number;
  productCount: number;
  historicOrderCount: number;
  todayOrderCount: number;
};

const defaultState: SeedFormState = {
  customerCount: 20,
  productCount: 6,
  historicOrderCount: 50,
  todayOrderCount: 5,
};

export default function GenerateDashboardSeed() {
  const [form, setForm] = useState<SeedFormState>(defaultState);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<DashboardSeedSummary | null>(null);

  const totalSeededOrders = useMemo(() => {
    if (!summary) return 0;
    return summary.ordersCreated + summary.todayOrdersCreated;
  }, [summary]);

  const handleGenerate = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("Generating dashboard dummy data...");

    try {
      const result = await generateDashboardDummyData(form);
      setSummary(result);
      toast.success("Dashboard dummy data generated successfully", {
        id: loadingToast,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate data";
      toast.error(message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const setValue = (key: keyof SeedFormState, value: number) => {
    setForm((prev) => ({ ...prev, [key]: Number.isNaN(value) ? 0 : value }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Database className="h-6 w-6 text-primary" />
            Dashboard Seed Generator
          </CardTitle>
          <CardDescription>
            Generate dummy customers, products, and orders for admin dashboard analytics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customer-count">Customers</Label>
              <Input
                id="customer-count"
                type="number"
                min={1}
                max={100}
                value={form.customerCount}
                onChange={(e) => setValue("customerCount", parseInt(e.target.value, 10))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-count">Products</Label>
              <Input
                id="product-count"
                type="number"
                min={1}
                max={50}
                value={form.productCount}
                onChange={(e) => setValue("productCount", parseInt(e.target.value, 10))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="historic-orders">Historic Orders</Label>
              <Input
                id="historic-orders"
                type="number"
                min={1}
                max={300}
                value={form.historicOrderCount}
                onChange={(e) =>
                  setValue("historicOrderCount", parseInt(e.target.value, 10))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="today-orders">Today Orders</Label>
              <Input
                id="today-orders"
                type="number"
                min={1}
                max={100}
                value={form.todayOrderCount}
                onChange={(e) => setValue("todayOrderCount", parseInt(e.target.value, 10))}
              />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Generate Dashboard Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Seed Result Visualization
            </CardTitle>
            <CardDescription>
              Snapshot of the generated data used by your dashboard analytics.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">{summary.customersCreated}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Products</p>
                <p className="text-2xl font-bold">{summary.productsCreated}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold">{totalSeededOrders}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${summary.revenueGenerated.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold">Order Status Distribution</p>
              {summary.statusBreakdown.map((item) => {
                const percentage =
                  totalSeededOrders > 0
                    ? Math.round((item.count / totalSeededOrders) * 100)
                    : 0;

                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.status}</Badge>
                        <span>{item.count} orders</span>
                      </div>
                      <span className="text-muted-foreground">{percentage}%</span>
                    </div>
                    <Progress value={percentage} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
