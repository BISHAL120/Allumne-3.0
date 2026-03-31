"use client"

import { Eye, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const products = [
  {
    id: 1,
    name: "iPhone 13",
    stock: 3,
    status: "Low Stock",
    category: "Electronics",
  },
  {
    id: 2,
    name: "T-Shirt",
    stock: 20,
    status: "OK",
    category: "Clothing",
  },
  {
    id: 3,
    name: "MacBook Pro M2",
    stock: 0,
    status: "Out of Stock",
    category: "Electronics",
  },
  {
    id: 4,
    name: "Wireless Headphones",
    stock: 45,
    status: "OK",
    category: "Accessories",
  },
  {
    id: 5,
    name: "Nike Sneakers",
    stock: 4,
    status: "Low Stock",
    category: "Footwear",
  },
]

export function TopProducts() {
  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Product Summary</CardTitle>
          <CardDescription>Current inventory status overview</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Eye className="h-4 w-4 mr-2" />
          View Inventory
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product, index) => (
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