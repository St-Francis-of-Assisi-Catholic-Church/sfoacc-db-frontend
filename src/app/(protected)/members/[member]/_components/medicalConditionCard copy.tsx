import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BaseModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MedicalCondition {
  condition: string;
  notes: string;
}

export default function MedicalConditionsCard() {
  const [conditions, setConditions] = useState<MedicalCondition[]>([
    {
      condition: "Type 2 Diabetes",
      notes: "",
    },
    {
      condition: "Hypertension",
      notes: "Regular blood pressure monitoring required",
    },
    {
      condition: "Asthma",
      notes: "Exercise-induced, carries inhaler when needed",
    },
  ]);

  const handleUpdateConditions = (newConditions: MedicalCondition[]) => {
    setConditions(newConditions);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medical Conditions</CardTitle>
        <UpdateConditionsModal
          currentConditions={conditions}
          onUpdate={handleUpdateConditions}
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
}

function UpdateConditionsModal({
  currentConditions,
  onUpdate,
}: UpdateConditionsModalProps) {
  const [localConditions, setLocalConditions] =
    useState<MedicalCondition[]>(currentConditions);
  const [isLoading, setIsLoading] = useState(false);
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
      // TODO: Add API call here
      // const response = await fetch('/api/member/medical-conditions', {
      //   method: 'PUT',
      //   body: JSON.stringify({ conditions: localConditions })
      // });

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onUpdate(localConditions);
    } catch (error) {
      console.error("Failed to save medical conditions:", error);
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
                value={currentCondition.notes}
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
                          size="sm"
                          onClick={() => handleEditCondition(index)}
                          disabled={isLoading}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCondition(index)}
                          disabled={isLoading}
                        >
                          Remove
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
