import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  updateRolePermissionsParams,
  useUpdateRolePermissions,
} from "@/features/adminBoard/users/hooks/useUsers";
import type {
  Permission,
  Role,
} from "@/features/adminBoard/users/types/users";

type RolePermissionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  permissions: Permission[];
};

/** Group permissions by module for a tidy, scannable layout. */
function groupByModule(permissions: Permission[]) {
  const groups = new Map<string, Permission[]>();
  for (const perm of permissions) {
    const list = groups.get(perm.module) ?? [];
    list.push(perm);
    groups.set(perm.module, list);
  }
  return [...groups.entries()];
}

export function RolePermissionsDialog({
  open,
  onOpenChange,
  role,
  permissions,
}: RolePermissionsDialogProps) {
  const updatePerms = useUpdateRolePermissions();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Seed the checklist from the role when the dialog opens. Adjusting state
  // during render (not via an effect) avoids a cascading re-render.
  const [seededRoleId, setSeededRoleId] = useState<string | null>(null);
  if (open && role && role.id !== seededRoleId) {
    setSeededRoleId(role.id);
    setSelected(new Set(role.permissionIds));
  }
  if (!open && seededRoleId !== null) {
    setSeededRoleId(null);
  }

  const groups = useMemo(() => groupByModule(permissions), [permissions]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleModule = (modulePerms: Permission[]) => {
    const allOn = modulePerms.every((p) => selected.has(p.id));
    setSelected((prev) => {
      const next = new Set(prev);
      modulePerms.forEach((p) => {
        if (allOn) next.delete(p.id);
        else next.add(p.id);
      });
      return next;
    });
  };

  const handleSave = () => {
    if (!role) return;
    updatePerms.mutate(
      updateRolePermissionsParams({
        roleId: role.id,
        permissionIds: [...selected],
      }),
      {
        onSuccess: () => {
          toast.success(`Permissions updated for ${role.name}.`);
          onOpenChange(false);
        },
        onError: (error) =>
          toast.error(error.message ?? "Failed to update permissions."),
      },
    );
  };

  const readOnly = role?.isSystem ?? false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{role?.name ?? "Role"} permissions</DialogTitle>
          <DialogDescription>
            {readOnly
              ? "This is a system role. Its permissions can't be changed."
              : `${selected.size} of ${permissions.length} permissions granted.`}
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-1 max-h-[55vh] space-y-5 overflow-y-auto px-1 py-1">
          {groups.map(([module, modulePerms]) => {
            const allOn = modulePerms.every((p) => selected.has(p.id));
            const someOn = modulePerms.some((p) => selected.has(p.id));

            return (
              <div key={module} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allOn}
                    indeterminate={someOn && !allOn}
                    disabled={readOnly}
                    onCheckedChange={() => toggleModule(modulePerms)}
                    aria-label={`Toggle all ${module} permissions`}
                  />
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {module}
                  </p>
                </div>

                <div className="space-y-1 pl-6">
                  {modulePerms.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex cursor-pointer items-start gap-2 rounded-md p-1.5 hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={selected.has(perm.id)}
                        disabled={readOnly}
                        onCheckedChange={() => toggle(perm.id)}
                        className="mt-0.5"
                        aria-label={perm.label}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">
                          {perm.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {perm.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            {readOnly ? "Close" : "Cancel"}
          </DialogClose>
          {!readOnly && (
            <Button onClick={handleSave} disabled={updatePerms.isPending}>
              {updatePerms.isPending ? "Saving..." : "Save permissions"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
