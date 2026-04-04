"use client"

import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  BarChart3 
} from "lucide-react"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MetricsOverview({ data }: { 
  data: { 
    totalOrdersToday: number, 
    totalOrdersYesterday: number,
    pendingOrders: number, 
    completedOrders: number, 
    completionRate: number,
    lowStockProducts: number, 
    revenueToday: number,
    revenueYesterday: number
  } 
}) {
  const orderDelta = data.totalOrdersToday - data.totalOrdersYesterday
  const revenueDelta = data.revenueToday - data.revenueYesterday
  const orderTrend = orderDelta >= 0 ? "up" : "down"
  const revenueTrend = revenueDelta >= 0 ? "up" : "down"

  const metrics = [
    {
      title: "Total Orders Today",
      value: data.totalOrdersToday.toString(),
      description: "Orders placed today",
      change: `${orderDelta >= 0 ? "+" : ""}${orderDelta}`,
      trend: orderTrend,
      icon: ShoppingCart,
      footer: "Compared to yesterday",
      subfooter: `${data.totalOrdersYesterday} orders yesterday`
    },
    {
      title: "Pending vs Completed",
      value: `${data.pendingOrders} / ${data.completedOrders}`,
      description: "Orders status",
      change: `${data.completionRate}%`, 
      trend: data.pendingOrders > data.completedOrders ? "down" : "up",
      icon: Users,
      footer: "Completion rate",
      subfooter: "All tracked orders"
    },
    {
      title: "Low Stock Items",
      value: data.lowStockProducts.toString(),
      description: "Items below threshold",
      change: data.lowStockProducts > 0 ? "Needs action" : "Healthy",
      trend: data.lowStockProducts > 0 ? "down" : "up", 
      icon: BarChart3,
      footer: "Requires attention",
      subfooter: "Check restock queue"
    },
    {
      title: "Revenue Today",
      value: `$${data.revenueToday.toLocaleString()}`,
      description: "Total revenue today",
      change: `${revenueDelta >= 0 ? "+" : ""}$${Math.abs(revenueDelta).toLocaleString()}`,
      trend: revenueTrend,
      icon: DollarSign,
      footer: "Compared to yesterday",
      subfooter: `$${data.revenueYesterday.toLocaleString()} yesterday`
    },
  ]

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      {metrics.map((metric) => {
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
        const MetricIcon = metric.icon
        
        return (
          <Card key={metric.title} className=" cursor-pointer">
            <CardHeader>
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metric.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline" className="gap-1">
                  <MetricIcon className="h-4 w-4" />
                  <TrendIcon className="h-4 w-4" />
                  {metric.change}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {metric.footer} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                {metric.subfooter}
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
