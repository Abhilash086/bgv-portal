import type { IconName } from "./icons";

/* ------------------------------------------------------------------ *
 * Sidebar
 * ------------------------------------------------------------------ */

export type NavItem = {
  label: string;
  to: string;
  icon: IconName;
  end?: boolean;
};

export type NavSection = {
  heading: string;
  ariaLabel: string;
  items: NavItem[];
};

export type BrandConfig = {
  name: string;
  tagline: string;
  icon: IconName;
  version: string;
};

export type SidebarConfig = {
  brand: BrandConfig;
  sections: NavSection[];
};

/* ------------------------------------------------------------------ *
 * Header
 * ------------------------------------------------------------------ */

export type HeaderConfig = {
  breadcrumbRoot: string;
  routeTitles: Record<string, string>;
  fallbackTitle: string;
  search: { placeholder: string; ariaLabel: string; shortcutKey: string };
  user: { name: string; role: string; initials: string };
};

/* ------------------------------------------------------------------ *
 * Navigation config (shared layout chrome: sidebar + header)
 * ------------------------------------------------------------------ */

export const sidebarConfig: SidebarConfig = {
  brand: {
    name: "Verity",
    tagline: "Background verification",
    icon: "brand",
    version: "Verity Admin · v1.0",
  },
  sections: [
    {
      heading: "Operations",
      ariaLabel: "Main navigation",
      items: [
        { label: "Dashboard", to: "/", icon: "dashboard", end: true },
        { label: "Verifications", to: "/verifications", icon: "verifications" },
        { label: "Candidates", to: "/candidates", icon: "candidates" },
        { label: "Clients", to: "/reports", icon: "clients" },
        { label: "KYC", to: "/reports", icon: "kyc" },
        { label: "Team & Workforce", to: "/reports", icon: "team" },
        { label: "Reports", to: "/reports", icon: "reports" },
        { label: "Vendor Manage", to: "/reports", icon: "vendors" },
        { label: "Billing & Finance", to: "/reports", icon: "billing" },
        { label: "Users, Roles & Permissions", to: "/users", icon: "usersRoles" },
      ],
    },
    {
      heading: "Manage",
      ariaLabel: "Management navigation",
      items: [{ label: "Settings", to: "/settings", icon: "settings" }],
    },
  ],
};

export const headerConfig: HeaderConfig = {
  breadcrumbRoot: "Workspace",
  routeTitles: {
    "/": "Dashboard",
    "/verifications": "Verifications",
    "/candidates": "Candidates",
    "/users": "Users, Roles & Permissions",
    "/reports": "Reports",
    "/settings": "Settings",
  },
  fallbackTitle: "Dashboard",
  search: {
    placeholder: "Search cases or candidates...",
    ariaLabel: "Search dashboard",
    shortcutKey: "K",
  },
  user: { name: "Jane Doe", role: "Admin", initials: "JD" },
};
