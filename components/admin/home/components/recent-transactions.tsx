"use client"

import { Activity, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

export interface ActivityLogItem {
  id: string;
  action: string;
  description: string;
  createdAt: string | Date;
  user: {
    name: string;
  } | null;
}

export function RecentTransactions({ activities }: { activities: ActivityLogItem[] }) {
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
        {activities && activities.length > 0 ? activities.map((activity) => (
          <div key={activity.id} >
            <div className="flex p-3 rounded-lg border gap-3 items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex flex-1 items-center flex-wrap justify-between gap-1">
                <div className="flex items-center space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">By {activity.user?.name || "System"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</p>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No recent activity found.
          </div>
        )}
      </CardContent>
    </Card>
  )
}