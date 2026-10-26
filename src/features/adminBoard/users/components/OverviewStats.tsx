import { motion } from "motion/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  iconTones,
  resolveIcon,
  type IconName,
  type IconTone,
} from "@/features/adminBoard/shared/config/icons";
import { formatCount } from "@/features/adminBoard/shared/utils/format";
import type { UsersOverview } from "@/features/adminBoard/users/types/users";

type Stat = {
  title: string;
  value: number;
  icon: IconName;
  tone: IconTone;
};

type OverviewStatsProps = {
  overview?: UsersOverview;
  isLoading: boolean;
};

export function OverviewStats({ overview, isLoading }: OverviewStatsProps) {
  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="rounded-xl border-border/70 p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-3 h-6 w-10" />
          </Card>
        ))}
      </div>
    );
  }

  const stats: Stat[] = [
    { title: "Total users", value: overview.totalUsers, icon: "candidates", tone: "violet" },
    { title: "Active", value: overview.activeUsers, icon: "active", tone: "emerald" },
    { title: "Invited", value: overview.invitedUsers, icon: "bell", tone: "blue" },
    { title: "Roles", value: overview.roleCount, icon: "usersRoles", tone: "amber" },
    { title: "Active sessions", value: overview.activeSessions, icon: "inProgress", tone: "blue" },
    { title: "Pending reviews", value: overview.pendingReviews, icon: "approvals", tone: "rose" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat, index) => {
        const Icon = resolveIcon(stat.icon);
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Card className="h-full rounded-xl border-border/70 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div
                    className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${iconTones[stat.tone]}`}
                  >
                    <Icon className="size-4" />
                  </div>
                </div>
                <p className="mt-2.5 text-xl font-semibold tracking-tight tabular-nums">
                  {formatCount(stat.value)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
