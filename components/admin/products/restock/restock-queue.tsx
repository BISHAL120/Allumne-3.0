"use client"

import { useState, useEffect } from "react"
import { Package, Plus, Trash2, AlertTriangle, AlertCircle, Info, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import PageTitle from "../../shared/pageTittle"
import { getLowStockProducts, restockProduct } from "@/lib/actions/restock-queue"
import { toast } from "sonner"

interface QueueItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  threshold: number;
  category: string;
  priority: string;
}

export default function RestockQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [restockAmounts, setRestockAmounts] = useState<Record<string, number>>({})
  const [isRestocking, setIsRestocking] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchQueue()
  }, [])

  const fetchQueue = async () => {
    try {
      setIsLoading(true)
      const result = await getLowStockProducts()
      if (result.success && result.queue) {
        setQueue(result.queue)
      } else {
        toast.error(result.error || "Failed to load restock queue")
      }
    } catch (error) {
      toast.error("Something went wrong loading the queue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestockAmountChange = (id: string, amount: string) => {
    const val = parseInt(amount, 10)
    if (!isNaN(val) && val > 0) {
      setRestockAmounts((prev) => ({ ...prev, [id]: val }))
    } else {
      const newAmounts = { ...restockAmounts }
      delete newAmounts[id]
      setRestockAmounts(newAmounts)
    }
  }

  const handleRestock = async (id: string) => {
    const amount = restockAmounts[id]
    if (!amount) return

    try {
      setIsRestocking((prev) => ({ ...prev, [id]: true }))
      const result = await restockProduct(id, amount)

      if (result.success) {
        toast.success(`Successfully restocked ${amount} items`)
        
        // Remove item from queue once restocked if it's now above threshold
        // Or we could just refetch the queue to be accurate
        const item = queue.find(q => q.id === id)
        if (item && (item.currentStock + amount > item.threshold || 10)) {
           setQueue((prev) => prev.filter((i) => i.id !== id))
        } else {
           // If it's still below threshold after restock, just update the stock in UI
           setQueue((prev) => prev.map(i => i.id === id ? { ...i, currentStock: i.currentStock + amount } : i))
        }
        
        // Clear the input
        const newAmounts = { ...restockAmounts }
        delete newAmounts[id]
        setRestockAmounts(newAmounts)
      } else {
        toast.error(result.error || "Failed to restock product")
      }
    } catch (error) {
      toast.error("Something went wrong restocking the product")
    } finally {
      setIsRestocking((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleRemove = (id: string) => {
    // In a real app, this might dismiss the alert or ignore it temporarily.
    // Here we just remove it from the local UI state.
    setQueue((prev) => prev.filter((item) => item.id !== id))
    toast.info("Removed from current queue view")
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return <AlertTriangle className="w-4 h-4 text-destructive mr-1" />
      case "Medium":
        return <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
      case "Low":
        return <Info className="w-4 h-4 text-blue-500 mr-1" />
      default:
        return null
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageTitle title="Restock Queue" description="Manage products with low stock" />

      <Card>
        <CardHeader>
          <CardTitle>Low Stock Management</CardTitle>
          <CardDescription>Items below their minimum stock threshold. Ordered by lowest stock first.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : queue.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-12 w-12 mb-4 text-muted" />
              <p>No items currently need restocking. Inventory is healthy.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Info</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Restock Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queue.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                          <Badge variant="outline" className="mt-1 text-[10px]">
                            {item.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={`font-semibold ${item.currentStock === 0 ? "text-destructive" : ""}`}>
                            {item.currentStock} in stock
                          </span>
                          <span className="text-xs text-muted-foreground">Threshold: {item.threshold}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(item.priority)} className="flex w-fit items-center">
                          {getPriorityIcon(item.priority)}
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          placeholder="Qty"
                          className="w-24 h-8"
                          min="1"
                          value={restockAmounts[item.id] || ""}
                          onChange={(e) => handleRestockAmountChange(item.id, e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleRestock(item.id)}
                            disabled={!restockAmounts[item.id] || isRestocking[item.id]}
                          >
                            {isRestocking[item.id] ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <Plus className="w-4 h-4 mr-1" />
                            )}
                            Restock
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemove(item.id)}
                            disabled={isRestocking[item.id]}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}