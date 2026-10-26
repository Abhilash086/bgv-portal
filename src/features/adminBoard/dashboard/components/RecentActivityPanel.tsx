import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resolveIcon } from "@/features/adminBoard/shared/config/icons";
import type { ActivityConfig } from "@/features/adminBoard/dashboard/config/dashboard.config";
import type { ActivityItem } from "@/features/adminBoard/dashboard/types/dashboard";

type RecentActivityPanelProps = {
  config: ActivityConfig;
  items: ActivityItem[];
};

export function RecentActivityPanel({
  config,
  items,
}: RecentActivityPanelProps) {
  return (
    <Card className="flex h-full flex-col rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
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
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        {items.length > 0 ? (
          <ol className="relative space-y-4 before:absolute before:left-3.75 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border/70">
            {items.map((item) => {
              const Icon = resolveIcon(item.icon);

              return (
                <li key={item.id} className="relative flex gap-3">
                  <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{item.actor}</span>{" "}
                      <span className="text-muted-foreground">
                        {item.description}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.timeLabel}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="flex h-32 items-center justify-center">
            <p className="text-xs text-muted-foreground">{config.empty}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
