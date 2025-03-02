import React from "react";
import BaseModal, { BaseModalRef } from "@/components/ui/modal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, MessageSquare } from "lucide-react";
import { IParishioner } from "../../../_components/member-columns";
import { useState } from "react";
import { toast } from "sonner";

type VerificationChannel = "sms" | "email";

type Props = {
  modalRef: React.RefObject<BaseModalRef | null>;
  parishioner: IParishioner;
};

const sendVerification = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memberId: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  channel: VerificationChannel
) => {
  // Simulated API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // TODO: Replace with actual API call
  // return fetch('/api/send-verification', {
  //   method: 'POST',
  //   body: JSON.stringify({ memberId, channel }),
  // });
};

export default function SendVerificationMessageModal({
  parishioner,
  modalRef,
}: Props) {
  const [channel, setChannel] = useState<VerificationChannel | null>(null);
  const [isConfirmStep, setIsConfirmStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendVerification = async () => {
    if (!channel) return;

    const channelInfo = getChannelInfo();
    setIsLoading(true);

    toast.promise(sendVerification(parishioner.id, channel), {
      loading: `Sending verification message via ${channelInfo.label}...`,
      success: () => {
        modalRef.current?.closeModal();
        setChannel(null);
        setIsConfirmStep(false);
        setIsLoading(false);
        return `Verification message sent successfully to ${channelInfo.value}`;
      },
      error: "Failed to send verification message",
    });
  };

  const handleClose = () => {
    if (isConfirmStep) {
      setIsConfirmStep(false);
    } else {
      modalRef.current?.closeModal();
      // Reset states when closing
      setChannel(null);
      setIsConfirmStep(false);
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
        {!isConfirmStep ? (
          <div className="space-y-4">
            <h3 className="font-medium">Select verification channel</h3>
            <RadioGroup
              value={channel || ""}
              onValueChange={(value: string) =>
                setChannel(value as VerificationChannel)
              }
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
