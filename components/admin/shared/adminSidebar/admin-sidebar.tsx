"use client";

import {
  AudioWaveform,
  BoxIcon,
  Brush,
  ChartColumnBig,
  Command,
  Database,
  FileMinus,
  Frame,
  GalleryVerticalEnd,
  ListOrdered,
  Map,
  Package,
  PieChart,
  PlusSquare,
  ShieldAlertIcon,
  TrafficCone,
  Trash2,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/admin/shared/adminSidebar/nav-main";
import { NavUser } from "@/components/admin/shared/adminSidebar/nav-user";
import { TeamSwitcher } from "@/components/admin/shared/adminSidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  teams: [
    {
      name: "Smart Inventory Art",
      logo: Command,
      plan: "Startup",
      url: "/admin",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Enterprise",
    },
    {
      name: "Evil Corp.",
      logo: GalleryVerticalEnd,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Orders",
      url: "#",
      icon: BoxIcon,
      items: [
        {
          title: "Create Order",
          url: "/admin/orders/create",
        },
        {
          title: "New Orders",
          url: "/admin/orders/new",
        },
        {
          title: "Processing Orders",
          url: "/admin/orders/processing",
        },
        {
          title: "All Orders",
          url: "/admin/orders",
        },
      ],
    },
    {
      title: "Categories",
      url: "#",
      icon: Database,
      items: [
        {
          title: "New Category",
          url: "/admin/categories/id",
        },
        {
          title: "All Categories",
          url: "/admin/categories",
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: Package,
      isActive: false,
      items: [
        { title: "Add Product", url: "/admin/products/add", icon: PlusSquare },
        { title: "All Products", url: "/admin/products", icon: ListOrdered },
        {
          title: "Restock Queue",
          url: "/admin/products/restock",
          icon: ShieldAlertIcon,
        },
        {
          title: "Pending Products",
          url: "/admin/products/pending",
          icon: FileMinus,
        },
        {
          title: "Draft Products",
          url: "/admin/products/drafts",
          icon: TrafficCone,
        },
        {
          title: "Deleted Products",
          url: "/admin/products/deleted",
          icon: Trash2,
        },
      ],
    },
    {
      title: "Permissions",
      url: "#",
      icon: ShieldAlertIcon,
      items: [
        {
          title: "All Users",
          url: "/admin/permissions",
        },
        /* {
          title: "Create Users",
          url: "/admin/users/add",
        }, */
      ],
    },
  ],
  Reports: [
    {
      name: "Sales Reports",
      url: "/admin/reports/sales",
      icon: Frame,
    },
    {
      name: "Artist Reports",
      url: "/admin/reports/artist",
      icon: Brush,
    },
    {
      name: "Store Reports",
      url: "/admin/reports/store",
      icon: PieChart,
    },
    {
      name: "Subscriptions Reports",
      url: "/admin/reports/subscriptions",
      icon: Map,
    },
    {
      name: "Commission Reports",
      url: "/admin/reports/commission",
      icon: ChartColumnBig,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
