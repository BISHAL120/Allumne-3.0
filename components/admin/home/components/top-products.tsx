"use client"

import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TopProducts({ data }: { data: { id: string, name: string, stock: number, status: string, category: string }[] }) {
  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Inventory Alerts</CardTitle>
          <CardDescription>Lowest stock products from your catalog</CardDescription>
        </div>
        <AlertTriangle className="h-5 w-5 text-amber-500" />
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((product) => (
          <div key={product.id} className="flex items-center p-3 rounded-lg border gap-2">
            <div className="flex gap-2 items-center justify-between space-x-3 flex-1 flex-wrap">
              <div className="">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{product.stock} left</span>
                  <Badge
                    variant={product.status === "OK" ? "default" : product.status === "Low Stock" ? "secondary" : "destructive"}
                    className="cursor-pointer"
                  >
                    {product.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
