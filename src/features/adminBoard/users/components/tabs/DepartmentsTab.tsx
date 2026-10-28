import { useState } from "react";
import { motion } from "motion/react";
import { Building2, Plus, UserCircle2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardError } from "@/features/adminBoard/shared/components/DashboardError";
import { CreateDepartmentDialog } from "@/features/adminBoard/users/components/CreateDepartmentDialog";
import { useDepartments } from "@/features/adminBoard/users/hooks/useUsers";
import { fallbackDepartments } from "@/features/adminBoard/users/data/users";
import { env } from "@/config/env";

export function DepartmentsTab() {
  const departmentsQuery = useDepartments();
  const [createOpen, setCreateOpen] = useState(false);

  // data ? data : fallback from data/ folder
  const departments =
    departmentsQuery.data && departmentsQuery.data.length > 0
      ? departmentsQuery.data
      : fallbackDepartments;

  if (departmentsQuery.isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="rounded-2xl border-border/70 p-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-6 h-16 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (departmentsQuery.isError && !env.useMockFallback) {
    return (
      <DashboardError
        message={departmentsQuery.error?.message}
        onRetry={() => departmentsQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {departments.length}{" "}
          {departments.length === 1 ? "department" : "departments"}
        </p>
        <Button className="h-9 gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          New department
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {departments.map((dept, index) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Card className="h-full rounded-2xl border-border/70 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold tracking-tight">
                      {dept.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {dept.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <UserCircle2 className="size-3.5" />
                        Head: {dept.headName || "—"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="size-3.5" />
                        {dept.memberCount} members
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Teams ({dept.teamCount})
                </p>

                {dept.teams.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No teams yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {dept.teams.map((team) => (
                      <li
                        key={team.id}
                        className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {team.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            Lead: {team.leadName}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-md bg-background px-2 py-1 text-xs text-muted-foreground">
                          {team.memberCount} members
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <CreateDepartmentDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
