"use client";

import {
  AudioWaveform,
  BadgeDollarSignIcon,
  BoxIcon,
  Brush,
  ChartColumnBig,
  Command,
  Database,
  FileMinus,
  Frame,
  GalleryVerticalEnd,
  HandHelping,
  ListOrdered,
  Map,
  Package,
  PieChart,
  PlusSquare,
  Rocket,
  Settings,
  Settings2,
  ShieldAlertIcon,
  Store,
  TrafficCone,
  Trash2,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/admin/shared/adminSidebar/nav-main";
import { NavProjects } from "@/components/admin/shared/adminSidebar/nav-projects";
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
      name: "Wallora Art",
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
      title: "Store's",
      url: "#",
      icon: Store,
      items: [
        {
          title: "New Store",
          url: "/admin/store/new",
        },
        {
          title: "All Stores",
          url: "/admin/store",
        },
      ],
    },
    /* {
      title: "Campain's",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "All Campains",
          url: "/admin/campaign",
        },
        {
          title: "Add New",
          url: "/admin/campaign/add",
        },
      ],
    }, */
    /* {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/admin/settings/general",
        },
        {
          title: "Store's",
          url: "/admin/settings/store",
        },
        {
          title: "Billing",
          url: "/admin/settings/billing",
        },
        {
          title: "Limits",
          url: "/admin/settings/limits",
        },
      ],
    }, */
    {
      title: "Promotions",
      url: "#",
      icon: Rocket,
      items: [
        {
          title: "All Promotions",
          url: "/admin/promotions",
        },
        {
          title: "Pending Promotions",
          url: "/admin/promotions/pending",
        },
      ],
    },
    {
      title: "Carousels",
      url: "#",
      icon: Rocket,
      items: [
        {
          title: "Create Carousels",
          url: "/admin/carousels/add",
        },
        {
          title: "All Carousels",
          url: "/admin/carousels",
        },
      ],
    },
    /* {
      title: "Benefits",
      url: "#",
      icon:  HandHelping,
      items: [
        {
          title: "All Benefits",
          url: "/admin/benefits",
        },
        {
          title: "Create Benefits",
          url: "/admin/benefits/add",
        },
      ],
    }, */
    {
      title: "Pricing",
      url: "#",
      icon: BadgeDollarSignIcon,
      items: [
        {
          title: "All Packages",
          url: "/admin/packages",
        },
        {
          title: "Create Packages",
          url: "/admin/packages/add",
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
        {/* <NavProjects reports={data.Reports} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
