"use client"

import { useState } from "react"
import { Plus, Save, Trash2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import PageTitle from "../../shared/pageTittle"

// Mock inventory data
const inventory = [
  { id: "1", name: "iPhone 13", price: 799, stock: 3, status: "active" },
  { id: "2", name: "MacBook Pro M2", price: 1299, stock: 0, status: "inactive" },
  { id: "3", name: "AirPods Pro", price: 249, stock: 15, status: "active" },
  { id: "4", name: "Apple Watch", price: 199, stock: 5, status: "active" },
  { id: "5", name: "Discontinued Case", price: 19, stock: 100, status: "inactive" },
]

export default function CreateOrder() {
  const [customerName, setCustomerName] = useState("")
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleAddItem = () => {
    setError(null)
    setSuccessMessage(null)

    if (!selectedProduct) {
      setError("Please select a product.")
      return
    }

    const product = inventory.find(p => p.id === selectedProduct)
    if (!product) return

    // Conflict: Inactive Product
    if (product.status !== "active") {
      setError("This product is currently unavailable (inactive).")
      return
    }

    // Conflict: Duplicate Product
    if (orderItems.some(item => item.productId === selectedProduct)) {
      setError("This product is already added to the order.")
      return
    }

    // Conflict: Out of stock / insufficient
    if (product.stock === 0) {
      setError("This product is out of stock.")
      return
    }

    if (selectedQuantity > product.stock) {
      setError(`Only ${product.stock} items available in stock.`)
      return
    }

    if (selectedQuantity <= 0) {
      setError("Quantity must be at least 1.")
      return
    }

    setOrderItems([...orderItems, { productId: selectedProduct, quantity: selectedQuantity }])
    setSelectedProduct("")
    setSelectedQuantity(1)
  }

  const handleRemoveItem = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId))
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setError(null)
    const product = inventory.find(p => p.id === productId)
    if (!product) return

    if (newQuantity > product.stock) {
      setError(`Cannot update. Only ${product.stock} items available in stock for ${product.name}.`)
      return
    }

    setOrderItems(orderItems.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = inventory.find(p => p.id === item.productId)
      return total + (product ? product.price * item.quantity : 0)
    }, 0)
  }

  const handleCreateOrder = () => {
    setError(null)
    setSuccessMessage(null)

    if (!customerName.trim()) {
      setError("Customer name is required.")
      return
    }

    if (orderItems.length === 0) {
      setError("Please add at least one item to the order.")
      return
    }

    // Final validation before confirmation
    for (const item of orderItems) {
      const product = inventory.find(p => p.id === item.productId)
      if (!product || item.quantity > product.stock) {
        setError(`Insufficient stock for ${product?.name || "an item"}. Cannot confirm order.`)
        return
      }
    }

    setSuccessMessage("Order created successfully! Stock would be deducted here.")
    setOrderItems([])
    setCustomerName("")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageTitle title="Create New Order" description="Add products and create a manual order with conflict detection" />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Items Form */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Add Product</CardTitle>
            <CardDescription>Select a product and quantity to add to the order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.stock} in stock)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input 
                type="number" 
                min="1" 
                value={selectedQuantity} 
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 0)}
              />
            </div>

            <Button onClick={handleAddItem} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add to Order
            </Button>
          </CardContent>
        </Card>

        {/* Order Summary & Customer Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input 
                placeholder="Enter customer name" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2 block">Order Items</Label>
              {orderItems.length === 0 ? (
                <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-md text-center">
                  No items added yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item, index) => {
                    const product = inventory.find(p => p.id === item.productId)
                    if (!product) return null
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${product.price} each</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Qty:</Label>
                            <Input 
                              type="number" 
                              min="1" 
                              className="w-16 h-8"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                            />
                          </div>
                          <p className="font-medium w-20 text-right">${product.price * item.quantity}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg">${calculateTotal()}</span>
                  </div>
                </div>
              )}
            </div>

            <Button onClick={handleCreateOrder} className="w-full" size="lg">
              <Save className="w-4 h-4 mr-2" />
              Confirm & Create Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}