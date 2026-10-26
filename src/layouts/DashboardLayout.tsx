import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "motion/react";

import { AppSidebar } from "@/features/adminBoard/shared/components/AppSidebar";
import { DashboardHeader } from "@/features/adminBoard/shared/components/SideHeader";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-background text-foreground">
        <div className="flex min-h-svh">
          <aside className="fixed inset-y-0 left-0 z-40 hidden w-62 border-r border-sidebar-border lg:block">
            <AppSidebar />
          </aside>

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent side="left" className="w-70 p-0">
              <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
              <AppSidebar onNavigate={() => setMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="flex min-w-0 flex-1 flex-col lg:pl-62">
            <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="min-w-0"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
