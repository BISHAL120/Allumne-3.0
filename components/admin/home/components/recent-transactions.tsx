"use client"

import { Activity, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const activities = [
  {
    id: "ACT-001",
    action: "Order #1023 marked as Shipped",
    user: "System",
    time: "11:00 AM",
    type: "order",
  },
  {
    id: "ACT-002",
    action: "Product 'Headphone' added to Restock Queue",
    user: "System",
    time: "10:30 AM",
    type: "inventory",
  },
  {
    id: "ACT-003",
    action: "Stock updated for 'iPhone 13'",
    user: "Admin User",
    time: "10:20 AM",
    type: "inventory",
  },
  {
    id: "ACT-004",
    action: "Order #1023 created by user",
    user: "Customer",
    time: "10:15 AM",
    type: "order",
  },
  {
    id: "ACT-005",
    action: "Category 'Electronics' created",
    user: "Manager",
    time: "09:00 AM",
    type: "category",
  },
]

export function RecentTransactions() {
  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Recent system actions and updates</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Activity className="h-4 w-4 mr-2" />
          View Log
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} >
            <div className="flex p-3 rounded-lg border gap-3 items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex flex-1 items-center flex-wrap justify-between gap-1">
                <div className="flex items-center space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">By {activity.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}