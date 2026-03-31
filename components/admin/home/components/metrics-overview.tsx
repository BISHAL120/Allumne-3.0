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

const metrics = [
  {
    title: "Total Orders Today",
    value: "142",
    description: "Orders placed today",
    change: "+12%",
    trend: "up",
    icon: ShoppingCart,
    footer: "Trending up this week",
    subfooter: "Compared to yesterday"
  },
  {
    title: "Pending vs Completed",
    value: "45 / 97",
    description: "Orders status",
    change: "68% Done", 
    trend: "up",
    icon: Users,
    footer: "Processing speed is good",
    subfooter: "Average fulfillment: 2h"
  },
  {
    title: "Low Stock Items",
    value: "12",
    description: "Items below threshold",
    change: "-3",
    trend: "down", 
    icon: BarChart3,
    footer: "Down 3 items today",
    subfooter: "Check restock queue"
  },
  {
    title: "Revenue Today",
    value: "$4,230",
    description: "Total revenue today",
    change: "+8.3%",
    trend: "up",
    icon: DollarSign,
    footer: "Steady performance",
    subfooter: "Meets daily projections"
  },
]

export function MetricsOverview() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      {metrics.map((metric) => {
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
        
        return (
          <Card key={metric.title} className=" cursor-pointer">
            <CardHeader>
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metric.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
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