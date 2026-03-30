import AdminNavbar from "@/components/admin/shared/navbar/navbar";
import { AdminSidebar } from "@/components/admin/shared/adminSidebar/admin-sidebar";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminNavbar />
          <div>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
