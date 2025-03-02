/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { IPersonalInfo } from "./personalInfo";
import { IContactInfo } from "./contactInfo";
import { IOccupationInfo } from "./occuptionInfo";
import { IEmergencyInfo } from "./emergencyInfo";
import { useSession } from "next-auth/react";
import Banner from "@/components/ui/banner";

// Define a type for all the combined data
interface ReviewProps {
  personalInfo: IPersonalInfo;
  contactInfo: IContactInfo;
  occupationInfo: IOccupationInfo;
  emergencyInfo: IEmergencyInfo;
  onBack: () => void;
  completedSteps: number[];
}

// Define a type for the data object that can be any of the info types
type SectionData =
  | IPersonalInfo
  | IContactInfo
  | IOccupationInfo
  | IEmergencyInfo;

const ReviewStep: React.FC<ReviewProps> = ({
  personalInfo,
  contactInfo,
  occupationInfo,
  emergencyInfo,
  onBack,
  completedSteps,
}) => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showDevInfo, setShowDevInfo] = React.useState(
    process.env.NODE_ENV === "development"
  );
  const [apiError, setApiError] = useState<any>(null);
  const [success, setSuccess] = useState<string>();

  // Helper function to remove empty values from an object
  const removeEmptyValues = (obj: Record<string, any>) => {
    const result: Record<string, any> = {};

    Object.entries(obj).forEach(([key, value]) => {
      // Only include values that aren't empty strings, null, or undefined
      if (value !== "" && value !== null && value !== undefined) {
        result[key] = value;
      }
    });

    return result;
  };

  // Helper function to map our form data to the API format
  const mapFormDataToApiFormat = () => {
    // First create the complete object
    const formData = {
      first_name: personalInfo.firstName,
      other_names: personalInfo.otherNames,
      last_name: personalInfo.lastName,
      maiden_name: personalInfo.maidenName,
      gender: personalInfo.gender,
      date_of_birth: personalInfo.dateOfBirth,
      place_of_birth: personalInfo.placeOfBirth,
      hometown: personalInfo.hometown,
      region: personalInfo.region,
      country: personalInfo.country,
      marital_status: personalInfo.maritalStatus,
      mobile_number: contactInfo.mobileNumber,
      whatsapp_number: contactInfo.whatsAppNumber,
      email_address: contactInfo.emaillAddress,
    };

    // Then remove any empty values
    return removeEmptyValues(formData);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setApiError(null);
      setSuccess(undefined);

      const accessToken = session?.accessToken;

      // Format data according to the API requirements
      const formattedData = mapFormDataToApiFormat();

      // Make API call to create the member
      const response = await fetch("/api/v1/parishioners", {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      // Parse the JSON response only once
      const responseData = await response.json();
      console.log("Response:", responseData);

      if (!response.ok) {
        // Set the API error directly from the already parsed response
        setApiError(responseData);
        throw new Error(responseData.detail || "Failed to create member");
      }

      // Show success message
      toast.success("Member created successfully!");
      setSuccess("Parishioner created successfully");

      // Redirect to members list or clear form
      // You might want to add a redirect here
    } catch (error) {
      console.error("Error creating member:", error);
      // Only show toast if we don't have structured API errors
      if (!apiError) {
        toast.error("Failed to create member. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("error", apiError);

  // Determine if we can submit based on required steps
  const canSubmit = completedSteps.includes(1); // Personal info is required

  // Helper function to render section data
  const renderSection = (
    title: string,
    data: SectionData,
    stepCompleted: boolean
  ) => {
    if (!stepCompleted) {
      return null;
    }

    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className="text-muted-foreground">{value || "-"}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 overflow-auto max-h-full pb-20 pr-2">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Review & Submit</h2>
        <p className="text-muted-foreground">
          Please review the information you&apos;ve provided before submitting.
        </p>
      </div>

      {/* Display API validation errors if any */}
      {apiError && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-800 mb-4">
          <h3 className="font-medium">
            {apiError.detail || "Error creating member"}
          </h3>
          {apiError.errors && (
            <div className="mt-2">
              <ul className="list-disc pl-5 space-y-2">
                {apiError.errors.map((error: any, index: number) => (
                  <li key={index} className="text-sm">
                    <span className="font-semibold">
                      {error.loc[error.loc.length - 1]}
                    </span>
                    : {error.msg}
                    {error.input && (
                      <div className="mt-1 text-xs font-mono bg-red-100 p-2 rounded">
                        Submitted: {JSON.stringify(error.input, null, 2)}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <Banner
        variant="info"
        title="Quick Notice"
        description="Please visit the all parishioners page to update the parishioner record"
      />

      <Banner
        variant="success"
        className="mb-4"
        title="Success"
        description={success}
      />

      {renderSection(
        "Personal Information",
        personalInfo,
        completedSteps.includes(1)
      )}
      {renderSection(
        "Contact Information",
        contactInfo,
        completedSteps.includes(2)
      )}
      {renderSection(
        "Occupation Information",
        occupationInfo,
        completedSteps.includes(3)
      )}
      {renderSection(
        "Emergency Contacts",
        emergencyInfo,
        completedSteps.includes(5)
      )}

      {/* Render other sections as needed */}

      {!canSubmit && (
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-yellow-800">
          <p>
            Please complete the required Personal Information section before
            submitting.
          </p>
        </div>
      )}

      {/* Developer information - only visible in development mode */}
      {showDevInfo && (
        <Card className="mb-4 bg-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>API Information (Development Only)</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDevInfo(false)}
              >
                Hide
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono">
              <p className="mb-1">
                <strong>Endpoint:</strong> /api/v1/parishioners/
              </p>
              <p className="mb-1">
                <strong>Method:</strong> POST
              </p>
              <p className="mb-1">
                <strong>Payload:</strong>
              </p>
              <pre className="bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(mapFormDataToApiFormat(), null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Member"}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
