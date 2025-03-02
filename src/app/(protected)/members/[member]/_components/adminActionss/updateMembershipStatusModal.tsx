import React from "react";
import BaseModal, { BaseModalRef } from "@/components/ui/modal";
import { IParishioner } from "../../../_components/member-columns";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Banner from "@/components/ui/banner";

type MembershipStatus = "active" | "deceased" | "disabled";

type Props = {
  modalRef: React.RefObject<BaseModalRef | null>;
  parishioner: IParishioner;
  refetch?: () => void;
};

export default function UpdateMembershipStatusModal({
  parishioner,
  modalRef,
  refetch,
}: Props) {
  // Initialize with the parishioner's current membership status
  const [status, setStatus] = useState<MembershipStatus>(
    parishioner.membership_status as MembershipStatus
  );
  // const [deceasedDate, setDeceasedDate] = useState<string>(
  //   parishioner.date_of_death || ""
  // );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleUpdateStatus = async () => {
    if (!status) return;

    // If status hasn't changed, no need to update
    if (status === parishioner.membership_status) {
      toast.info("No changes to update");
      modalRef.current?.closeModal();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get access token from next-auth session
      const accessToken = session?.accessToken;

      // API call to update membership status
      const response = await fetch(`/api/v1/parishioners/${parishioner.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          membership_status: status,
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
          toast.error(errorData.detail || "Failed to update membership status");
        }
        return; // Exit early
      }

      // Success message
      const statusInfo = status;
      toast.success(`Successfully updated membership status to ${statusInfo}`);

      // Reset and close modal
      modalRef.current?.closeModal();
      // setStatus(null);
      // setDeceasedDate("");

      // Refresh data if refetch function is provided
      if (refetch) refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to update membership status:", error);
      toast.error("Failed to update membership status");
      setError(error.message || "Failed to update membership status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    modalRef.current?.closeModal();
    // Reset to parishioner's current values instead of null
    setStatus((parishioner.membership_status as MembershipStatus) || null);
    // setDeceasedDate(parishioner.date_of_death || "");
    setError(null);
  };

  const isValid = status;

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
        {error && (
          <div className="mb-4">
            <Banner
              variant="error"
              title="API Error"
              description="There was an error updating the membership status"
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
          {/* 
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
          )} */}
        </div>
      </div>
    </BaseModal>
  );
}
