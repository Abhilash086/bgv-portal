import { useState } from "react";
import {
  Bell,
  Check,
  ChevronsUpDown,
  Command,
  Laptop,
  Menu,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, type Theme } from "@/providers/ThemeProvider";
import { headerConfig as header } from "@/features/adminBoard/shared/config/navigation.config";

type DashboardHeaderProps = {
  onMenuClick: () => void;
};

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");

  const title = header.routeTitles[pathname] ?? header.fallbackTitle;

  const themeOptions: {
    value: Theme;
    label: string;
    icon: typeof Sun;
  }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between gap-3 border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </Button>

        <div className="min-w-0">
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span>{header.breadcrumbRoot}</span>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{title}</span>
          </div>
          <h1 className="truncate text-base font-semibold tracking-tight sm:mt-1 sm:text-lg">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <form
          className="relative hidden w-52 md:block lg:w-64"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            // Connect to your search route or API here.
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={header.search.placeholder}
            aria-label={header.search.ariaLabel}
            className="h-9 border-border/70 bg-muted/40 pl-9 pr-12 text-xs focus-visible:bg-background"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground lg:flex">
            <Command className="size-3" /> {header.search.shortcutKey}
          </span>
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Change color theme"
                title="Change color theme"
              >
                {theme === "dark" ? (
                  <Moon className="size-4.5" />
                ) : theme === "light" ? (
                  <Sun className="size-4.5" />
                ) : (
                  <Laptop className="size-4.5" />
                )}
              </Button>
            }
          />

          <DropdownMenuContent align="end" className="w-40">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Appearance
            </div>
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => setTheme(value)}
                className="gap-2"
              >
                <Icon className="size-4" />
                <span>{label}</span>
                {theme === value && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
          onClick={() => {
            // Replace with a notification panel or dropdown.
          }}
        >
          <Bell className="size-4.5" />
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background"
          />
        </Button>

        <div className="ml-1 hidden items-center gap-2 border-l pl-3 sm:flex">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {header.user.initials}
          </div>
          <div className="hidden xl:block">
            <p className="text-xs font-medium">{header.user.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {header.user.role}
            </p>
          </div>
          <ChevronsUpDown className="hidden size-3.5 text-muted-foreground xl:block" />
        </div>
      </div>
    </header>
  );
}
