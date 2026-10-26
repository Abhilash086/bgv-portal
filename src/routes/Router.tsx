import { createBrowserRouter } from "react-router-dom";

import { DashboardLayout } from "@/layouts/DashboardLayout";
import {
  DashboardPage,
  UsersPage,
  VerificationsPage,
} from "@/features/adminBoard";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "/verifications",
        element: <VerificationsPage />,
      },
      {
        path: "/users",
        element: <UsersPage />,
      },
      {
        path: "/analytics",
        element: <UnauthorizedPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
