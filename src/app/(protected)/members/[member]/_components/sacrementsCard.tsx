import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BaseModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilePenLine, Pencil, Plus, Trash2 } from "lucide-react";
import Banner from "@/components/ui/banner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IDetailedParishioner } from "../../_components/member-columns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Props {
  parishioner: IDetailedParishioner;
  refetch: () => void;
}

export interface IParSacrament {
  id?: number;
  type: string;
  date: string;
  place: string;
  minister: string;
  parishioner_id: number;
  created_at?: string;
  updated_at?: string;
}

// This maps from display names to API expected values
const CATHOLIC_SACRAMENTS = {
  Baptism: "Baptism",
  "First Holy Communion": "First Holy Communion",
  Confirmation: "Confirmation",
  Penance: "Penance",
  "Anointing of the Sick": "Anointing of the Sick",
  "Holy Orders": "Holy Orders",
  "Holy Matrimony": "Holy Matrimony",
} as const;

export default function SacrementsCard({ parishioner, refetch }: Props) {
  const [sacraments, setSacraments] = useState<IParSacrament[]>(
    parishioner.sacraments || []
  );

  const handleUpdateSacraments = (newSacraments: IParSacrament[]) => {
    setSacraments(newSacraments);
    refetch(); // Call refetch after updating sacraments
  };

  console.log("sacrements ->", sacraments);
  console.info("sac", parishioner.sacraments);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sacraments</CardTitle>
        <UpdateSacramentsModal
          parishionerId={parishioner.id}
          currentSacraments={sacraments}
          onUpdate={handleUpdateSacraments}
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sacrament</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Place</TableHead>
              <TableHead>Minister</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sacraments.length > 0 ? (
              sacraments.map((sacrament, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {
                      CATHOLIC_SACRAMENTS[
                        sacrament.type as keyof typeof CATHOLIC_SACRAMENTS
                      ]
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(sacrament.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{sacrament.place}</TableCell>
                  <TableCell>{sacrament.minister}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-4 text-muted-foreground"
                >
                  No sacraments recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface UpdateSacramentsModalProps {
  parishionerId: number;
  currentSacraments: IParSacrament[];
  onUpdate: (sacraments: IParSacrament[]) => void;
}

function UpdateSacramentsModal({
  parishionerId,
  currentSacraments,
  onUpdate,
}: UpdateSacramentsModalProps) {
  const { data: session } = useSession();
  const [localSacraments, setLocalSacraments] =
    useState<IParSacrament[]>(currentSacraments);
  const [isLoading, setIsLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [currentSacrament, setCurrentSacrament] = useState<IParSacrament>({
    type: "Baptism",
    date: "",
    place: "",
    minister: "",
    parishioner_id: parishionerId,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentSacrament((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSacrament = () => {
    if (editingIndex !== null) {
      // Update existing sacrament
      const updatedSacraments = [...localSacraments];
      updatedSacraments[editingIndex] = currentSacrament;
      setLocalSacraments(updatedSacraments);
      setEditingIndex(null);
    } else {
      // Add new sacrament
      setLocalSacraments([...localSacraments, currentSacrament]);
    }

    // Reset form
    setCurrentSacrament({
      type: "Baptism",
      date: "",
      place: "",
      minister: "",
      parishioner_id: parishionerId,
    });
  };

  const handleEditSacrament = (index: number) => {
    setEditingIndex(index);
    setCurrentSacrament(localSacraments[index]);
  };

  const handleRemoveSacrament = (index: number) => {
    setLocalSacraments(localSacraments.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      setSuccess(undefined);

      const apiUrl = `/api/v1/parishioners/${parishionerId}/sacraments/batch`;
      const accessToken = session?.accessToken;

      // Convert the sacrament types to the API expected values
      const preparedSacraments = localSacraments.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ id, created_at, updated_at, parishioner_id, ...rest }) => ({
          ...rest,
        })
      );

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preparedSacraments),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.detail === "Validation Error" && data.errors) {
          // Format validation errors
          const errorMessage = data.errors
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((err: any) => `${err.msg} at ${err.loc.join(".")}`)
            .join(", ");
          throw new Error(errorMessage);
        } else {
          throw new Error(data.detail || "Failed to save sacraments");
        }
      }

      // API returns all sacraments for the user
      onUpdate(data.data);
      toast.success(data.message);
      setSuccess(
        data.message || "Sacrements added for parishioner successfully"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to save sacraments:", error);
      setError(error.message || "An error occurred while saving sacraments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalSacraments(currentSacraments);
    setCurrentSacrament({
      type: "Baptism",
      date: "",
      place: "",
      minister: "",
      parishioner_id: parishionerId,
    });
    setEditingIndex(null);
    setError(undefined);
    setSuccess(undefined);
  };

  return (
    <BaseModal
      title="Update Sacraments"
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
        <Banner
          className="mb-4"
          variant={"info"}
          title="Notice"
          description={
            "A parishioner can have only one sacrement type. All fields are required"
          }
        />
        <Banner
          className="mb-4"
          variant={"success"}
          title="Success"
          description={success}
        />
        {error && (
          <Banner
            className="mb-4"
            variant="error"
            title="Error Saving Sacraments"
            description={error}
          />
        )}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="sacramentType" className="text-sm font-medium">
                Sacrament Type
              </label>
              <select
                id="sacramentType"
                name="type"
                className="w-full rounded-md border border-input bg-background px-3 py-1 h-8 text-sm"
                value={currentSacrament.type}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                {Object.entries(CATHOLIC_SACRAMENTS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date Received
              </label>
              <Input
                id="date"
                type="date"
                name="date"
                value={currentSacrament.date}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="place" className="text-sm font-medium">
                Place
              </label>
              <Input
                id="place"
                placeholder="Church/Institution Name"
                name="place"
                value={currentSacrament.place}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="minister" className="text-sm font-medium">
                Minister
              </label>
              <Input
                id="minister"
                placeholder="Name of Minister"
                name="minister"
                value={currentSacrament.minister}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleAddSacrament}
              disabled={
                isLoading ||
                !currentSacrament.date ||
                !currentSacrament.place ||
                !currentSacrament.minister
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingIndex !== null ? "Update" : "Add"} Sacrament
            </Button>
          </div>

          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sacrament</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Place</TableHead>
                  <TableHead>Minister</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localSacraments.length > 0 ? (
                  localSacraments.map((sacrament, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {/* {
                          CATHOLIC_SACRAMENTS[
                            sacrament.type as keyof typeof CATHOLIC_SACRAMENTS
                          ]
                        } */}
                        {sacrament.type}
                      </TableCell>
                      <TableCell>
                        {new Date(sacrament.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{sacrament.place}</TableCell>
                      <TableCell>{sacrament.minister}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size={"icon"}
                            onClick={() => handleEditSacrament(index)}
                            disabled={isLoading}
                          >
                            <FilePenLine className="h-4 w-5 text-green-700" />
                          </Button>
                          <Button
                            variant="ghost"
                            size={"icon"}
                            onClick={() => handleRemoveSacrament(index)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No sacraments recorded yet. Use the form above to add
                      sacraments.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
