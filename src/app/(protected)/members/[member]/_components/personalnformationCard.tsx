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

interface Props {
  parishioner: IDetailedParishioner;
  refetch: () => void;
}

interface PersonalInfo {
  firstName: string;
  otherNames: string;
  lastName: string;
  maidenName: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  hometown: string;
  region: string;
  country: string;
  maritalStatus: string;
  place_of_worship: string;
  current_residence: string;
}

export default function PersonalInformationCard({
  parishioner,
  refetch,
}: Props) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: parishioner.first_name,
    otherNames: parishioner.other_names || "",
    lastName: parishioner.last_name,
    maidenName: parishioner.maiden_name || "",
    gender: parishioner.gender || "",
    dateOfBirth: parishioner.date_of_birth,
    placeOfBirth: parishioner.place_of_birth || "",
    hometown: parishioner.hometown || "",
    region: parishioner.region || "",
    country: parishioner.country || "",
    maritalStatus: parishioner.marital_status || "",
    place_of_worship: parishioner.place_of_worship || "",
    current_residence: parishioner.current_residence || "",
  });

  const handleUpdateInfo = (newInfo: PersonalInfo) => {
    setPersonalInfo(newInfo);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Personal Information</CardTitle>
        <UpdatePersonalModal
          currentInfo={personalInfo}
          onUpdate={handleUpdateInfo}
          parishionerId={parishioner.id}
          refetch={refetch}
        />
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <p>
                {personalInfo.firstName} {personalInfo.otherNames}{" "}
                {personalInfo.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Maiden Name
              </label>
              <p>{personalInfo.maidenName || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Gender
              </label>
              <p>
                {personalInfo.gender
                  ? personalInfo.gender.charAt(0).toUpperCase() +
                    personalInfo.gender.slice(1)
                  : ""}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date of Birth
              </label>
              <p>{new Date(personalInfo.dateOfBirth).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Place of Birth
              </label>
              <p>{personalInfo.placeOfBirth || "-"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Place of Worship
              </label>
              <p>{personalInfo.place_of_worship || "-"}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Hometown
              </label>
              <p>{personalInfo.hometown || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Region
              </label>
              <p>{personalInfo.region || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Country
              </label>
              <p>{personalInfo.country || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Marital Status
              </label>
              <p>
                {personalInfo.maritalStatus
                  ? personalInfo.maritalStatus.charAt(0).toUpperCase() +
                    personalInfo.maritalStatus.slice(1)
                  : "-"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Current Residence
              </label>
              <p>{personalInfo.current_residence || "-"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface UpdatePersonalModalProps {
  currentInfo: PersonalInfo;
  onUpdate: (info: PersonalInfo) => void;
  parishionerId: number;
  refetch: () => void;
}

function UpdatePersonalModal({
  currentInfo,
  onUpdate,
  parishionerId,
  refetch,
}: UpdatePersonalModalProps) {
  const [localInfo, setLocalInfo] = useState<PersonalInfo>(currentInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Check if there are any changes to the personal information
  const hasChanges =
    localInfo.firstName !== currentInfo.firstName ||
    localInfo.otherNames !== currentInfo.otherNames ||
    localInfo.lastName !== currentInfo.lastName ||
    localInfo.maidenName !== currentInfo.maidenName ||
    localInfo.gender !== currentInfo.gender ||
    localInfo.dateOfBirth !== currentInfo.dateOfBirth ||
    localInfo.placeOfBirth !== currentInfo.placeOfBirth ||
    localInfo.hometown !== currentInfo.hometown ||
    localInfo.region !== currentInfo.region ||
    localInfo.country !== currentInfo.country ||
    localInfo.maritalStatus !== currentInfo.maritalStatus ||
    localInfo.current_residence != currentInfo.current_residence ||
    localInfo.place_of_worship != currentInfo.place_of_worship;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      // Get access token from next-auth session
      const accessToken = session?.accessToken;

      // API call to update personal information
      const response = await fetch(`/api/v1/parishioners/${parishionerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          first_name: localInfo.firstName,
          other_names: localInfo.otherNames || null,
          last_name: localInfo.lastName,
          maiden_name: localInfo.maidenName || null,
          gender: localInfo.gender ? localInfo.gender.toLowerCase() : null, // Convert to lowercase
          date_of_birth: localInfo.dateOfBirth,
          place_of_birth: localInfo.placeOfBirth || null,
          hometown: localInfo.hometown || null,
          region: localInfo.region || null,
          country: localInfo.country || null,
          marital_status: localInfo.maritalStatus
            ? localInfo.maritalStatus.toLowerCase()
            : null, // Convert to lowercase
          place_of_worship: localInfo.place_of_worship || null,
          current_residence: localInfo.current_residence || null,
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
            errorData.detail || "Failed to update personal information"
          );
        }
        return; // Exit early
      }

      // Success message
      toast.success("Personal information updated successfully");

      onUpdate(localInfo);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to save personal information:", error);
      toast.error("Failed to update personal information");
      setError(error.message || "Failed to update personal information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalInfo(currentInfo);
    setError(null); // Clear any errors when canceling
  };

  const isFormValid = () => {
    return (
      localInfo.firstName.trim() !== "" &&
      localInfo.lastName.trim() !== "" &&
      localInfo.dateOfBirth !== ""
    );
  };

  return (
    <BaseModal
      title="Update Personal Information"
      buttonComponent={
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4 text-green-600" />
        </Button>
      }
      ctaOnClicked={handleSave}
      ctaTitle="Save"
      isCtaDisabled={
        isLoading || !isFormValid() || !hasChanges // Disable the button if no changes were made
      }
      isLoading={isLoading}
      cancelOnClicked={handleCancel}
      onCloseModal={handleCancel}
    >
      <div className="px-6 py-4 overflow-auto max-h-[70vh]">
        <Banner
          className="mb-4"
          variant="info"
          description=" Remember to regenerate the Parishioner's new church ID after
                  updating any of the following records"
          title="Quick Notice"
          body={
            <div className="space-y-2">
              <ol className="list-disc pl-5 text-sm">
                <li>First Name</li>
                <li>Last Name</li>
                <li>Date of Birth</li>
              </ol>
            </div>
          }
        />
        {error && (
          <Banner
            className="mb-4"
            variant="error"
            title="API Error"
            description="There was an error updating the personal information"
            body={
              <div className="text-sm py-1">
                <pre className="whitespace-pre-wrap overflow-auto max-h-40 p-2 bg-red-50 rounded">
                  {error}
                </pre>
              </div>
            }
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name *
              </label>
              <Input
                id="firstName"
                name="firstName"
                value={localInfo.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="otherNames" className="text-sm font-medium">
                Other Names
              </label>
              <Input
                id="otherNames"
                name="otherNames"
                value={localInfo.otherNames}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name *
              </label>
              <Input
                id="lastName"
                name="lastName"
                value={localInfo.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="maidenName" className="text-sm font-medium">
                Maiden Name
              </label>
              <Input
                id="maidenName"
                name="maidenName"
                value={localInfo.maidenName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="gender" className="text-sm font-medium">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={localInfo.gender}
                onChange={handleSelectChange}
                disabled={isLoading}
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of Birth *
              </label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={localInfo.dateOfBirth}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="placeOfBirth" className="text-sm font-medium">
                Place of Birth
              </label>
              <Input
                id="placeOfBirth"
                name="placeOfBirth"
                value={localInfo.placeOfBirth}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="hometown" className="text-sm font-medium">
                Hometown
              </label>
              <Input
                id="hometown"
                name="hometown"
                value={localInfo.hometown}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="region" className="text-sm font-medium">
                Region
              </label>
              <Input
                id="region"
                name="region"
                value={localInfo.region}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="country" className="text-sm font-medium">
                Country
              </label>
              <Input
                id="country"
                name="country"
                value={localInfo.country}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="maritalStatus" className="text-sm font-medium">
                Marital Status
              </label>
              <select
                name="maritalStatus"
                id="maritalStatus"
                value={localInfo.maritalStatus}
                onChange={handleSelectChange}
                disabled={isLoading}
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">Select marital status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="country" className="text-sm font-medium">
                Country
              </label>
              <Input
                id="country"
                name="country"
                value={localInfo.country}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="current_residence"
                className="text-sm font-medium"
              >
                Current Residence
              </label>
              <Input
                id="current_residence"
                name="current_residence"
                value={localInfo.current_residence}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="place_of_worship" className="text-sm font-medium">
                Place of Worship
              </label>
              <Input
                id="place_of_worship"
                name="place_of_worship"
                value={localInfo.place_of_worship}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
