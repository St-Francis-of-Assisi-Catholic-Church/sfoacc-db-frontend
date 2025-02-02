import React, { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import BaseModal, { BaseModalRef } from "@/components/ui/modal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, MessageSquare } from "lucide-react";
import { IMember } from "../../../_components/member-columns";

type Props = {
  member: IMember;
};

type VerificationChannel = "sms" | "email";

export default function AdminActions({ member }: Props) {
  const modalRef = useRef<BaseModalRef>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [channel, setChannel] = useState<VerificationChannel | null>(null);
  const [isConfirmStep, setIsConfirmStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerificationClick = (event: Event) => {
    event.preventDefault();
    setDropdownOpen(false);
    // Reset state when opening modal
    setChannel(null);
    setIsConfirmStep(false);
    modalRef.current?.openModal();
  };

  const handleSendVerification = async () => {
    if (!channel) return;

    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await fetch('/api/send-verification', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     memberId: member.id,
      //     channel,
      //   }),
      // });

      modalRef.current?.closeModal();
    } catch (error) {
      console.error("Failed to send verification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getChannelInfo = () => {
    if (channel === "sms") {
      return {
        value: member.mobileNumber,
        icon: <MessageSquare className="h-4 w-4" />,
        label: "SMS",
      };
    }
    return {
      value: member.emaillAddress,
      icon: <Mail className="h-4 w-4" />,
      label: "Email",
    };
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger className="flex flex-row justify-between items-center bg-primary text-primary-foreground shadow hover:bg-primary/90 h-[29px] rounded-md px-3 text-xs">
          Actions
          <ChevronDownIcon className="h-4 w-4 ml-2" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2 w-52">
          <DropdownMenuItem>Generate ChurchID</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={handleVerificationClick}
          >
            Send Verification Message
          </DropdownMenuItem>
          <DropdownMenuItem>Verify Account</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
        cancelOnClicked={() => {
          if (isConfirmStep) {
            setIsConfirmStep(false);
          } else {
            modalRef.current?.closeModal();
          }
        }}

        // cancelTitle={isConfirmStep ? "Back" : "Cancel"}
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
                      disabled={!member.mobileNumber}
                    />
                    <Label
                      htmlFor="sms"
                      className="flex items-center space-x-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>
                        SMS ({member.mobileNumber || "No number provided"})
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="email"
                      id="email"
                      disabled={!member.emaillAddress}
                    />
                    <Label
                      htmlFor="email"
                      className="flex items-center space-x-2"
                    >
                      <Mail className="h-4 w-4" />
                      <span>
                        Email ({member.emaillAddress || "No email provided"})
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
    </>
  );
}
