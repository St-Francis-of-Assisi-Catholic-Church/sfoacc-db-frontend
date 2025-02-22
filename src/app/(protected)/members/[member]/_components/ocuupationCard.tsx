import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BaseModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Occupation {
  role: string;
  employer: string;
}

export default function OccupationCard() {
  const [occupation, setOccupation] = useState<Occupation>({
    role: "Teacher",
    employer: "West Africa Civil Society Institute WACSI",
  });

  const handleUpdateOccupation = (newOccupation: Occupation) => {
    setOccupation(newOccupation);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Occupation</CardTitle>
        <UpdateOccupationModal
          currentOccupation={occupation}
          onUpdate={handleUpdateOccupation}
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Occupation</TableHead>
              <TableHead>Employer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{occupation.role}</TableCell>
              <TableCell>{occupation.employer}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface UpdateOccupationModalProps {
  currentOccupation: Occupation;
  onUpdate: (occupation: Occupation) => void;
}

function UpdateOccupationModal({
  currentOccupation,
  onUpdate,
}: UpdateOccupationModalProps) {
  const [localOccupation, setLocalOccupation] =
    useState<Occupation>(currentOccupation);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalOccupation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // TODO: Add API call here
      // const response = await fetch('/api/member/occupation', {
      //   method: 'PUT',
      //   body: JSON.stringify(localOccupation)
      // });

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onUpdate(localOccupation);
    } catch (error) {
      console.error("Failed to save occupation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalOccupation(currentOccupation);
  };

  return (
    <BaseModal
      title="Update Occupation"
      buttonComponent={
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      }
      ctaOnClicked={handleSave}
      ctaTitle="Save"
      isCtaDisabled={isLoading}
      isLoading={isLoading}
      cancelOnClicked={handleCancel}
      onCloseModal={handleCancel}
    >
      <div className="px-6 py-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Occupation/Role
              </label>
              <Input
                id="role"
                name="role"
                placeholder="Enter your occupation or role"
                value={localOccupation.role}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="employer" className="text-sm font-medium">
                Employer
              </label>
              <Input
                id="employer"
                name="employer"
                placeholder="Enter your employer"
                value={localOccupation.employer}
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
