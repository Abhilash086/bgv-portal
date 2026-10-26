import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { sidebarConfig } from "@/features/adminBoard/shared/config/navigation.config";
import { resolveIcon } from "@/features/adminBoard/shared/config/icons";

type AppSidebarProps = {
  onNavigate?: () => void;
};

const { brand, sections } = sidebarConfig;

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const BrandIcon = resolveIcon(brand.icon);

  return (
    <aside className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-18 items-center gap-3 mt-4 px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <BrandIcon className="size-5" />
        </div>

        <div className="min-w-0">
          <p className="font-semibold tracking-tight">{brand.name}</p>
          <p className="text-xs text-muted-foreground">{brand.tagline}</p>
        </div>
      </div>

      <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto px-4 pt-5">
        {sections.map((section, sectionIndex) => (
          <div key={section.heading}>
            <p
              className={cn(
                "mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground",
                sectionIndex > 0 && "mt-9",
              )}
            >
              {section.heading}
            </p>

            <nav aria-label={section.ariaLabel} className="space-y-1">
              {section.items.map(({ label, to, icon, end }) => {
                const Icon = resolveIcon(icon);

                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <AnimatePresence>
                          {isActive && (
                            <motion.span
                              layoutId={`sidebar-active-${section.heading}`}
                              className="absolute inset-y-2 left-0 w-0.75 rounded-r-full bg-primary"
                              initial={{ opacity: 0, scaleY: 0.5 }}
                              animate={{ opacity: 1, scaleY: 1 }}
                              exit={{ opacity: 0, scaleY: 0.5 }}
                              transition={{
                                duration: 0.18,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            />
                          )}
                        </AnimatePresence>
                        <Icon className="size-4.5 shrink-0" />
                        <span>{label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="shrink-0 p-4">
        <p className="px-2 pb-1 text-[11px] text-muted-foreground">
          {brand.version}
        </p>
      </div>
    </aside>
  );
}
