import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BaseModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CATHOLIC_SACRAMENTS = {
  Baptism: "Baptism",
  "First Communion": "First Holy Communion",
  Confirmation: "Confirmation",
  Penance: "Penance (Confession)",
  Anointing: "Anointing of the Sick",
  "Holy Orders": "Holy Orders",
  Matrimony: "Holy Matrimony",
} as const;

type CatholicSacrament = keyof typeof CATHOLIC_SACRAMENTS;

interface Sacrament {
  type: CatholicSacrament;
  date: string;
  place: string;
  minister: string;
}

export default function SacrementsCard() {
  const [sacraments, setSacraments] = useState<Sacrament[]>([
    {
      type: "Baptism",
      date: "2000-03-15",
      place: "St. Francis of Assisi Catholic Church",
      minister: "Rev. Fr. James Brown",
    },
    {
      type: "First Communion",
      date: "2008-06-22",
      place: "St. Francis of Assisi Catholic Church",
      minister: "Rev. Fr. Peter Smith",
    },
    {
      type: "Confirmation",
      date: "2010-08-30",
      place: "St. Francis of Assisi Catholic Church",
      minister: "Most Rev. John Doe",
    },
  ]);

  const handleUpdateSacraments = (newSacraments: Sacrament[]) => {
    setSacraments(newSacraments);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sacraments</CardTitle>
        <UpdateSacramentsModal
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
            {sacraments.map((sacrament, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {CATHOLIC_SACRAMENTS[sacrament.type]}
                </TableCell>
                <TableCell>
                  {new Date(sacrament.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{sacrament.place}</TableCell>
                <TableCell>{sacrament.minister}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface UpdateSacramentsModalProps {
  currentSacraments: Sacrament[];
  onUpdate: (sacraments: Sacrament[]) => void;
}

function UpdateSacramentsModal({
  currentSacraments,
  onUpdate,
}: UpdateSacramentsModalProps) {
  const [localSacraments, setLocalSacraments] =
    useState<Sacrament[]>(currentSacraments);
  const [isLoading, setIsLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentSacrament, setCurrentSacrament] = useState<Sacrament>({
    type: "Baptism",
    date: "",
    place: "",
    minister: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentSacrament((prev) => ({
      ...prev,
      [name]: value as unknown,
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
      // TODO: Add API call here
      // const response = await fetch('/api/member/sacraments', {
      //   method: 'PUT',
      //   body: JSON.stringify({ sacraments: localSacraments })
      // });

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onUpdate(localSacraments);
    } catch (error) {
      console.error("Failed to save sacraments:", error);
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
    });
    setEditingIndex(null);
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
                {localSacraments.map((sacrament, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {CATHOLIC_SACRAMENTS[sacrament.type]}
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
                          size="sm"
                          onClick={() => handleEditSacrament(index)}
                          disabled={isLoading}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSacrament(index)}
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

            {localSacraments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No sacraments recorded yet. Use the form above to add
                sacraments.
              </p>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
