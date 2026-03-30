import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getServerSession } from "@/lib/get-session";
import { ThemeToggleButton } from "../../../shared/theme-toggle/theme-toggle";
import ProfileMenu from "./profileMenu";
import { redirect } from "next/navigation";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Hello";
}

const AdminNavbar = async () => {
  const greeting = getGreeting();
  const session = await getServerSession();

  if (!session) {
    return redirect("sign-in");
  }

  if (!session?.user.role.includes("ADMIN")) {
    return redirect("/dashboard");
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      {/* Left cluster: sidebar trigger + greeting */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
        {/* Greeting (truncate on small screens) */}
        <div className="flex items-center">
          <span className="text-sm font-medium text-foreground line-clamp-1">
            {greeting}, {session?.user.name.split(' ').slice(0, 2).join(' ')}
          </span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right cluster: theme toggle + profile */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <ThemeToggleButton />

        <ProfileMenu user={session?.user} />
      </div>
    </header>
  );
};

export default AdminNavbar;
