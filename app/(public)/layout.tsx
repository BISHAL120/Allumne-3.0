import CartComponent from "@/components/public/cart-component";
// import Footer3 from "@/components/public/shared/footer/footer3";
// import Navbar2 from "@/components/public/shared/navbar/navbar2";
import WhatsAppButton from "@/components/shared/whatsApp-button";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <TooltipProvider>
        {/* <Navbar /> */}
        {/* <Navbar2 /> */}
        <div className="relative overflow-hidden">
          {children}
          <CartComponent />
          <WhatsAppButton />
        </div>
        {/* <Footer /> */}
        {/* <Footer3 /> */}
      </TooltipProvider>
    </div>
  );
};

export default Layout;
