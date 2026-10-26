export const adminBoardEndpoints = {
  demoUsers: "https://jsonplaceholder.typicode.com/users",
  applications: "/admin/applications",
  summary: "/admin/dashboard/summary",

  // Dashboard (BGV admin overview)
  dashboardOverview: "/admin/dashboard/overview",
  dashboardActivity: "/admin/dashboard/activity",

  // Verification management
  verificationCases: "/admin/verifications",
  verificationBulkAssign: "/admin/verifications/bulk-assign",
  assignees: "/admin/assignees",

  // Users, Roles & Permissions
  usersOverview: "/admin/access/overview",
  users: "/admin/access/users",
  userStatus: "/admin/access/users/status",
  userRole: "/admin/access/users/role",
  roles: "/admin/access/roles",
  rolePermissions: "/admin/access/roles/permissions",
  permissions: "/admin/access/permissions",
  departments: "/admin/access/departments",
  loginSessions: "/admin/access/sessions",
  sessionRevoke: "/admin/access/sessions/revoke",
  accessReviews: "/admin/access/reviews",
  accessReviewDecision: "/admin/access/reviews/decision",
} as const;
