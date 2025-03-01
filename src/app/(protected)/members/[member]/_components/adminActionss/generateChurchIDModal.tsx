/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import BaseModal, { BaseModalRef } from "@/components/ui/modal";
import { IParishioner } from "../../../_components/member-columns";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";
import { cn, generateNewChurchId } from "@/lib/utils";
import Banner from "@/components/ui/banner";

type Props = {
  modalRef: React.RefObject<BaseModalRef | null>;
  parishioner: IParishioner;
};

type FormError = {
  message: string;
  field?: string;
};

const saveChurchIds = async (
  memberId: number,
  oldChurchId: string,
  newChurchId: string
) => {
  try {
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // TODO: Replace with actual API call
    // return fetch('/api/members/church-ids', {
    //   method: 'POST',
    //   body: JSON.stringify({ memberId, oldChurchId, newChurchId }),
    // });
  } catch (error) {
    throw new Error("Failed to save Church IDs. Please try again later.");
  }
};

const validateOldChurchId = (
  id: string
): { isValid: boolean; error?: string } => {
  if (!id) {
    return { isValid: false, error: "Old Church ID is required" };
  }
  // Check if it's a number and between 1-999
  const num = parseInt(id);
  if (isNaN(num) || num <= 0 || num > 999) {
    return {
      isValid: false,
      error: "Old Church ID must be a number between 1 and 999",
    };
  }
  return { isValid: true };
};

export default function GenerateChurchIDModal({
  parishioner,
  modalRef,
}: Props) {
  const [oldChurchId, setOldChurchId] = useState<string | null>(
    parishioner.old_church_id || null
  );
  const [newChurchId, setNewChurchId] = useState<string | null>(
    parishioner.new_church_id || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<FormError | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleGenerateId = () => {
    const validation = validateOldChurchId(oldChurchId!);
    if (!validation.isValid) {
      setFormError({ message: validation.error || "", field: "oldChurchId" });
      return;
    }

    setFormError(null);
    const generated = generateNewChurchId(
      parishioner.first_name,
      parishioner.last_name,
      parishioner.date_of_birth,
      oldChurchId!
    );
    setNewChurchId(generated);
  };

  const handleSave = async () => {
    if (!oldChurchId || !newChurchId) {
      setFormError({
        message: "Please fill in all required fields",
        field: !oldChurchId ? "oldChurchId" : "newChurchId",
      });
      return;
    }

    const validation = validateOldChurchId(oldChurchId);
    if (!validation.isValid) {
      setFormError({ message: validation.error || "", field: "oldChurchId" });
      return;
    }

    setIsLoading(true);
    setFormError(null);
    setApiError(null);

    try {
      await saveChurchIds(parishioner.id, oldChurchId, newChurchId);
      toast.success("Successfully saved Church IDs");
      modalRef.current?.closeModal();
    } catch (error) {
      setApiError((error as Error).message);
      toast.error("Failed to save Church IDs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    modalRef.current?.closeModal();
    setOldChurchId(parishioner.old_church_id || "");
    setNewChurchId(parishioner.new_church_id || "");
    setFormError(null);
    setApiError(null);
  };

  const hasChanges =
    oldChurchId !== parishioner.old_church_id ||
    newChurchId !== parishioner.new_church_id;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <BaseModal
      ref={modalRef}
      title="Church ID Management"
      buttonComponent={<></>}
      ctaTitle="Save"
      ctaOnClicked={handleSave}
      isCtaDisabled={!oldChurchId || !newChurchId || !hasChanges || isLoading}
      isLoading={isLoading}
      cancelOnClicked={handleClose}
      cancelTitle="Cancel"
    >
      <div className="px-6 py-4 overflow-auto h-[50vh]">
        {apiError && (
          <Banner
            variant="error"
            title="API Error"
            description={apiError}
            className="mb-4"
          />
        )}

        {formError && (
          <Banner
            variant="error"
            title="Validation Error"
            description={formError.message}
            className="mb-4"
          />
        )}

        <Banner
          variant="info"
          description="Follow the steps below to generate the Church ID"
          title="Generating Church ID"
          body={
            <div className="space-y-2">
              <ul className="list-disc pl-5 text-sm">
                <li>
                  Ensure the user&apos;s <strong>First Name</strong> and{" "}
                  <strong>Last Name</strong> are already entered.
                </li>
                <li>
                  Enure the user&apos;s <strong>Date of Birth (DOB)</strong> are
                  already entered
                </li>
                <li>
                  Enter the <strong>Old Church ID</strong> (3-digit number) if
                  not already entered.
                </li>
                <li>
                  Click <strong>Generate</strong> to generate the new Church ID
                  using this format:
                  <br />
                  <code className="bg-gray-100 p-1 rounded text-xs">
                    First Initial + Last Initial + Day of Birth(2digit) + Month
                    of Birth(2digit) + &quot;-&quot; + Old Church ID(3 digits)
                  </code>
                </li>
                <li>If auto-generation fails, manually enter the Church ID.</li>
                <li>Click save to save the IDs</li>
              </ul>
            </div>
          }
        />

        <div className="space-y-4 mt-2">
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">
                  First Name
                </Label>
                <div className="font-medium">{parishioner.first_name}</div>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">
                  Last Name
                </Label>
                <div className="font-medium">{parishioner.last_name}</div>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">
                  Date of Birth
                </Label>
                <div className="font-medium">
                  {formatDate(parishioner.date_of_birth)}
                </div>
              </div>
            </div>
          </div>

          {/* System ID Display */}
          <div className="space-y-2">
            <Label>System ID</Label>
            <Input value={parishioner.id} disabled className="bg-muted" />
          </div>

          {/* Old Church ID Input */}
          <div className="space-y-2">
            <Label htmlFor="old-church-id">Old Church ID</Label>
            <Input
              id="old-church-id"
              value={oldChurchId!}
              onChange={(e) => {
                setOldChurchId(e.target.value);
                // Clear error when user starts typing
                if (formError?.field === "oldChurchId") {
                  setFormError(null);
                }
              }}
              placeholder="Enter old Church ID"
              className={
                formError?.field === "oldChurchId" ? "border-red-500" : ""
              }
            />
            {parishioner.old_church_id && hasChanges && (
              <div className="text-sm text-muted-foreground">
                Current: {parishioner.old_church_id}
              </div>
            )}
          </div>

          {/* New Church ID Input with Generate Button */}
          <div className="space-y-2">
            <Label>New Church ID</Label>
            <div className="gap-2 grid grid-cols-3">
              <Input
                value={newChurchId!}
                onChange={(e) => {
                  setNewChurchId(e.target.value);
                  // Clear error when user starts typing
                  if (formError?.field === "newChurchId") {
                    setFormError(null);
                  }
                }}
                placeholder="New Church ID"
                className={cn(
                  "col-span-2",
                  formError?.field === "newChurchId" ? "border-red-500" : ""
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateId}
                disabled={!oldChurchId}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
            {parishioner.new_church_id && hasChanges && (
              <div className="text-sm text-muted-foreground">
                Current: {parishioner.new_church_id}
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Format: First Name Initials + Last Name Initials + Day of Birth +
              Month of Birth + &quot;-&quot; + Old Church ID (3 digits)
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
