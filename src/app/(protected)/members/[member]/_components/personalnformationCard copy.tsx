import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BaseModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Pencil } from "lucide-react";
import { IDetailedParishioner } from "../../_components/member-columns";

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
}

export default function PersonalInformationCard({
  parishioner,
  refetch,
}: Props) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: parishioner.first_name,
    otherNames: parishioner.other_names!,
    lastName: parishioner.last_name,
    maidenName: parishioner.maiden_name!,
    gender: parishioner.gender,
    dateOfBirth: parishioner.date_of_birth,
    placeOfBirth: parishioner.place_of_birth,
    hometown: parishioner.hometown,
    region: parishioner.region,
    country: parishioner.country,
    maritalStatus: parishioner.marital_status,
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
              <p>{personalInfo.maidenName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Gender
              </label>
              <p>{personalInfo.gender}</p>
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
              <p>{personalInfo.placeOfBirth}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Hometown
              </label>
              <p>{personalInfo.hometown}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Region
              </label>
              <p>{personalInfo.region}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Country
              </label>
              <p>{personalInfo.country}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Marital Status
              </label>
              <p>{personalInfo.maritalStatus}</p>
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
  refetch: () => void;
}

function UpdatePersonalModal({
  currentInfo,
  onUpdate,
  refetch,
}: UpdatePersonalModalProps) {
  const [localInfo, setLocalInfo] = useState<PersonalInfo>(currentInfo);
  const [isLoading, setIsLoading] = useState(false);

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
      // TODO: Add API call here
      // const response = await fetch('/api/member/personal-info', {
      //   method: 'PUT',
      //   body: JSON.stringify(localInfo)
      // });

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onUpdate(localInfo);
      refetch();
    } catch (error) {
      console.error("Failed to save personal information:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalInfo(currentInfo);
  };

  const isFormValid = () => {
    return (
      localInfo.firstName.trim() !== "" &&
      localInfo.lastName.trim() !== "" &&
      localInfo.gender !== "" &&
      localInfo.dateOfBirth !== ""
    );
  };

  return (
    <BaseModal
      title="Update Personal Information"
      buttonComponent={
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      }
      ctaOnClicked={handleSave}
      ctaTitle="Save"
      isCtaDisabled={isLoading || !isFormValid()}
      isLoading={isLoading}
      cancelOnClicked={handleCancel}
      onCloseModal={handleCancel}
    >
      <div className="px-6 py-4 overflow-auto max-h-[70vh]">
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
                Gender *
              </label>
              <select
                name="gender"
                id="gender"
                value={localInfo.gender}
                onChange={handleSelectChange}
                disabled={isLoading}
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
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
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
