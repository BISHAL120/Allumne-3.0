"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  BarChart3, 
  Box, 
  CheckCircle2, 
  Layers, 
  Package, 
  ShieldCheck, 
  ShoppingCart, 
  AlertTriangle,
  Users 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Box className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">SmartInventory</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="hidden sm:flex">Log in</Button>
            </Link>
            <Link href="/admin">
              <Button>
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto space-y-8"
            >
              <motion.div variants={fadeIn}>
                <Badge variant="secondary" className="px-3 py-1 text-sm mb-4">
                  v2.0 is now live 🎉
                </Badge>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                  Intelligent <span className="text-primary">Inventory</span> & Order Management
                </h1>
              </motion.div>
              
              <motion.div variants={fadeIn}>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Seamlessly manage products, stock levels, customer orders, and fulfillment workflows with intelligent validation and conflict handling.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link href="/admin">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                    Get Started Now
                  </Button>
                </Link>
                <Link href="#showcase">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                    Explore Features
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="container mx-auto px-4 md:px-6 mt-16 relative"
          >
            <div className="relative rounded-xl border bg-background shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
              <div className="absolute top-0 w-full h-12 bg-muted/50 border-b flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="mx-auto bg-background/80 px-24 py-1 rounded-md text-xs text-muted-foreground font-mono">
                  admin.smartinventory.com
                </div>
              </div>
              <div className="pt-12 p-6 grid grid-cols-4 gap-6 h-full bg-muted/10">
                {/* Mock Sidebar */}
                <div className="col-span-1 border-r pr-4 hidden md:flex flex-col gap-4">
                  <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 bg-muted/50 rounded w-full flex items-center px-3 gap-3">
                      <div className="h-5 w-5 bg-muted rounded-md"></div>
                      <div className="h-4 bg-muted rounded flex-1"></div>
                    </div>
                  ))}
                </div>
                {/* Mock Content */}
                <div className="col-span-4 md:col-span-3 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="h-10 w-32 bg-primary/20 rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-28 bg-card border shadow-sm rounded-xl p-4 flex flex-col justify-between">
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-8 bg-muted rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-64 bg-card border shadow-sm rounded-xl"></div>
                </div>
              </div>
            </div>
            
            {/* Decorative blurs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] -z-10 rounded-full"></div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Powerful Features for Modern Teams</h2>
              <p className="text-lg text-muted-foreground">Everything you need to run your operations smoothly, without the complexity.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Layers className="h-8 w-8 text-primary" />,
                  title: "Product & Category Setup",
                  description: "Organize products into categories, set minimum stock thresholds, and manage availability statuses effortlessly."
                },
                {
                  icon: <ShoppingCart className="h-8 w-8 text-primary" />,
                  title: "Advanced Order Management",
                  description: "Create, update, and track orders. Automatically calculate totals and manage fulfillment workflows from pending to delivered."
                },
                {
                  icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                  title: "Intelligent Conflict Detection",
                  description: "Prevent duplicate entries, block inactive products, and get real-time warnings when requesting quantities exceeding available stock."
                },
                {
                  icon: <AlertTriangle className="h-8 w-8 text-primary" />,
                  title: "Automated Restock Queue",
                  description: "Items falling below threshold are automatically queued by lowest stock priority so you never run out of bestsellers."
                },
                {
                  icon: <BarChart3 className="h-8 w-8 text-primary" />,
                  title: "Real-time Dashboard Insights",
                  description: "Track total orders, pending vs completed fulfillment, revenue, and low stock items all in one comprehensive view."
                },
                {
                  icon: <Users className="h-8 w-8 text-primary" />,
                  title: "Role-based Authentication",
                  description: "Secure access with Email/Password and define roles (Admin/Manager) to ensure your data is protected and correctly accessed."
                }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="h-full border-none shadow-md bg-background/60 backdrop-blur hover:bg-background transition-colors">
                    <CardContent className="p-6 flex flex-col items-start text-left space-y-4">
                      <div className="p-3 bg-primary/10 rounded-2xl">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Deep Dive Showcase */}
        <section id="showcase" className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">Conflict Resolution</Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Never oversell your inventory again.</h2>
                <p className="text-lg text-muted-foreground">
                  Our intelligent stock handling rules work in real-time. If an order is placed, stock is automatically deducted. 
                  If a customer tries to order more than what's available, the system instantly blocks the transaction and warns you.
                </p>
                <ul className="space-y-4 pt-4">
                  {[
                    "Auto-deduction upon order creation",
                    "Insufficient stock warnings & prevention",
                    "Automatic 'Out of Stock' status updates",
                    "Duplicate product prevention in carts"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-base">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border bg-card p-2"
              >
                {/* Simulated Order Form UI */}
                <div className="bg-background rounded-xl border p-6 space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg border-b pb-2 mb-4">Create Order</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-muted rounded"></div>
                        <div className="h-10 w-full bg-muted/50 rounded border flex items-center px-3">
                          <span className="text-sm">John Doe</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted rounded"></div>
                        <div className="p-4 border rounded-md bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900 flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-400">Insufficient Stock</p>
                            <p className="text-xs text-red-600 dark:text-red-300 mt-1">Cannot update. Only 3 items available in stock for iPhone 13.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-md mt-4">
                          <div>
                            <p className="font-medium text-sm">iPhone 13</p>
                            <p className="text-xs text-muted-foreground">$799 each</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-medium bg-muted px-2 py-1 rounded">Qty: 5</span>
                            <span className="text-sm font-bold">$3995</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button disabled className="w-full">Confirm Order</Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Everything you need to know about the product.</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Accordion type="single" collapsible className="w-full text-base">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg">How does the auto-restock queue work?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Whenever a product's stock falls below the minimum threshold you set, the system automatically adds it to the Restock Queue. Items are prioritized (High/Medium/Low) based on how critical their stock level is, ensuring you always know what to order next.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg">Can I track order statuses easily?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Yes! Every order has a distinct status: Pending, Confirmed, Shipped, Delivered, or Cancelled. You can update these statuses in real-time from the dashboard, keeping your team and customers in the loop.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg">Is there role-based access?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Absolutely. The system supports different roles like Admin and Manager, allowing you to restrict sensitive actions (like deleting products or changing global settings) to authorized personnel only.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg">What happens if a customer orders an out-of-stock item?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    The system's intelligent conflict detection prevents it. If a requested quantity exceeds the available stock, the order creation is blocked, and an immediate warning is displayed showing the exact remaining inventory.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10"></div>
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to optimize your inventory?</h2>
              <p className="text-xl text-muted-foreground">
                Join modern businesses managing their orders, avoiding stockouts, and scaling operations with SmartInventory.
              </p>
              <Link href="/admin">
                <Button size="lg" className="h-14 px-8 text-lg mt-4">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground p-1 rounded-md">
                  <Box className="h-4 w-4" />
                </div>
                <span className="font-bold text-lg">SmartInventory</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                A comprehensive web application designed to seamlessly manage products, stock levels, customer orders, and fulfillment workflows.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#showcase" className="hover:text-foreground">Dashboard</Link></li>
                <li><Link href="#faq" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SmartInventory. All rights reserved.</p>
            <p>Built for modern order management.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}