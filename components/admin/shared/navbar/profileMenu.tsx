"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { showError } from "@/lib/toast";
import {
  Bell,
  BookOpen,
  ChevronDown,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { redirect } from "next/navigation";
import { ThemeToggleDropdown } from "../../../shared/theme-toggle/theme-toggle";

interface TUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  role: string[];
  image?: string | null | undefined;
}

const ProfileMenu = ({ user }: { user: TUser }) => {
  async function handleLogout() {
    const { error } = await authClient.signOut();
    if (error) {
      console.error("Logout error:", error);
      showError({
        message: "Logout failed. Please try again.",
        duration: 5000,
      });
    }
    redirect("sign-in");
  }

  return (
    <div>
      {/* Profile dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group relative flex items-center gap-3 rounded-full px-3 py-3 hover:bg-accent/60 transition-all duration-300 ease-out hover:scale-105 admin_profile_button"
          >
            <Avatar className="size-5.5 ring-2 ring-offset-2 ring-offset-background ring-primary/30 group-hover:ring-primary/50 transition-all">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                {user.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>

            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-sm font-semibold">{user.name.split(' ').slice(0, 3).join(' ')}</span>
              <span className="text-xs text-muted-foreground/80">
                {user.role.map((role) => role).join(', ')}
              </span>
            </div>

            <ChevronDown className="size-4 hidden sm:flex text-muted-foreground group-hover:text-foreground transition-colors" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
          {/* User header with status */}
          <DropdownMenuLabel className="flex items-center gap-3 p-3">
            <div className="relative">
              <Avatar className="size-10">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 block size-3 rounded-full bg-green-500 ring-2 ring-background" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{user.name.split(' ').slice(0, 3).join(' ')}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Account group */}
          <DropdownMenuGroup>
            <DropdownMenuItem className="gap-3">
              <User className="size-4 text-muted-foreground" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3">
              <Settings className="size-4 text-muted-foreground" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3">
              <Shield className="size-4 text-muted-foreground" />
              <span>Security</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3">
              <Bell className="size-4 text-muted-foreground" />
              <span>Notifications</span>
              <DropdownMenuShortcut>
                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  3
                </span>
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Support & feedback */}
          <DropdownMenuGroup>
            <DropdownMenuItem className="gap-3">
              <LifeBuoy className="size-4 text-muted-foreground" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3">
              <MessageSquare className="size-4 text-muted-foreground" />
              <span>Feedback</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3">
              <BookOpen className="size-4 text-muted-foreground" />
              <span>Documentation</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Theme quick switcher */}
          <ThemeToggleDropdown />

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            onClick={() => handleLogout()}
            className="gap-3 text-red-600 focus:text-red-600"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileMenu;
