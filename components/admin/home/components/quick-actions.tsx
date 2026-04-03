"use client";

import { Plus, Settings, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function QuickActions() {
  return (
    <div className="flex items-center space-x-2">
      <Button asChild className="cursor-pointer">
        <Link href="/admin/orders/create">
          <Plus className="h-4 w-4 mr-2" />
          New Sale
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled className="cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="cursor-pointer">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Dashboard Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
