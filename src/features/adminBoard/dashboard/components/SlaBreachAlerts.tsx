import { AlertTriangle } from "lucide-react";

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
import type { SlaConfig } from "@/features/adminBoard/dashboard/config/dashboard.config";
import type { SlaBreach, SlaSeverity } from "@/features/adminBoard/dashboard/types/dashboard";

type SlaBreachAlertsProps = {
  config: SlaConfig;
  breaches: SlaBreach[];
};

const severityStyles: Record<SlaSeverity, string> = {
  critical:
    "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  high: "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400",
  medium:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  low: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400",
};

const severityAccent: Record<SlaSeverity, string> = {
  critical: "bg-rose-500",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  low: "bg-sky-500",
};

export function SlaBreachAlerts({ config, breaches }: SlaBreachAlertsProps) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="size-4" />
            </span>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                {config.title}
              </CardTitle>
              <CardDescription className="mt-1">
                {config.description}
              </CardDescription>
            </div>
          </div>

          <Button variant="outline" size="sm" className="self-start">
            {config.viewAllLabel}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {breaches.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {breaches.map((breach) => (
              <li
                key={breach.id}
                className="relative overflow-hidden rounded-xl border border-border/70 bg-muted/30 p-4"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-0 left-0 w-1",
                    severityAccent[breach.severity],
                  )}
                />
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">
                    {breach.candidateName}
                  </p>
                  <Badge
                    variant="outline"
                    className={severityStyles[breach.severity]}
                  >
                    {config.severityLabels[breach.severity]}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {breach.checkType} · {breach.caseId}
                </p>
                <p className="mt-3 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {breach.hoursOverSla}h over SLA
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border/70">
            <p className="text-xs text-muted-foreground">{config.empty}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
