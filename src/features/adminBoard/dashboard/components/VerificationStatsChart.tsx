import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { VerificationChartConfig } from "@/features/adminBoard/dashboard/config/dashboard.config";
import type { VerificationStatPoint } from "@/features/adminBoard/dashboard/types/dashboard";
import { formatCount } from "@/features/adminBoard/shared/utils/format";

type VerificationStatsChartProps = {
  config: VerificationChartConfig;
  data: VerificationStatPoint[];
};

export function VerificationStatsChart({
  config,
  data,
}: VerificationStatsChartProps) {
  const [rangeLabel, setRangeLabel] = useState<string>(config.defaultRange);

  const seriesLabels = useMemo(
    () =>
      Object.fromEntries(
        config.series.map((series) => [series.dataKey, series.label]),
      ),
    [config.series],
  );

  const activeRange = useMemo(
    () =>
      config.ranges.find((range) => range.label === rangeLabel) ??
      config.ranges[0],
    [config.ranges, rangeLabel],
  );

  const chartData = useMemo(() => {
    return data.slice(-activeRange.points).map((item, index) => ({
      ...item,
      [config.categoryKey]: activeRange.genericLabels
        ? `Period ${index + 1}`
        : item[config.categoryKey as keyof VerificationStatPoint],
    }));
  }, [data, activeRange, config.categoryKey]);

  const total = chartData.reduce(
    (sum, item) => sum + Number(item[config.totalKey as keyof typeof item] ?? 0),
    0,
  );

  const gradientId = "verificationGradient";

  const exportCsv = () => {
    const columns = [config.categoryKey, ...config.series.map((s) => s.dataKey)];
    const csv = [
      columns.join(","),
      ...chartData.map((item) =>
        columns
          .map((column) => item[column as keyof typeof item])
          .join(","),
      ),
    ].join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = config.exportFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="flex flex-col gap-4 space-y-0 pb-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold tracking-tight">
            {config.title}
          </CardTitle>
          <CardDescription className="mt-1">
            {config.description}
          </CardDescription>
          <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">
            {formatCount(total)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {config.summaryCaption}
          </p>
        </div>

        <div className="flex items-center gap-1 self-start rounded-lg border border-border/70 bg-muted/40 p-1">
          {config.ranges.map((range) => (
            <Button
              key={range.label}
              variant={rangeLabel === range.label ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              aria-pressed={rangeLabel === range.label}
              onClick={() => setRangeLabel(range.label)}
            >
              {range.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 size-7"
            aria-label="Export chart data"
            onClick={exportCsv}
          >
            <Download className="size-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-56 w-full sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 6, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity={0.24}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="var(--border)"
                strokeDasharray="3 5"
                vertical={false}
              />

              <XAxis
                dataKey={config.categoryKey}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickMargin={12}
                minTickGap={24}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickMargin={8}
                width={36}
                allowDecimals={false}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;

                  // recharts hands us `payload` in the order the <Area>
                  // elements are rendered, not what's visually meaningful.
                  // Sort by value (highest first) so the tooltip reflects the
                  // graph dynamically at the hovered point.
                  const rows = [...payload].sort(
                    (a, b) => Number(b.value ?? 0) - Number(a.value ?? 0),
                  );

                  return (
                    <div className="min-w-40 rounded-xl border border-border bg-popover p-3 shadow-xl">
                      <p className="mb-2 text-xs text-muted-foreground">
                        {label}
                      </p>
                      {rows.map((item) => (
                        <div
                          key={String(item.dataKey)}
                          className="flex items-center justify-between gap-5 py-1"
                        >
                          <span className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                              aria-hidden="true"
                            />
                            {seriesLabels[String(item.dataKey)] ??
                              String(item.dataKey)}
                          </span>
                          <span className="text-sm font-semibold tabular-nums">
                            {formatCount(Number(item.value))}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }}
                cursor={{
                  stroke: "var(--muted-foreground)",
                  strokeDasharray: "4 4",
                  strokeOpacity: 0.4,
                }}
              />

              {config.series.map((series) => (
                <Area
                  key={series.dataKey}
                  type="monotone"
                  dataKey={series.dataKey}
                  stroke={series.color}
                  strokeWidth={series.strokeWidth}
                  strokeDasharray={series.dashed ? "4 4" : undefined}
                  fill={series.fill ? `url(#${gradientId})` : "transparent"}
                  activeDot={
                    series.fill
                      ? { r: 5, strokeWidth: 3, stroke: "var(--background)" }
                      : undefined
                  }
                  animationDuration={series.animationDuration}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 pt-4">
          {config.series
            .slice()
            .reverse()
            .map((series) => (
              <div
                key={series.dataKey}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: series.color }}
                />
                {series.label}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
