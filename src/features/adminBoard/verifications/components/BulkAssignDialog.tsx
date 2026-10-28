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
  bulkAssignParams,
  useAssignees,
  useBulkAssign,
} from "@/features/adminBoard/verifications/hooks/useVerifications";
import { fallbackAssignees } from "@/features/adminBoard/verifications/data/verifications";

type BulkAssignDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseIds: string[];
  onAssigned: () => void;
};

export function BulkAssignDialog({
  open,
  onOpenChange,
  caseIds,
  onAssigned,
}: BulkAssignDialogProps) {
  const assignees = useAssignees();
  const bulkAssign = useBulkAssign();
  const [assigneeId, setAssigneeId] = useState<string>("");

  // assignees ? assignees : fallback from data/ folder
  const assigneeList =
    assignees.data && assignees.data.length > 0
      ? assignees.data
      : fallbackAssignees;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!assigneeId) return;

    bulkAssign.mutate(
      bulkAssignParams({ caseIds, assigneeId }),
      {
        onSuccess: () => {
          const name =
            assigneeList.find((a) => a.id === assigneeId)?.name ?? "assignee";
          toast.success(
            `Assigned ${caseIds.length} case${caseIds.length === 1 ? "" : "s"} to ${name}`,
          );
          setAssigneeId("");
          onAssigned();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message ?? "Failed to assign cases.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign cases</DialogTitle>
          <DialogDescription>
            Assign {caseIds.length} selected case
            {caseIds.length === 1 ? "" : "s"} to a team member.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <Dropdown
            label="Assignee"
            placeholder="Select a team member"
            value={assigneeId}
            onChange={setAssigneeId}
            options={assigneeList.map((assignee) => ({
              label: assignee.name,
              value: assignee.id,
            }))}
          />

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={!assigneeId || bulkAssign.isPending}
            >
              {bulkAssign.isPending ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
