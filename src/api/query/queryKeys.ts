export const queryKeys = {
  all: ["api"] as const,

  products: () => [...queryKeys.all, "products"] as const,
  orders: () => [...queryKeys.all, "orders"] as const,

  access: {
    root: () => [...queryKeys.all, "access"] as const,
    overview: () => [...queryKeys.access.root(), "overview"] as const,
    users: () => [...queryKeys.access.root(), "users"] as const,
    roles: () => [...queryKeys.access.root(), "roles"] as const,
    permissions: () => [...queryKeys.access.root(), "permissions"] as const,
    departments: () => [...queryKeys.access.root(), "departments"] as const,
    sessions: () => [...queryKeys.access.root(), "sessions"] as const,
    reviews: () => [...queryKeys.access.root(), "reviews"] as const,
  },

  dashboard: {
    root: () => [...queryKeys.all, "dashboard"] as const,
    overview: () => [...queryKeys.dashboard.root(), "overview"] as const,
    activity: () => [...queryKeys.dashboard.root(), "activity"] as const,
  },

  verifications: {
    root: () => [...queryKeys.all, "verifications"] as const,
    list: (params: object) =>
      [...queryKeys.verifications.root(), "list", params] as const,
    assignees: () => [...queryKeys.verifications.root(), "assignees"] as const,
  },
};
