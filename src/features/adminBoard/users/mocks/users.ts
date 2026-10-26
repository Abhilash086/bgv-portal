import type {
  AccessReviewDto,
  DepartmentDto,
  LoginSessionDto,
  Permission,
  RoleDto,
  UserDto,
} from "@/features/adminBoard/users/types/users";

const ago = (ms: number) => new Date(Date.now() - ms).toISOString();
const ahead = (ms: number) => new Date(Date.now() + ms).toISOString();
const MIN = 60_000;
const HOUR = 3600_000;
const DAY = 24 * HOUR;

/* ------------------------------------------------------------------ *
 * Permissions — grouped by module. The matrix renders these by module.
 * ------------------------------------------------------------------ */

export const mockPermissions: Permission[] = [
  // Verifications
  { id: "verifications.view", module: "Verifications", label: "View cases", description: "See verification cases and their status." },
  { id: "verifications.create", module: "Verifications", label: "Create cases", description: "Open new background verification cases." },
  { id: "verifications.assign", module: "Verifications", label: "Assign cases", description: "Assign cases to team members." },
  { id: "verifications.delete", module: "Verifications", label: "Delete cases", description: "Permanently remove verification cases." },

  // Candidates
  { id: "candidates.view", module: "Candidates", label: "View candidates", description: "Access candidate profiles and records." },
  { id: "candidates.edit", module: "Candidates", label: "Edit candidates", description: "Update candidate information." },
  { id: "candidates.export", module: "Candidates", label: "Export candidates", description: "Export candidate data to CSV." },

  // Reports
  { id: "reports.view", module: "Reports", label: "View reports", description: "Access analytics and reporting dashboards." },
  { id: "reports.export", module: "Reports", label: "Export reports", description: "Download reports and charts." },

  // Billing
  { id: "billing.view", module: "Billing", label: "View billing", description: "See invoices and billing history." },
  { id: "billing.manage", module: "Billing", label: "Manage billing", description: "Update payment methods and plans." },

  // Administration
  { id: "users.view", module: "Administration", label: "View users", description: "See users, roles, and permissions." },
  { id: "users.manage", module: "Administration", label: "Manage users", description: "Create, edit, activate, and deactivate accounts." },
  { id: "roles.manage", module: "Administration", label: "Manage roles", description: "Create roles and change permissions." },
  { id: "settings.manage", module: "Administration", label: "Manage settings", description: "Change organisation-wide settings." },
];

/* ------------------------------------------------------------------ *
 * Roles
 * ------------------------------------------------------------------ */

const allPermissionIds = mockPermissions.map((p) => p.id);

export const mockRoles: RoleDto[] = [
  {
    id: "role-admin",
    name: "Administrator",
    description: "Full access to every area of the platform.",
    isSystem: true,
    permissionIds: allPermissionIds,
    userCount: 2,
    createdAt: ago(240 * DAY),
  },
  {
    id: "role-manager",
    name: "Operations Manager",
    description: "Manages verification operations and the team.",
    isSystem: false,
    permissionIds: [
      "verifications.view",
      "verifications.create",
      "verifications.assign",
      "candidates.view",
      "candidates.edit",
      "reports.view",
      "reports.export",
      "users.view",
    ],
    userCount: 3,
    createdAt: ago(180 * DAY),
  },
  {
    id: "role-analyst",
    name: "Verification Analyst",
    description: "Works verification cases end to end.",
    isSystem: false,
    permissionIds: [
      "verifications.view",
      "verifications.create",
      "candidates.view",
      "candidates.edit",
      "reports.view",
    ],
    userCount: 5,
    createdAt: ago(120 * DAY),
  },
  {
    id: "role-finance",
    name: "Finance",
    description: "Handles billing and financial reporting.",
    isSystem: false,
    permissionIds: ["billing.view", "billing.manage", "reports.view", "reports.export"],
    userCount: 1,
    createdAt: ago(90 * DAY),
  },
  {
    id: "role-auditor",
    name: "Auditor",
    description: "Read-only access for compliance and audits.",
    isSystem: false,
    permissionIds: ["verifications.view", "candidates.view", "reports.view", "users.view"],
    userCount: 1,
    createdAt: ago(60 * DAY),
  },
];

/* ------------------------------------------------------------------ *
 * Departments & teams
 * ------------------------------------------------------------------ */

export const mockDepartments: DepartmentDto[] = [
  {
    id: "dept-ops",
    name: "Operations",
    description: "Runs day-to-day verification processing.",
    headName: "Jane Doe",
    memberCount: 8,
    teams: [
      { id: "team-intake", name: "Case Intake", leadName: "Priya Nair", memberCount: 3 },
      { id: "team-review", name: "Case Review", leadName: "Diego Santos", memberCount: 5 },
    ],
  },
  {
    id: "dept-compliance",
    name: "Compliance",
    description: "Owns audits, access reviews, and policy.",
    headName: "Noor Haddad",
    memberCount: 3,
    teams: [{ id: "team-audit", name: "Audit", leadName: "Noor Haddad", memberCount: 3 }],
  },
  {
    id: "dept-finance",
    name: "Finance",
    description: "Billing, invoicing, and financial reporting.",
    headName: "Marcus Hale",
    memberCount: 2,
    teams: [{ id: "team-billing", name: "Billing", leadName: "Marcus Hale", memberCount: 2 }],
  },
];

/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */

export const mockUsers: UserDto[] = [
  {
    id: "usr-1",
    name: "Jane Doe",
    email: "jane@verity.io",
    status: "active",
    roleId: "role-admin",
    roleName: "Administrator",
    departmentId: "dept-ops",
    departmentName: "Operations",
    lastActiveAt: ago(8 * MIN),
    createdAt: ago(240 * DAY),
    mfaEnabled: true,
  },
  {
    id: "usr-2",
    name: "Diego Santos",
    email: "diego@verity.io",
    status: "active",
    roleId: "role-manager",
    roleName: "Operations Manager",
    departmentId: "dept-ops",
    departmentName: "Operations",
    lastActiveAt: ago(2 * HOUR),
    createdAt: ago(180 * DAY),
    mfaEnabled: true,
  },
  {
    id: "usr-3",
    name: "Priya Nair",
    email: "priya@verity.io",
    status: "active",
    roleId: "role-analyst",
    roleName: "Verification Analyst",
    departmentId: "dept-ops",
    departmentName: "Operations",
    lastActiveAt: ago(45 * MIN),
    createdAt: ago(150 * DAY),
    mfaEnabled: false,
  },
  {
    id: "usr-4",
    name: "Noor Haddad",
    email: "noor@verity.io",
    status: "active",
    roleId: "role-auditor",
    roleName: "Auditor",
    departmentId: "dept-compliance",
    departmentName: "Compliance",
    lastActiveAt: ago(1 * DAY),
    createdAt: ago(120 * DAY),
    mfaEnabled: true,
  },
  {
    id: "usr-5",
    name: "Marcus Hale",
    email: "marcus@verity.io",
    status: "active",
    roleId: "role-finance",
    roleName: "Finance",
    departmentId: "dept-finance",
    departmentName: "Finance",
    lastActiveAt: ago(5 * HOUR),
    createdAt: ago(90 * DAY),
    mfaEnabled: false,
  },
  {
    id: "usr-6",
    name: "Olivia Martin",
    email: "olivia@verity.io",
    status: "invited",
    roleId: "role-analyst",
    roleName: "Verification Analyst",
    departmentId: "dept-ops",
    departmentName: "Operations",
    lastActiveAt: null,
    createdAt: ago(3 * DAY),
    mfaEnabled: false,
  },
  {
    id: "usr-7",
    name: "Jackson Lee",
    email: "jackson@verity.io",
    status: "inactive",
    roleId: "role-analyst",
    roleName: "Verification Analyst",
    departmentId: "dept-ops",
    departmentName: "Operations",
    lastActiveAt: ago(40 * DAY),
    createdAt: ago(200 * DAY),
    mfaEnabled: false,
  },
  {
    id: "usr-8",
    name: "Isabella Nguyen",
    email: "isabella@verity.io",
    status: "suspended",
    roleId: "role-manager",
    roleName: "Operations Manager",
    departmentId: "dept-ops",
    departmentName: "Operations",
    lastActiveAt: ago(14 * DAY),
    createdAt: ago(160 * DAY),
    mfaEnabled: true,
  },
  {
    id: "usr-9",
    name: "William Kim",
    email: "william@verity.io",
    status: "active",
    roleId: "role-analyst",
    roleName: "Verification Analyst",
    departmentId: "dept-ops",
    departmentName: "Operations",
    lastActiveAt: ago(30 * MIN),
    createdAt: ago(75 * DAY),
    mfaEnabled: true,
  },
  {
    id: "usr-10",
    name: "Sofia Davis",
    email: "sofia@verity.io",
    status: "active",
    roleId: "role-admin",
    roleName: "Administrator",
    departmentId: "dept-compliance",
    departmentName: "Compliance",
    lastActiveAt: ago(3 * HOUR),
    createdAt: ago(210 * DAY),
    mfaEnabled: true,
  },
  {
    id: "usr-11",
    name: "Ethan Wilson",
    email: "ethan@verity.io",
    status: "invited",
    roleId: "role-finance",
    roleName: "Finance",
    departmentId: "dept-finance",
    departmentName: "Finance",
    lastActiveAt: null,
    createdAt: ago(1 * DAY),
    mfaEnabled: false,
  },
  {
    id: "usr-12",
    name: "Mia Rossi",
    email: "mia@verity.io",
    status: "active",
    roleId: "role-manager",
    roleName: "Operations Manager",
    departmentId: "dept-compliance",
    departmentName: "Compliance",
    lastActiveAt: ago(6 * HOUR),
    createdAt: ago(100 * DAY),
    mfaEnabled: false,
  },
];

/* ------------------------------------------------------------------ *
 * Login sessions
 * ------------------------------------------------------------------ */

export const mockLoginSessions: LoginSessionDto[] = [
  {
    id: "sess-1",
    userId: "usr-1",
    userName: "Jane Doe",
    device: "MacBook Pro",
    browser: "Chrome 129",
    ipAddress: "203.0.113.24",
    location: "London, UK",
    status: "active",
    current: true,
    lastActiveAt: ago(2 * MIN),
    createdAt: ago(3 * HOUR),
  },
  {
    id: "sess-2",
    userId: "usr-2",
    userName: "Diego Santos",
    device: "Windows PC",
    browser: "Edge 129",
    ipAddress: "198.51.100.7",
    location: "Madrid, ES",
    status: "active",
    current: false,
    lastActiveAt: ago(20 * MIN),
    createdAt: ago(5 * HOUR),
  },
  {
    id: "sess-3",
    userId: "usr-3",
    userName: "Priya Nair",
    device: "iPhone 15",
    browser: "Safari Mobile",
    ipAddress: "192.0.2.51",
    location: "Bengaluru, IN",
    status: "active",
    current: false,
    lastActiveAt: ago(50 * MIN),
    createdAt: ago(8 * HOUR),
  },
  {
    id: "sess-4",
    userId: "usr-10",
    userName: "Sofia Davis",
    device: "MacBook Air",
    browser: "Firefox 130",
    ipAddress: "203.0.113.99",
    location: "Dublin, IE",
    status: "active",
    current: false,
    lastActiveAt: ago(3 * HOUR),
    createdAt: ago(1 * DAY),
  },
  {
    id: "sess-5",
    userId: "usr-5",
    userName: "Marcus Hale",
    device: "Windows PC",
    browser: "Chrome 128",
    ipAddress: "198.51.100.212",
    location: "New York, US",
    status: "expired",
    current: false,
    lastActiveAt: ago(2 * DAY),
    createdAt: ago(2 * DAY),
  },
  {
    id: "sess-6",
    userId: "usr-8",
    userName: "Isabella Nguyen",
    device: "Android Phone",
    browser: "Chrome Mobile",
    ipAddress: "192.0.2.180",
    location: "Unknown",
    status: "revoked",
    current: false,
    lastActiveAt: ago(14 * DAY),
    createdAt: ago(14 * DAY),
  },
  {
    id: "sess-7",
    userId: "usr-9",
    userName: "William Kim",
    device: "MacBook Pro",
    browser: "Chrome 129",
    ipAddress: "203.0.113.45",
    location: "Seoul, KR",
    status: "active",
    current: false,
    lastActiveAt: ago(35 * MIN),
    createdAt: ago(6 * HOUR),
  },
];

/* ------------------------------------------------------------------ *
 * Access reviews
 * ------------------------------------------------------------------ */

export const mockAccessReviews: AccessReviewDto[] = [
  {
    id: "rev-1",
    userName: "Isabella Nguyen",
    roleName: "Operations Manager",
    resource: "Billing · Manage",
    status: "pending",
    reviewer: "Noor Haddad",
    dueDate: ago(2 * DAY),
  },
  {
    id: "rev-2",
    userName: "Jackson Lee",
    roleName: "Verification Analyst",
    resource: "Candidates · Export",
    status: "pending",
    reviewer: "Noor Haddad",
    dueDate: ahead(3 * DAY),
  },
  {
    id: "rev-3",
    userName: "Marcus Hale",
    roleName: "Finance",
    resource: "Billing · Manage",
    status: "approved",
    reviewer: "Sofia Davis",
    dueDate: ahead(10 * DAY),
  },
  {
    id: "rev-4",
    userName: "Priya Nair",
    roleName: "Verification Analyst",
    resource: "Reports · View",
    status: "approved",
    reviewer: "Diego Santos",
    dueDate: ahead(14 * DAY),
  },
  {
    id: "rev-5",
    userName: "William Kim",
    roleName: "Verification Analyst",
    resource: "Verifications · Create",
    status: "pending",
    reviewer: "Diego Santos",
    dueDate: ahead(1 * DAY),
  },
  {
    id: "rev-6",
    userName: "Isabella Nguyen",
    roleName: "Operations Manager",
    resource: "Users · View",
    status: "revoked",
    reviewer: "Noor Haddad",
    dueDate: ago(5 * DAY),
  },
];
