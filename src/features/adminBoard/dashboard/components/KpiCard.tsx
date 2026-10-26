import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  iconTones,
  resolveIcon,
  type IconName,
  type IconTone,
} from "@/features/adminBoard/shared/config/icons";
import { formatCount } from "@/features/adminBoard/shared/utils/format";

type KpiCardProps = {
  title: string;
  value: number;
  change: number;
  description: string;
  icon: IconName;
  tone: IconTone;
  index: number;
  /** When true, an upward trend is treated as negative (e.g. overdue). */
  invertTrend?: boolean;
};

export function KpiCard({
  title,
  value,
  change,
  description,
  icon,
  tone,
  index,
  invertTrend = false,
}: KpiCardProps) {
  const Icon = resolveIcon(icon);
  const rising = change >= 0;
  const TrendIcon = rising ? ArrowUpRight : ArrowDownRight;

  // "Good" means the trend direction is favorable for this metric.
  const good = invertTrend ? !rising : rising;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="group relative h-full overflow-hidden rounded-xl border-border/70 bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <div
              className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${iconTones[tone]}`}
            >
              <Icon className="size-4" />
            </div>
          </div>

          <p className="mt-2.5 text-xl font-semibold tracking-tight tabular-nums">
            {formatCount(value)}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className={
                good
                  ? "inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
                  : "inline-flex items-center gap-0.5 rounded bg-rose-500/10 px-1 py-0.5 text-[11px] font-medium text-rose-700 dark:text-rose-400"
              }
            >
              <TrendIcon className="size-3" />
              {rising ? "+" : ""}
              {change.toFixed(1)}%
            </span>
            <span className="text-[11px] text-muted-foreground">
              {description}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
