import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BaseModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { IDetailedParishioner } from "../../_components/member-columns";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Banner from "@/components/ui/banner";

type Props = {
  parishioner: IDetailedParishioner;
  refetch?: () => void;
};

interface ContactInfo {
  mobileNumber: string;
  whatsAppNumber: string; // No longer nullable
  emaillAddress: string;
}

interface ValidationErrors {
  mobileNumber?: string;
  whatsAppNumber?: string;
  emaillAddress?: string;
}

export default function ContactInformationCard({
  parishioner,
  refetch,
}: Props) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    mobileNumber: parishioner.mobile_number || "",
    whatsAppNumber: parishioner.whatsapp_number || "", // Convert null to empty string
    emaillAddress: parishioner.email_address || "",
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
          parishionerId={parishioner.id}
          refetch={refetch}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Mobile Number
          </label>
          <p>{contactInfo.mobileNumber || "Not provided"}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            WhatsApp Number
          </label>
          <p>{contactInfo.whatsAppNumber || "Not provided"}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Email Address
          </label>
          <p>{contactInfo.emaillAddress || "Not provided"}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface UpdateContactModalProps {
  currentContact: ContactInfo;
  onUpdate: (contact: ContactInfo) => void;
  parishionerId: number;
  refetch?: () => void;
}

function UpdateContactModal({
  currentContact,
  onUpdate,
  parishionerId,
  refetch,
}: UpdateContactModalProps) {
  const [localContact, setLocalContact] = useState<ContactInfo>(currentContact);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { data: session } = useSession();

  // Check if there are any changes to the contact information
  const hasChanges =
    localContact.mobileNumber !== currentContact.mobileNumber ||
    localContact.whatsAppNumber !== currentContact.whatsAppNumber ||
    localContact.emaillAddress !== currentContact.emaillAddress;

  const validateNumericInput = (
    value: string,
    fieldName: "mobileNumber" | "whatsAppNumber"
  ) => {
    // Check if input contains only digits
    if (value && !/^\d+$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Only numbers are allowed",
      }));
      return false;
    } else {
      // Clear the error if input is valid or empty
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
      return true;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For number fields, validate that they contain only digits
    if (name === "mobileNumber" || name === "whatsAppNumber") {
      validateNumericInput(value, name as "mobileNumber" | "whatsAppNumber");
    }

    setLocalContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Get access token from next-auth session
      const accessToken = session?.accessToken;

      // API call to update contact information - using the endpoint from your curl example
      const response = await fetch(`/api/v1/parishioners/${parishionerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          mobile_number: localContact.mobileNumber,
          whatsapp_number: localContact.whatsAppNumber || null, // Convert empty string back to null for API
          email_address: localContact.emaillAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to update contact information"
        );
      }

      // Success message
      toast.success("Contact information updated successfully");

      onUpdate(localContact);

      // Call refetch to refresh the data
      if (refetch) refetch();
    } catch (error) {
      console.error("Failed to save contact information:", error);
      toast.error("Failed to update contact information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalContact(currentContact);
  };

  // Check if there are any validation errors
  const hasValidationErrors = Object.values(errors).some(
    (error) => error !== undefined
  );

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
        isLoading ||
        !localContact.mobileNumber ||
        !localContact.emaillAddress ||
        !hasChanges || // Disable the button if no changes were made
        hasValidationErrors // Disable if there are validation errors
      }
      isLoading={isLoading}
      cancelOnClicked={handleCancel}
      onCloseModal={handleCancel}
    >
      <div className="px-6 py-4">
        <div className="space-y-4">
          <Banner
            variant="info"
            description="Please note the following before you update parishioner's contact information"
            title="Quick Notice"
            body={
              <div className="space-y-2">
                <ul className="list-disc pl-5 text-sm">
                  <li>
                    Ensure both <strong>Mobile</strong> and{" "}
                    <strong>WhatsApp</strong> numbers begin with{" "}
                    <strong>country code</strong> <i>eg: 233540989099</i>
                  </li>
                </ul>
              </div>
            }
          />
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
            {errors.mobileNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.mobileNumber}</p>
            )}
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
            {errors.whatsAppNumber && (
              <p className="text-sm text-red-500 mt-1">
                {errors.whatsAppNumber}
              </p>
            )}
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
