import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BaseModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FilePenLine, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IDetailedParishioner } from "../../_components/member-columns";
import Banner from "@/components/ui/banner";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Props {
  parishioner: IDetailedParishioner;
  refetch: () => void;
}

interface MedicalCondition {
  id?: number;
  condition: string;
  notes?: string | null;
  parishioner_id?: number;
  created_at?: string;
  updated_at?: string;
}

export default function MedicalConditionsCard({ parishioner, refetch }: Props) {
  const [conditions, setConditions] = useState<MedicalCondition[]>(
    parishioner.medical_conditions || []
  );

  const handleUpdateConditions = (newConditions: MedicalCondition[]) => {
    setConditions(newConditions);
    refetch();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medical Conditions</CardTitle>
        <UpdateConditionsModal
          currentConditions={conditions}
          onUpdate={handleUpdateConditions}
          parishionerId={parishioner.id}
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Condition</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conditions.length > 0 ? (
              conditions.map((condition, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {condition.condition}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {condition.notes}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-muted-foreground"
                >
                  No medical conditions reported
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface UpdateConditionsModalProps {
  currentConditions: MedicalCondition[];
  onUpdate: (conditions: MedicalCondition[]) => void;
  parishionerId: number;
}

function UpdateConditionsModal({
  currentConditions,
  onUpdate,

  parishionerId,
}: UpdateConditionsModalProps) {
  const { data: session } = useSession();
  const [localConditions, setLocalConditions] =
    useState<MedicalCondition[]>(currentConditions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentCondition, setCurrentCondition] = useState<MedicalCondition>({
    condition: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentCondition((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCondition = () => {
    if (editingIndex !== null) {
      // Update existing condition
      const updatedConditions = [...localConditions];
      updatedConditions[editingIndex] = currentCondition;
      setLocalConditions(updatedConditions);
      setEditingIndex(null);
    } else {
      // Add new condition
      setLocalConditions([...localConditions, currentCondition]);
    }

    // Reset form
    setCurrentCondition({
      condition: "",
      notes: "",
    });
  };

  const handleEditCondition = (index: number) => {
    setEditingIndex(index);
    setCurrentCondition(localConditions[index]);
  };

  const handleRemoveCondition = (index: number) => {
    setLocalConditions(localConditions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setSuccess(undefined);
      setError(undefined);
      const accessToken = session?.accessToken;
      //
      const response = await fetch(
        `/api/v1/parishioners/${parishionerId}/medical-conditions/batch`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(localConditions),
        }
      );

      if (!response.ok) {
        const info = await response.json();
        if (info.detail) {
          throw new Error(info.detail);
        } else throw new Error("Failed to update medical condition");
      }

      const result = await response.json();

      console.log("Result", result);

      console.log("medic", result.data);
      onUpdate(result.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to save medical conditions:", error);
      setError(
        error.message ||
          "An error occured while trying to update medical condition"
      );

      toast.error(
        error.message ||
          "An error occured while trying update medical condition"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalConditions(currentConditions);
    setCurrentCondition({
      condition: "",
      notes: "",
    });
    setEditingIndex(null);
  };

  return (
    <BaseModal
      title="Update Medical Conditions"
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
      <div className="px-6 py-4 overflow-auto h-[60vh]">
        <div className="space-y-4">
          <Banner
            className="mb-4"
            variant="info"
            title="Quick Notice"
            description="Please add medical condition here and click on 'Add Condition'  then preview and click on 'Save' to save it"
          />

          <Banner
            variant="error"
            className="mb-4"
            title="Error"
            description={error}
          />
          <Banner
            variant="success"
            className="mb-4"
            title="Success"
            description={success}
          />
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="condition" className="text-sm font-medium">
                Condition
              </label>
              <Input
                id="condition"
                placeholder="Enter medical condition"
                name="condition"
                value={currentCondition.condition}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <Textarea
                id="notes"
                placeholder="Add any relevant notes"
                name="notes"
                value={currentCondition.notes!}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleAddCondition}
              disabled={isLoading || !currentCondition.condition}
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingIndex !== null ? "Update" : "Add"} Condition
            </Button>
          </div>

          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Condition</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localConditions.map((condition, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {condition.condition}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {condition.notes}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size={"icon"}
                          onClick={() => handleEditCondition(index)}
                          disabled={isLoading}
                        >
                          <FilePenLine className="h-4 w-5 text-green-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size={"icon"}
                          onClick={() => handleRemoveCondition(index)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {localConditions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No medical conditions recorded yet. Use the form above to add
                conditions.
              </p>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
