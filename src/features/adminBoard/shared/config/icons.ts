import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  CreditCard,
  FileSearch,
  IdCard,
  LayoutDashboard,
  LifeBuoy,
  Settings2,
  ShieldCheck,
  Timer,
  Truck,
  UserCheck,
  UserCog,
  Users,
  UsersRound,
  XCircle,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon registry for the admin dashboard.
 *
 * Config references icons by their string `IconName` so config stays
 * serializable (it could come from an API/JSON). Components resolve the name
 * to a component via `resolveIcon`.
 */
export const iconRegistry = {
  // Navigation
  dashboard: LayoutDashboard,
  verifications: ShieldCheck,
  candidates: Users,
  clients: Building2,
  kyc: IdCard,
  team: UsersRound,
  reports: BarChart3,
  vendors: Truck,
  billing: CreditCard,
  usersRoles: UserCog,
  settings: Settings2,
  support: LifeBuoy,
  brand: ShieldCheck,

  // KPIs / statuses
  totalChecks: FileSearch,
  inProgress: Timer,
  completed: CheckCircle2,
  pending: Clock,
  approvals: ClipboardCheck,
  overdue: AlertTriangle,
  rejected: XCircle,
  verified: UserCheck,
  active: Activity,
  bell: Bell,
} as const;

export type IconName = keyof typeof iconRegistry;

export function resolveIcon(name: IconName): LucideIcon {
  return iconRegistry[name];
}

/**
 * Named color tones for icons/badges. Each maps to a soft tinted background +
 * matching foreground that reads in both light and dark themes. Defined once
 * here so coloring stays consistent and config-driven.
 */
export type IconTone =
  | "violet"
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "slate";

export const iconTones: Record<IconTone, string> = {
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  blue: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  slate: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
};
