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
import { Wand2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import Banner from "@/components/ui/banner";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";

type Props = {
  modalRef: React.RefObject<BaseModalRef | null>;
  parishioner: IParishioner;
};

type FormError = {
  message: string;
  field?: string;
};

type GenerateIdResponse = {
  message: string;
  data: {
    parishioner_id: number;
    old_church_id: string;
    new_church_id: string;
    email_sent: boolean;
  };
};

const validateOldChurchId = (
  id: string
): { isValid: boolean; error?: string } => {
  if (!id) {
    return { isValid: false, error: "Old Church ID is required" };
  }

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [formError, setFormError] = useState<FormError | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [sendEmail, setSendEmail] = useState(false);
  const { data: session } = useSession();

  const handleGenerateId = async () => {
    const validation = validateOldChurchId(oldChurchId!);
    if (!validation.isValid) {
      setFormError({ message: validation.error || "", field: "oldChurchId" });
      return;
    }

    setFormError(null);
    setApiError(null);
    setApiSuccess(null);
    setIsGenerating(true);

    try {
      const accessToken = session?.accessToken;
      const response = await fetch(
        `/api/v1/parishioners/${parishioner.id}/generate-church-id?old_church_id=${oldChurchId}&send_email=${sendEmail}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate Church ID");
      }

      const result: GenerateIdResponse = await response.json();
      setNewChurchId(result.data.new_church_id);

      setApiSuccess(
        `${result.message}${
          result.data.email_sent ? " and email sent successfully" : ""
        }`
      );
    } catch (error) {
      setApiError(
        (error as Error).message ||
          "Failed to generate Church ID. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    modalRef.current?.closeModal();
    setOldChurchId(parishioner.old_church_id || "");
    setNewChurchId(parishioner.new_church_id || "");
    setFormError(null);
    setApiError(null);
    setApiSuccess(null);
    setSendEmail(false);
    setIsGenerating(false);
  };

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
      ctaTitle=""
      isLoading={isGenerating}
      cancelOnClicked={handleClose}
      cancelTitle="Close"
    >
      <div className="px-6 py-4 overflow-auto h-[50vh]">
        {apiError && (
          <Banner
            variant="error"
            title="Error"
            description={apiError}
            className="mb-4"
          />
        )}

        {apiSuccess && (
          <Banner
            variant="success"
            title="Success"
            description={apiSuccess}
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
                  Ensure the user&apos;s <strong>Date of Birth (DOB)</strong>{" "}
                  are already entered
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
              value={oldChurchId || ""}
              onChange={(e) => {
                setOldChurchId(e.target.value);
                if (formError?.field === "oldChurchId") {
                  setFormError(null);
                }
              }}
              placeholder="Enter old Church ID"
              className={
                formError?.field === "oldChurchId" ? "border-red-500" : ""
              }
            />
            {parishioner.old_church_id &&
              oldChurchId !== parishioner.old_church_id && (
                <div className="text-sm text-muted-foreground">
                  Current oldChurchID: {parishioner.old_church_id}
                </div>
              )}
          </div>

          {/* New Church ID display */}
          {newChurchId && (
            <div className="space-y-2">
              <Label>New Church ID</Label>
              <Input value={newChurchId} readOnly className="bg-muted/50" />
              {parishioner.new_church_id &&
                newChurchId !== parishioner.new_church_id && (
                  <div className="text-sm text-muted-foreground">
                    Previous newChurchID: {parishioner.new_church_id}
                  </div>
                )}
            </div>
          )}

          {/* Email notification checkbox */}
          <div className="flex items-center space-x-2 pt-4 border-t">
            <Checkbox
              className="text-green-600"
              id="send-email"
              checked={sendEmail}
              onCheckedChange={(checked) => setSendEmail(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="send-email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
              >
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                Send email notification to parishioner with their Church IDs
              </Label>
              {sendEmail && parishioner.email_address && (
                <p className="text-xs text-muted-foreground">
                  An email will be sent to {parishioner.email_address}
                </p>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="space-y-2">
            <Button
              type="button"
              onClick={handleGenerateId}
              disabled={!oldChurchId || isGenerating}
              className="w-full bg-green-600 text-white hover:bg-green-700 hover:text-white"
            >
              {isGenerating ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              Generate Church ID
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
