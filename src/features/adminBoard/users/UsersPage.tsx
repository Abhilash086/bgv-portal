import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { resolveIcon } from "@/features/adminBoard/shared/config/icons";
import { usersConfig } from "@/features/adminBoard/users/config/users.config";
import { useUsersOverview } from "@/features/adminBoard/users/hooks/useUsers";
import { OverviewStats } from "@/features/adminBoard/users/components/OverviewStats";
import { UsersTab } from "@/features/adminBoard/users/components/tabs/UsersTab";
import { RolesTab } from "@/features/adminBoard/users/components/tabs/RolesTab";
import { PermissionMatrixTab } from "@/features/adminBoard/users/components/tabs/PermissionMatrixTab";
import { DepartmentsTab } from "@/features/adminBoard/users/components/tabs/DepartmentsTab";
import { SessionsTab } from "@/features/adminBoard/users/components/tabs/SessionsTab";
import { ReviewsTab } from "@/features/adminBoard/users/components/tabs/ReviewsTab";

const { pageHeader, tabs } = usersConfig;

function renderTab(tabId: string) {
  switch (tabId) {
    case "users":
      return <UsersTab />;
    case "roles":
      return <RolesTab />;
    case "permissions":
      return <PermissionMatrixTab />;
    case "departments":
      return <DepartmentsTab />;
    case "sessions":
      return <SessionsTab />;
    case "reviews":
      return <ReviewsTab />;
    default:
      return null;
  }
}

export function UsersPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const overviewQuery = useUsersOverview();
  const activeMeta = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-6 p-4 lg:space-y-8">
      {/* Page header */}
      <section>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-2.5 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          {pageHeader.badge}
        </div>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {pageHeader.title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {pageHeader.description}
        </p>
      </section>

      {/* Summary KPIs */}
      <OverviewStats
        overview={overviewQuery.data}
        isLoading={overviewQuery.isLoading}
      />

      {/* Tab navigation */}
      <div className="border-b border-border">
        <nav
          className="scrollbar-slim -mb-px flex gap-1 overflow-x-auto"
          aria-label="Access control sections"
          role="tablist"
        >
          {tabs.map((tab) => {
            const Icon = resolveIcon(tab.icon);
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {tab.label}
                {isActive && (
                  <motion.span
                    layoutId="users-tab-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active tab description + content */}
      <section className="space-y-4" role="tabpanel">
        <p className="text-sm text-muted-foreground">
          {activeMeta.description}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderTab(activeTab)}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}
