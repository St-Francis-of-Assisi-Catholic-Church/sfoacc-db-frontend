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

interface EmergencyContact {
  name: string;
  relationship: string;
  primaryPhone: string;
  alternativePhone: string;
}

export default function EmergencyContactCard() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      name: "Jane Doe",
      relationship: "Spouse",
      primaryPhone: "+233 24 765 4321",
      alternativePhone: "+233 24 765 4322",
    },
    {
      name: "Robert Smith",
      relationship: "Brother",
      primaryPhone: "+233 24 555 8888",
      alternativePhone: "+233 24 555 8889",
    },
  ]);

  const handleUpdateContacts = (newContacts: EmergencyContact[]) => {
    setContacts(newContacts);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Emergency Contacts</CardTitle>
        <UpdateContactsModal
          currentContacts={contacts}
          onUpdate={handleUpdateContacts}
        />
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[150px]">Relationship</TableHead>
                <TableHead className="w-[180px]">Primary Contact</TableHead>
                <TableHead className="w-[180px]">Alternative Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell>{contact.relationship}</TableCell>
                    <TableCell>{contact.primaryPhone}</TableCell>
                    <TableCell>{contact.alternativePhone}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No emergency contacts recorded
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

interface UpdateContactsModalProps {
  currentContacts: EmergencyContact[];
  onUpdate: (contacts: EmergencyContact[]) => void;
}

function UpdateContactsModal({
  currentContacts,
  onUpdate,
}: UpdateContactsModalProps) {
  const [localContacts, setLocalContacts] =
    useState<EmergencyContact[]>(currentContacts);
  const [isLoading, setIsLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentContact, setCurrentContact] = useState<EmergencyContact>({
    name: "",
    relationship: "",
    primaryPhone: "",
    alternativePhone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddContact = () => {
    if (editingIndex !== null) {
      // Update existing contact
      const updatedContacts = [...localContacts];
      updatedContacts[editingIndex] = currentContact;
      setLocalContacts(updatedContacts);
      setEditingIndex(null);
    } else {
      // Add new contact
      setLocalContacts([...localContacts, currentContact]);
    }

    // Reset form
    setCurrentContact({
      name: "",
      relationship: "",
      primaryPhone: "",
      alternativePhone: "",
    });
  };

  const handleEditContact = (index: number) => {
    setEditingIndex(index);
    setCurrentContact(localContacts[index]);
  };

  const handleRemoveContact = (index: number) => {
    setLocalContacts(localContacts.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // TODO: Add API call here
      // const response = await fetch('/api/member/emergency-contacts', {
      //   method: 'PUT',
      //   body: JSON.stringify({ contacts: localContacts })
      // });

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onUpdate(localContacts);
    } catch (error) {
      console.error("Failed to save emergency contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalContacts(currentContacts);
    setCurrentContact({
      name: "",
      relationship: "",
      primaryPhone: "",
      alternativePhone: "",
    });
    setEditingIndex(null);
  };

  return (
    <BaseModal
      title="Update Emergency Contacts"
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
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                placeholder="Contact name"
                name="name"
                value={currentContact.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="relationship" className="text-sm font-medium">
                Relationship
              </label>
              <Input
                id="relationship"
                placeholder="Relationship to contact"
                name="relationship"
                value={currentContact.relationship}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="primaryPhone" className="text-sm font-medium">
                Primary Phone
              </label>
              <Input
                id="primaryPhone"
                placeholder="Primary phone number"
                name="primaryPhone"
                value={currentContact.primaryPhone}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="alternativePhone" className="text-sm font-medium">
                Alternative Phone
              </label>
              <Input
                id="alternativePhone"
                placeholder="Alternative phone number"
                name="alternativePhone"
                value={currentContact.alternativePhone}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleAddContact}
              disabled={
                isLoading ||
                !currentContact.name ||
                !currentContact.relationship ||
                !currentContact.primaryPhone
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingIndex !== null ? "Update" : "Add"} Contact
            </Button>
          </div>

          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Primary Phone</TableHead>
                  <TableHead>Alternative Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localContacts.map((contact, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell>{contact.relationship}</TableCell>
                    <TableCell>{contact.primaryPhone}</TableCell>
                    <TableCell>{contact.alternativePhone}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditContact(index)}
                          disabled={isLoading}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveContact(index)}
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

            {localContacts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No emergency contacts recorded yet. Use the form above to add
                contacts.
              </p>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
