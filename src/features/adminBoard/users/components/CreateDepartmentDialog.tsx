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
import {
  createDepartmentParams,
  useCreateDepartment,
} from "@/features/adminBoard/users/hooks/useUsers";

type CreateDepartmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateDepartmentDialog({
  open,
  onOpenChange,
}: CreateDepartmentDialogProps) {
  const createDept = useCreateDepartment();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [headName, setHeadName] = useState("");

  const reset = () => {
    setName("");
    setDescription("");
    setHeadName("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    createDept.mutate(
      createDepartmentParams({
        name: name.trim(),
        description: description.trim(),
        headName: headName.trim(),
      }),
      {
        onSuccess: (created) => {
          toast.success(`Department "${created.name}" created.`);
          reset();
          onOpenChange(false);
        },
        onError: (error) =>
          toast.error(error.message ?? "Failed to create department."),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a department</DialogTitle>
          <DialogDescription>
            Group users into a department. You can add teams to it later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="deptName">Name</Label>
            <Input
              id="deptName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Customer Success"
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="deptDescription">Description</Label>
            <Input
              id="deptDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What this department does"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="deptHead">Department head</Label>
            <Input
              id="deptHead"
              value={headName}
              onChange={(event) => setHeadName(event.target.value)}
              placeholder="Jane Doe"
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={!name.trim() || createDept.isPending}
            >
              {createDept.isPending ? "Creating..." : "Create department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
