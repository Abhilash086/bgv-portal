import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PendingOverdueConfig } from "@/features/adminBoard/dashboard/config/dashboard.config";
import type {
  OverdueCase,
  PendingApproval,
} from "@/features/adminBoard/dashboard/types/dashboard";

type PendingOverduePanelProps = {
  config: PendingOverdueConfig;
  pendingApprovals: PendingApproval[];
  overdueCases: OverdueCase[];
};

type Tab = "pending" | "overdue";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
      {initials}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-32 flex-col items-center justify-center gap-1 text-center">
      <p className="text-sm font-medium">All clear</p>
      <p className="text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

export function PendingOverduePanel({
  config,
  pendingApprovals,
  overdueCases,
}: PendingOverduePanelProps) {
  const [tab, setTab] = useState<Tab>("pending");

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "pending", label: config.tabs.pendingLabel, count: pendingApprovals.length },
    { key: "overdue", label: config.tabs.overdueLabel, count: overdueCases.length },
  ];

  return (
    <Card className="flex h-full flex-col rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="gap-4 pb-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              {config.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {config.description}
            </CardDescription>
          </div>

          <Button variant="outline" size="sm" className="self-start">
            {config.viewAllLabel}
          </Button>
        </div>

        <div
          role="tablist"
          aria-label={config.title}
          className="flex items-center gap-1 self-start rounded-lg border border-border/70 bg-muted/40 p-1"
        >
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              onClick={() => setTab(item.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                tab === item.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "inline-flex min-w-4 items-center justify-center rounded px-1 text-[10px] tabular-nums",
                  tab === item.key
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "pending" ? (
              pendingApprovals.length > 0 ? (
                <ul className="divide-y divide-border/60">
                  {pendingApprovals.map((approval) => (
                    <li
                      key={approval.id}
                      className="flex items-center gap-3 py-3"
                    >
                      <Avatar name={approval.candidateName} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {approval.candidateName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {approval.checkType}
                        </p>
                      </div>
                      <span className="whitespace-nowrap text-xs text-muted-foreground">
                        {approval.submittedLabel}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState message={config.emptyPending} />
              )
            ) : overdueCases.length > 0 ? (
              <ul className="divide-y divide-border/60">
                {overdueCases.map((overdue) => (
                  <li
                    key={overdue.id}
                    className="flex items-center gap-3 py-3"
                  >
                    <Avatar name={overdue.candidateName} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {overdue.candidateName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {overdue.checkType} · {overdue.id}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                    >
                      {overdue.daysOverdue}d overdue
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message={config.emptyOverdue} />
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
