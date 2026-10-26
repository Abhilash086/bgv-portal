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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dropdown } from "@/components/ui/Dropdown";
import {
  createUserParams,
  useCreateUser,
} from "@/features/adminBoard/users/hooks/useUsers";
import type {
  Department,
  Role,
} from "@/features/adminBoard/users/types/users";

type InviteUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
  departments: Department[];
};

export function InviteUserDialog({
  open,
  onOpenChange,
  roles,
  departments,
}: InviteUserDialogProps) {
  const createUser = useCreateUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const reset = () => {
    setName("");
    setEmail("");
    setRoleId("");
    setDepartmentId("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!roleId || !departmentId) return;

    createUser.mutate(
      createUserParams({
        name: name.trim(),
        email: email.trim(),
        roleId,
        departmentId,
      }),
      {
        onSuccess: (created) => {
          toast.success(`Invitation sent to ${created.name}`);
          reset();
          onOpenChange(false);
        },
        onError: (error) =>
          toast.error(error.message ?? "Failed to invite user."),
      },
    );
  };

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    roleId !== "" &&
    departmentId !== "" &&
    !createUser.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a user</DialogTitle>
          <DialogDescription>
            Send an invitation. The account starts as invited until they sign
            in for the first time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="userName">Full name</Label>
            <Input
              id="userName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="userEmail">Work email</Label>
            <Input
              id="userEmail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jane@verity.io"
              required
            />
          </div>

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

          <Dropdown
            label="Department"
            placeholder="Select a department"
            value={departmentId}
            onChange={setDepartmentId}
            options={departments.map((dept) => ({
              label: dept.name,
              value: dept.id,
            }))}
          />

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!canSubmit}>
              {createUser.isPending ? "Sending..." : "Send invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
