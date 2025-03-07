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

import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Banner from "@/components/ui/banner";
import { IDetailedParishioner } from "../../_components/member-columns";

type Props = {
  parishioner: IDetailedParishioner;
  refetch?: () => void;
};

export interface Occupation {
  role: string;
  employer: string;
}

export default function OccupationCard({ parishioner, refetch }: Props) {
  const [occupation, setOccupation] = useState<Occupation>({
    role: parishioner.occupation?.role || "",
    employer: parishioner.occupation?.employer || "",
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
          parishionerId={parishioner.id}
          refetch={refetch}
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
              <TableCell className="font-medium">
                {parishioner.occupation?.role || "Not provided"}
              </TableCell>
              <TableCell>
                {parishioner.occupation?.employer || "Not provided"}
              </TableCell>
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
  parishionerId: number;
  refetch?: () => void;
}

function UpdateOccupationModal({
  currentOccupation,
  onUpdate,
  parishionerId,
  refetch,
}: UpdateOccupationModalProps) {
  const [localOccupation, setLocalOccupation] =
    useState<Occupation>(currentOccupation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Check if there are any changes to the occupation information
  const hasChanges =
    localOccupation.role !== currentOccupation.role ||
    localOccupation.employer !== currentOccupation.employer;

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
      setError(null); // Clear any previous errors

      // Get access token from next-auth session
      const accessToken = session?.accessToken;

      // API call to update occupation information
      const response = await fetch(
        `/api/v1/parishioners/${parishionerId}/occupation/`,
        {
          method: "PUT", // Using POST as per the API endpoint
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            role: localOccupation.role || null,
            employer: localOccupation.employer || null,
          }),
        }
      );

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
            errorData.detail || "Failed to update occupation information"
          );
        }
        return; // Exit early
      }

      // Success message
      toast.success("Occupation information updated successfully");

      onUpdate(localOccupation);

      // Call refetch to refresh the data if provided
      if (refetch) refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to save occupation information:", error);
      toast.error("Failed to update occupation information");
      setError(error.message || "Failed to update occupation information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalOccupation(currentOccupation);
    setError(null); // Clear any errors when canceling
  };

  return (
    <BaseModal
      title="Update Occupation"
      buttonComponent={
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4 text-green-600" />
        </Button>
      }
      ctaOnClicked={handleSave}
      ctaTitle="Save"
      isCtaDisabled={
        isLoading || !hasChanges // Disable the button if no changes were made
      }
      isLoading={isLoading}
      cancelOnClicked={handleCancel}
      onCloseModal={handleCancel}
    >
      <div className="px-6 py-4">
        {error && (
          <div className="mb-4">
            <Banner
              variant="error"
              title="API Error"
              description="There was an error updating the occupation information"
              body={
                <div className="text-sm py-1">
                  <pre className="whitespace-pre-wrap overflow-auto max-h-40 p-2 bg-red-50 rounded">
                    {error}
                  </pre>
                </div>
              }
            />
          </div>
        )}
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
