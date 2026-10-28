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
import { verificationConfig } from "@/features/adminBoard/verifications/config/verification.config";
import {
  createVerificationParams,
  useAssignees,
  useCreateVerification,
} from "@/features/adminBoard/verifications/hooks/useVerifications";
import { fallbackAssignees } from "@/features/adminBoard/verifications/data/verifications";
import type { VerificationPriority } from "@/features/adminBoard/verifications/types/verification";

const priorities: VerificationPriority[] = ["low", "medium", "high", "urgent"];

const UNASSIGNED = "__unassigned__";

type NewVerificationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NewVerificationDialog({
  open,
  onOpenChange,
}: NewVerificationDialogProps) {
  const assignees = useAssignees();
  const createMutation = useCreateVerification();

  // assignees ? assignees : fallback from data/ folder
  const assigneeList =
    assignees.data && assignees.data.length > 0
      ? assignees.data
      : fallbackAssignees;

  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [checkType, setCheckType] = useState(
    verificationConfig.checkTypeOptions[0],
  );
  const [priority, setPriority] = useState<VerificationPriority>("medium");
  const [assigneeId, setAssigneeId] = useState<string>(UNASSIGNED);

  const reset = () => {
    setCandidateName("");
    setCandidateEmail("");
    setCheckType(verificationConfig.checkTypeOptions[0]);
    setPriority("medium");
    setAssigneeId(UNASSIGNED);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    createMutation.mutate(
      createVerificationParams({
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim(),
        checkType,
        priority,
        assigneeId: assigneeId === UNASSIGNED ? undefined : assigneeId,
      }),
      {
        onSuccess: (created) => {
          toast.success(`Created ${created.id} for ${created.candidateName}`);
          reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message ?? "Failed to create verification.");
        },
      },
    );
  };

  const canSubmit =
    candidateName.trim().length > 0 &&
    candidateEmail.trim().length > 0 &&
    !createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{verificationConfig.newCaseLabel}</DialogTitle>
          <DialogDescription>
            Start a new background verification case for a candidate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="candidateName">Candidate name</Label>
            <Input
              id="candidateName"
              value={candidateName}
              onChange={(event) => setCandidateName(event.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="candidateEmail">Candidate email</Label>
            <Input
              id="candidateEmail"
              type="email"
              value={candidateEmail}
              onChange={(event) => setCandidateEmail(event.target.value)}
              placeholder="jane@example.com"
              required
            />
          </div>

          <Dropdown
            label="Check type"
            placeholder="Select a check type"
            value={checkType}
            onChange={setCheckType}
            options={verificationConfig.checkTypeOptions.map((option) => ({
              label: option,
              value: option,
            }))}
          />

          <Dropdown
            label="Priority"
            placeholder="Select a priority"
            value={priority}
            onChange={(v) => setPriority(v as VerificationPriority)}
            options={priorities.map((value) => ({
              label: verificationConfig.priorityMeta[value].label,
              value,
            }))}
          />

          <Dropdown
            label="Assign to (optional)"
            placeholder="Unassigned"
            value={assigneeId}
            onChange={setAssigneeId}
            options={[
              { label: "Unassigned", value: UNASSIGNED },
              ...assigneeList.map((assignee) => ({
                label: assignee.name,
                value: assignee.id,
              })),
            ]}
          />

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!canSubmit}>
              {createMutation.isPending ? "Creating..." : "Create case"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
