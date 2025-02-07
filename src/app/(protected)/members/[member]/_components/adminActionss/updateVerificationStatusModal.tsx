/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import BaseModal, { BaseModalRef } from "@/components/ui/modal";
import { IMember } from "../../../_components/member-columns";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Banner from "@/components/ui/banner";

type VerificationStatus = "pending" | "verified" | "unverified";

type Props = {
  modalRef: React.RefObject<BaseModalRef | null>;
  member: IMember;
};

const updateVerification = async (
  memberId: number,
  status: VerificationStatus
) => {
  try {
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // TODO: Replace with actual API call
    // return fetch('/api/members/verification', {
    //   method: 'PATCH',
    //   body: JSON.stringify({ memberId, status }),
    // });
  } catch (error) {
    throw new Error(
      "Failed to update verification status. Please try again later."
    );
  }
};

export default function UpdateVerificationStatusModal({
  member,
  modalRef,
}: Props) {
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleUpdateStatus = async () => {
    if (!status) return;

    setIsLoading(true);
    setApiError(null);

    try {
      await updateVerification(member.systemID, status);
      toast.success(`Successfully updated verification status to ${status}`);
      modalRef.current?.closeModal();
      setStatus(null);
    } catch (error) {
      const errorMessage = (error as Error).message;
      setApiError(errorMessage);
      toast.error("Failed to update verification status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    modalRef.current?.closeModal();
    setStatus(null);
    setApiError(null);
  };

  return (
    <BaseModal
      ref={modalRef}
      title="Update Verification Status"
      buttonComponent={<></>}
      ctaTitle="Update"
      ctaOnClicked={handleUpdateStatus}
      isCtaDisabled={!status || isLoading}
      isLoading={isLoading}
      cancelOnClicked={handleClose}
      cancelTitle="Cancel"
    >
      <div className="p-6 space-y-6">
        {apiError && (
          <Banner
            variant="error"
            title="Error"
            description={apiError}
            className="mb-4"
          />
        )}

        <Banner
          variant="info"
          title="Update Verification Status"
          description="Select the new verification status for this member. This will update their verification status in the system."
        />

        <div className="space-y-4">
          <h3 className="font-medium">Select new status</h3>
          <RadioGroup
            value={status || ""}
            onValueChange={(value: string) =>
              setStatus(value as VerificationStatus)
            }
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="verified" id="verified" />
                <Label htmlFor="verified">Verified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unverified" id="unverified" />
                <Label htmlFor="unverified">Unverified</Label>
              </div>
            </div>
          </RadioGroup>

          {status === "unverified" && (
            <div className="mt-4">
              <Banner
                variant="error"
                title="Warning"
                description="Setting a member as unverified will restrict their access to certain features until their verification is completed."
              />
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
