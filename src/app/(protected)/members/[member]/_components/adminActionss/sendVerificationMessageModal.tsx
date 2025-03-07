import React from "react";
import BaseModal, { BaseModalRef } from "@/components/ui/modal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, MessageSquare } from "lucide-react";
import { IParishioner } from "../../../_components/member-columns";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Banner from "@/components/ui/banner";

type VerificationChannel = "sms" | "email";

type Props = {
  modalRef: React.RefObject<BaseModalRef | null>;
  parishioner: IParishioner;
};

type VerificationResponse = {
  message: string;
  data?: {
    parishioner_id: number;
    channel: string;
    sent_to: string;
  };
};

export default function SendVerificationMessageModal({
  parishioner,
  modalRef,
}: Props) {
  const [channel, setChannel] = useState<VerificationChannel | null>(null);
  const [isConfirmStep, setIsConfirmStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { data: session } = useSession();

  const sendVerification = async (
    parishionerId: number,
    channel: VerificationChannel
  ): Promise<VerificationResponse> => {
    try {
      const accessToken = session?.accessToken;
      const response = await fetch(
        `/api/v1/parishioners/verify?parishioner_id=${parishionerId}&channel=${channel}`,
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
        throw new Error(
          errorData.message || `Failed to send verification via ${channel}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        (error as Error).message || `Failed to send verification via ${channel}`
      );
    }
  };

  const handleSendVerification = async () => {
    if (!channel) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const result = await sendVerification(parishioner.id, channel);

      toast.success(result.message || "Verification message sent successfully");
      modalRef.current?.closeModal();
      resetState();
    } catch (error) {
      setApiError((error as Error).message);
      toast.error("Failed to send verification message");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setChannel(null);
    setIsConfirmStep(false);
    setApiError(null);
  };

  const handleClose = () => {
    if (isConfirmStep) {
      setIsConfirmStep(false);
      setApiError(null);
    } else {
      modalRef.current?.closeModal();
      resetState();
    }
  };

  const getChannelInfo = () => {
    if (channel === "sms") {
      return {
        value: parishioner.mobile_number,
        icon: <MessageSquare className="h-4 w-4" />,
        label: "SMS",
      };
    }
    return {
      value: parishioner.email_address,
      icon: <Mail className="h-4 w-4" />,
      label: "Email",
    };
  };

  return (
    <BaseModal
      ref={modalRef}
      title="Send Verification Message"
      buttonComponent={<></>}
      ctaTitle={isConfirmStep ? "Send" : "Next"}
      ctaOnClicked={
        isConfirmStep ? handleSendVerification : () => setIsConfirmStep(true)
      }
      isCtaDisabled={!channel || isLoading}
      isLoading={isLoading}
      cancelOnClicked={handleClose}
      cancelTitle={isConfirmStep ? "Back" : "Cancel"}
    >
      <div className="p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
        {apiError && (
          <Banner
            variant="error"
            title="Error"
            description={apiError}
            className="mb-4"
          />
        )}

        {!isConfirmStep ? (
          <div className="space-y-4">
            <h3 className="font-medium">Select verification channel</h3>
            <RadioGroup
              value={channel || ""}
              onValueChange={(value: string) => {
                setChannel(value as VerificationChannel);
                setApiError(null);
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="sms"
                    id="sms"
                    disabled={!parishioner.mobile_number}
                  />
                  <Label htmlFor="sms" className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>
                      SMS ({parishioner.mobile_number || "No number provided"})
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="email"
                    id="email"
                    disabled={!parishioner.email_address}
                  />
                  <Label
                    htmlFor="email"
                    className="flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>
                      Email ({parishioner.email_address || "No email provided"})
                    </span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertDescription className="flex items-center space-x-2">
                {channel && (
                  <>
                    {getChannelInfo().icon}
                    <span>
                      Verification message will be sent via{" "}
                      {getChannelInfo().label} to{" "}
                      <span className="font-medium">
                        {getChannelInfo().value}
                      </span>
                    </span>
                  </>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
