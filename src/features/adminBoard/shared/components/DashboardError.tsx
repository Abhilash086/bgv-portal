import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type DashboardErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export function DashboardError({ message, onRetry }: DashboardErrorProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm">
        <span className="flex size-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <AlertCircle className="size-6" />
        </span>

        <div className="space-y-1">
          <h2 className="text-base font-semibold tracking-tight">
            Couldn't load the dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            {message ?? "Something went wrong while fetching your data."}
          </p>
        </div>

        {onRetry && (
          <Button onClick={onRetry} className="h-9 gap-2">
            <RefreshCw className="size-4" />
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
