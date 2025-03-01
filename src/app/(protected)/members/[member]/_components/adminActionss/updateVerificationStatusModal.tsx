"use client";

import React from "react";
import BaseModal, { BaseModalRef } from "@/components/ui/modal";
import { IParishioner } from "../../../_components/member-columns";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Banner from "@/components/ui/banner";
import { useSession } from "next-auth/react";

type VerificationStatus = "pending" | "verified" | "unverified";

type Props = {
  modalRef: React.RefObject<BaseModalRef | null>;
  parishioner: IParishioner;
  refetch?: () => void;
};

export default function UpdateVerificationStatusModal({
  parishioner,
  modalRef,
  refetch,
}: Props) {
  // Initialize with the parishioner's current verification status
  const [status, setStatus] = useState<VerificationStatus | null>(
    (parishioner.verification_status as VerificationStatus) || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleUpdateStatus = async () => {
    if (!status) return;

    // If status hasn't changed, no need to update
    if (status === parishioner.verification_status) {
      toast.info("No changes to update");
      modalRef.current?.closeModal();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get access token from next-auth session
      const accessToken = session?.accessToken;

      // API call to update verification status
      const response = await fetch(`/api/v1/parishioners/${parishioner.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          verification_status: status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Store the full error data for displaying in the banner
        setError(JSON.stringify(errorData, null, 2));

        if (errorData.errors && Array.isArray(errorData.errors)) {
          // Format validation errors for toast notification
          const errorMessages = errorData.errors
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((err: any) => err.msg)
            .join("; ");
          toast.error(errorMessages || "Validation failed");
        } else {
          toast.error(
            errorData.detail || "Failed to update verification status"
          );
        }
        return; // Exit early
      }

      // Success message
      toast.success(`Successfully updated verification status to ${status}`);

      // Reset and close modal
      modalRef.current?.closeModal();

      // Refresh data if refetch function is provided
      if (refetch) refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to update verification status:", error);
      toast.error("Failed to update verification status");
      setError(error.message || "Failed to update verification status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    modalRef.current?.closeModal();
    // Reset to parishioner's current value instead of null
    setStatus((parishioner.verification_status as VerificationStatus) || null);
    setError(null);
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
        {error && (
          <div className="mb-4">
            <Banner
              variant="error"
              title="API Error"
              description="There was an error updating the verification status"
              body={
                <div className="text-sm py-1">
                  <pre className="whitespace-pre-wrap overflow-auto max-h-40 p-2 bg-red-50 rounded">
                    {error}
                  </pre>
                </div>
              }
            />
          </div>
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
