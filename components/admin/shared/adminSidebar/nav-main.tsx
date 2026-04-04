"use client";

import { Box, ChartColumnStacked, ChevronRight, DatabaseSearchIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <Link href="/admin/dashboard">
        <SidebarMenuButton
          tooltip="Dashboard"
          isActive={pathname === "/admin"}
          className="data-[state=true]:bg-transparent"
        >
          <ChartColumnStacked className="size-4" />
          <span>Dashboard</span>
        </SidebarMenuButton>
      </Link>
      <SidebarMenu>
        {items.map((item) => {
          const isSubItemActive = item.items?.some(
            (subItem) =>
              pathname === subItem.url ||
              (subItem.url !== "#" && pathname.startsWith(subItem.url)),
          );
          const isActive =
            (item.url !== "#" &&
              (pathname === item.url || pathname.startsWith(item.url))) ||
            isSubItemActive;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    className="data-[state=open]:bg-transparent"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isChildActive =
                        subItem.url !== "#" && pathname === subItem.url;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isChildActive}
                            className="data-[active=true]:border"
                          >
                            <Link href={subItem.url}>
                              {subItem.icon && (
                                <subItem.icon className="size-4" />
                              )}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
