import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/Dropdown";
import {
  updateUserRoleParams,
  useUpdateUserRole,
} from "@/features/adminBoard/users/hooks/useUsers";
import type { Role, User } from "@/features/adminBoard/users/types/users";

type ChangeRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  roles: Role[];
};

export function ChangeRoleDialog({
  open,
  onOpenChange,
  user,
  roles,
}: ChangeRoleDialogProps) {
  const updateRole = useUpdateUserRole();
  const [roleId, setRoleId] = useState("");

  // Seed the select with the user's current role whenever the dialog opens.
  // Adjusting state during render (the React-recommended pattern) instead of
  // an effect avoids a cascading re-render.
  const [prevUserId, setPrevUserId] = useState<string | null>(null);
  if (open && user && user.id !== prevUserId) {
    setPrevUserId(user.id);
    setRoleId(user.roleId);
  }
  if (!open && prevUserId !== null) {
    setPrevUserId(null);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !roleId || roleId === user.roleId) {
      onOpenChange(false);
      return;
    }

    updateRole.mutate(updateUserRoleParams({ userId: user.id, roleId }), {
      onSuccess: () => {
        const roleName = roles.find((r) => r.id === roleId)?.name ?? "role";
        toast.success(`${user.name} is now a ${roleName}.`);
        onOpenChange(false);
      },
      onError: (error) =>
        toast.error(error.message ?? "Failed to change role."),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>
            Update the role for {user?.name ?? "this user"}. This changes what
            they can access.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <Dropdown
            label="Role"
            placeholder="Select a role"
            value={roleId}
            onChange={setRoleId}
            options={roles.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
          />

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!roleId || updateRole.isPending}>
              {updateRole.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
