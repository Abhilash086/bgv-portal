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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createRoleParams,
  useCreateRole,
} from "@/features/adminBoard/users/hooks/useUsers";
import type { Permission } from "@/features/adminBoard/users/types/users";

type CreateRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: Permission[];
};

function groupByModule(permissions: Permission[]) {
  const groups = new Map<string, Permission[]>();
  for (const perm of permissions) {
    const list = groups.get(perm.module) ?? [];
    list.push(perm);
    groups.set(perm.module, list);
  }
  return [...groups.entries()];
}

export function CreateRoleDialog({
  open,
  onOpenChange,
  permissions,
}: CreateRoleDialogProps) {
  const createRole = useCreateRole();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const groups = useMemo(() => groupByModule(permissions), [permissions]);

  const reset = () => {
    setName("");
    setDescription("");
    setSelected(new Set());
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    createRole.mutate(
      createRoleParams({
        name: name.trim(),
        description: description.trim(),
        permissionIds: [...selected],
      }),
      {
        onSuccess: (created) => {
          toast.success(`Role "${created.name}" created.`);
          reset();
          onOpenChange(false);
        },
        onError: (error) =>
          toast.error(error.message ?? "Failed to create role."),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a role</DialogTitle>
          <DialogDescription>
            Define a new role and choose the permissions it grants.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="roleName">Role name</Label>
            <Input
              id="roleName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Senior Analyst"
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="roleDescription">Description</Label>
            <Input
              id="roleDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What this role is for"
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Permissions ({selected.size} selected)</Label>
            <div className="-mx-1 max-h-[38vh] space-y-4 overflow-y-auto rounded-lg border border-border/70 p-3">
              {groups.map(([module, modulePerms]) => (
                <div key={module} className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {module}
                  </p>
                  <div className="space-y-1">
                    {modulePerms.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={selected.has(perm.id)}
                          onCheckedChange={() => toggle(perm.id)}
                          aria-label={perm.label}
                        />
                        <span className="text-sm">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={!name.trim() || createRole.isPending}
            >
              {createRole.isPending ? "Creating..." : "Create role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
