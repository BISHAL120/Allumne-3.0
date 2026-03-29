"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ArrowRight,
    CheckCircle2,
    CreditCard,
    Loader2,
    Mail,
    ShoppingBag,
    Store,
    TrendingUp
} from "lucide-react";
import React, { useState } from "react";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const [mounted, setMounted] = useState(true);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsNotified(true);
      setEmail("");
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[20%] right-[10%] w-4 h-4 rounded-full bg-yellow-400/20 animate-bounce" style={{ animationDuration: "3s" }} />
        <div className="absolute bottom-[20%] left-[10%] w-6 h-6 rounded-full bg-primary/10 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }} />
      </div>

      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Content */}
        <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
          <div className="flex justify-center lg:justify-start">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium rounded-full border-primary/20 bg-primary/10 text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Work in Progress
            </Badge>
          </div>
          
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Building the Future of <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">
                E-Commerce
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
              We&apos;re crafting a powerful multivendor platform for artists and creators. 
              Get ready for a seamless dashboard, advanced analytics, and a beautiful storefront.
            </p>
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            {isNotified ? (
              <div className="flex items-center justify-center lg:justify-start gap-2 p-4 bg-green-500/10 text-green-600 rounded-lg border border-green-500/20">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">You&apos;re on the list! We&apos;ll notify you soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-50" />
                  <Input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="pl-9 h-11 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Notify Me
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            )}
            <p className="text-xs text-muted-foreground mt-3 text-center lg:text-left">
              Join 2,000+ creators waiting for launch. No spam, ever.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Illustration */}
        <div className="relative order-1 lg:order-2 flex items-center justify-center animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="relative w-full max-w-125 aspect-square">
            {/* Main Circle Background */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-blue-500/5 rounded-full animate-pulse" style={{ animationDuration: "8s" }} />
            
            {/* Floating Elements Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Central Store/Dashboard Icon */}
              <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 bg-card rounded-2xl shadow-2xl border flex items-center justify-center transform hover:scale-105 transition-transform duration-500 group">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Store className="w-16 h-16 md:w-20 md:h-20 text-primary drop-shadow-sm" />
                
                {/* Small notification badge on store */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-2 border-background flex items-center justify-center animate-bounce">
                  <span className="text-[10px] font-bold text-white">1</span>
                </div>
              </div>

              {/* Orbiting Elements */}
              {/* Element 1: Shopping Bag */}
              <div className="absolute top-1/4 left-0 md:left-10 bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-lg border animate-[bounce_3s_infinite] hover:pause">
                <ShoppingBag className="w-6 h-6 text-orange-500" />
              </div>

              {/* Element 2: Credit Card */}
              <div className="absolute bottom-1/4 right-0 md:right-10 bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-lg border animate-[bounce_4s_infinite] delay-700 hover:pause">
                <CreditCard className="w-6 h-6 text-blue-500" />
              </div>

              {/* Element 3: Analytics Chart */}
              <div className="absolute bottom-10 left-1/3 bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-lg border animate-[bounce_5s_infinite] delay-1000 hover:pause">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>

              {/* SVG Connecting Lines (Decorative) */}
              <svg className="absolute inset-0 w-full h-full -z-10 opacity-20" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8 8" className="animate-[spin_20s_linear_infinite]" />
                <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/30" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer / Copyright */}
      <div className="absolute bottom-4 left-0 w-full text-center text-xs text-muted-foreground opacity-60">
        &copy; {new Date().getFullYear()} Wallora Inc. All rights reserved.
      </div>
    </div>
  );
};

export default ComingSoon;
