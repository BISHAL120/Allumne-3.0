"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, Repeat, DollarSign } from "lucide-react"

const chartConfig = {
  newCustomers: {
    label: "New Customers",
    color: "var(--chart-1)",
  },
  repeatCustomers: {
    label: "Repeat Customers",
    color: "var(--chart-2)",
  },
  activeCustomers: {
    label: "Active Customers",
    color: "var(--chart-3)",
  },
}

export function CustomerInsights({
  data,
}: {
  data: {
    trend: { month: string; newCustomers: number; repeatCustomers: number; activeCustomers: number }[]
    summary: { totalCustomers: number; repeatRate: number; avgOrderValue: number }
  }
}) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Customer Insights</CardTitle>
        <CardDescription>Customer growth and retention analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-10 gap-6">
            <div className="col-span-10 xl:col-span-7">
              <h3 className="text-sm font-medium text-muted-foreground mb-6">Monthly customer activity</h3>
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <BarChart data={data.trend} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis className="text-xs" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="newCustomers" fill="var(--color-newCustomers)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="repeatCustomers" fill="var(--color-repeatCustomers)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="activeCustomers" fill="var(--color-activeCustomers)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
            <div className="col-span-10 xl:col-span-3 space-y-4">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total Customers</span>
                </div>
                <div className="text-2xl font-bold">{data.summary.totalCustomers.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Repeat className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Repeat Customer Rate</span>
                </div>
                <div className="text-2xl font-bold">{data.summary.repeatRate}%</div>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Avg Order Value</span>
                </div>
                <div className="text-2xl font-bold">${data.summary.avgOrderValue.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
