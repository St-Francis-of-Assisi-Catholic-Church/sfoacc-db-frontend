/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import BaseModal, { BaseModalRef } from "@/components/ui/modal";
import { IMember } from "../../../_components/member-columns";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type MembershipStatus = "active" | "deceased" | "disabled";

type Props = {
  modalRef: React.RefObject<BaseModalRef | null>;
  member: IMember;
};

const updateMembership = async (
  memberId: number,
  status: MembershipStatus,
  deceasedDate?: string
) => {
  // Simulated API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // TODO: Replace with actual API call
  // return fetch('/api/members/status', {
  //   method: 'PATCH',
  //   body: JSON.stringify({ memberId, status, deceasedDate }),
  // });
};

export default function UpdateMembershipStatusModal({
  member,
  modalRef,
}: Props) {
  const [status, setStatus] = useState<MembershipStatus | null>(null);
  const [deceasedDate, setDeceasedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStatus = async () => {
    if (!status) return;

    setIsLoading(true);
    const statusInfo =
      status === "deceased" ? `${status} (${deceasedDate})` : status;

    toast.promise(
      updateMembership(
        member.systemID,
        status,
        status === "deceased" ? deceasedDate : undefined
      ),
      {
        loading: "Updating membership status...",
        success: () => {
          modalRef.current?.closeModal();
          setStatus(null);
          setDeceasedDate("");
          setIsLoading(false);
          return `Successfully updated membership status to ${statusInfo}`;
        },
        error: "Failed to update membership status",
      }
    );
  };

  const handleClose = () => {
    modalRef.current?.closeModal();
    setStatus(null);
    setDeceasedDate("");
  };

  const isValid =
    status &&
    (status !== "deceased" || (status === "deceased" && deceasedDate));

  return (
    <BaseModal
      ref={modalRef}
      title="Update Membership Status"
      buttonComponent={<></>}
      ctaTitle="Update"
      ctaOnClicked={handleUpdateStatus}
      isCtaDisabled={!isValid || isLoading}
      isLoading={isLoading}
      cancelOnClicked={handleClose}
      cancelTitle="Cancel"
    >
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Select new status</h3>
          <RadioGroup
            value={status || ""}
            onValueChange={(value: string) =>
              setStatus(value as MembershipStatus)
            }
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deceased" id="deceased" />
                <Label htmlFor="deceased">Deceased</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="disabled" id="disabled" />
                <Label htmlFor="disabled">Disabled</Label>
              </div>
            </div>
          </RadioGroup>

          {status === "deceased" && (
            <div className="space-y-2 pt-4">
              <Label htmlFor="deceased-date">Date of Death</Label>
              <Input
                type="date"
                id="deceased-date"
                value={deceasedDate}
                onChange={(e) => setDeceasedDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
