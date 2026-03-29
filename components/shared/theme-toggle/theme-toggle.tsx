"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Palette, Sun } from "lucide-react";

export function useThemeToggle() {
  const [isDark, setIsDark] = React.useState<boolean>(false);

  React.useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = stored ? stored === "dark" : prefersDark;
    setIsDark(shouldDark);
    if (shouldDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = React.useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  }, []);

  return { isDark, toggle };
}

export const ThemeToggleButton = () => {
  const { isDark, toggle } = useThemeToggle();
  return (
    <div>
      {/* Dark mode toggle */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className="size-9"
        onClick={toggle}
      >
        {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>
    </div>
  );
};

export const ThemeToggleDropdown = () => {
  const { isDark, toggle } = useThemeToggle();
  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="gap-3">
          <Palette className="size-4 text-muted-foreground" />
          <span>Theme</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={isDark ? "dark" : "light"}>
            <DropdownMenuRadioItem value="light" onClick={() => toggle()}>
              <Sun className="mr-2 size-4" />
              Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark" onClick={() => toggle()}>
              <Moon className="mr-2 size-4" />
              Dark
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
};
