import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BaseModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { IMember } from "../../_components/member-columns";

type Props = {
  member: IMember;
  refetch?: () => void;
};

interface ContactInfo {
  mobileNumber: string;
  whatsAppNumber: string;
  emaillAddress: string;
}

export default function ContactInformationCard({ member, refetch }: Props) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    mobileNumber: member.mobileNumber,
    whatsAppNumber: member.whatsAppNumber,
    emaillAddress: member.emaillAddress,
  });

  const handleUpdateContact = (newInfo: ContactInfo) => {
    setContactInfo(newInfo);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contact Information</CardTitle>
        <UpdateContactModal
          currentContact={contactInfo}
          onUpdate={handleUpdateContact}
          refetch={refetch}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Mobile Number
          </label>
          <p>{contactInfo.mobileNumber}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            WhatsApp Number
          </label>
          <p>{contactInfo.whatsAppNumber}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Email Address
          </label>
          <p>{contactInfo.emaillAddress}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface UpdateContactModalProps {
  currentContact: ContactInfo;
  onUpdate: (contact: ContactInfo) => void;
  refetch?: () => void;
}

function UpdateContactModal({
  currentContact,
  onUpdate,
  refetch,
}: UpdateContactModalProps) {
  const [localContact, setLocalContact] = useState<ContactInfo>(currentContact);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // TODO: Add API call here
      // const response = await fetch('/api/member/contact-info', {
      //   method: 'PUT',
      //   body: JSON.stringify(localContact)
      // });

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onUpdate(localContact);
      refetch?.();
    } catch (error) {
      console.error("Failed to save contact information:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalContact(currentContact);
  };

  return (
    <BaseModal
      title="Update Contact Information"
      buttonComponent={
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      }
      ctaOnClicked={handleSave}
      ctaTitle="Save"
      isCtaDisabled={
        isLoading || !localContact.mobileNumber || !localContact.emaillAddress
      }
      isLoading={isLoading}
      cancelOnClicked={handleCancel}
      onCloseModal={handleCancel}
    >
      <div className="px-6 py-4">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="mobileNumber" className="text-sm font-medium">
              Mobile Number
            </label>
            <Input
              id="mobileNumber"
              placeholder="Enter mobile number"
              name="mobileNumber"
              value={localContact.mobileNumber}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="whatsAppNumber" className="text-sm font-medium">
              WhatsApp Number
            </label>
            <Input
              id="whatsAppNumber"
              placeholder="Enter WhatsApp number"
              name="whatsAppNumber"
              value={localContact.whatsAppNumber}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="emaillAddress" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="emaillAddress"
              placeholder="Enter email address"
              name="emaillAddress"
              value={localContact.emaillAddress}
              onChange={handleInputChange}
              disabled={isLoading}
              type="email"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
