import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BaseModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useSession } from "next-auth/react";
import Banner from "@/components/ui/banner";

interface Props {
  parishioner: IDetailedParishioner;
  refetch: () => void;
}

export interface IEmergencyContact {
  id?: number;
  name: string;
  relationship: string;
  primary_phone: string;
  alternative_phone?: string | null;
  parishioner_id?: number;
  created_at?: string;
  updated_at?: string;
}

export default function EmergencyContactCard({ parishioner, refetch }: Props) {
  const [contacts, setContacts] = useState<IEmergencyContact[]>(
    parishioner.emergency_contacts || []
  );

  useEffect(() => {
    setContacts(parishioner.emergency_contacts || []);
  }, [parishioner]);

  const handleUpdateContacts = (newContacts: IEmergencyContact[]) => {
    setContacts(newContacts);
    refetch(); // Call refetch to update the parent component with new data
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Emergency Contacts</CardTitle>
        <UpdateContactsModal
          currentContacts={contacts}
          onUpdate={handleUpdateContacts}
          parishionerId={parishioner.id}
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
                    <TableCell>{contact.primary_phone}</TableCell>
                    <TableCell>{contact.alternative_phone}</TableCell>
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
  currentContacts: IEmergencyContact[];
  onUpdate: (contacts: IEmergencyContact[]) => void;
  parishionerId: number;
}

function UpdateContactsModal({
  currentContacts,
  onUpdate,
  parishionerId,
}: UpdateContactsModalProps) {
  const { data: session } = useSession();
  const [localContacts, setLocalContacts] =
    useState<IEmergencyContact[]>(currentContacts);
  const [isLoading, setIsLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentContact, setCurrentContact] = useState<IEmergencyContact>({
    name: "",
    relationship: "",
    primary_phone: "",
    alternative_phone: "",
  });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setLocalContacts(currentContacts);
  }, [currentContacts]);

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
      primary_phone: "",
      alternative_phone: "",
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
      setSuccessMsg(null);
      const accessToken = session?.accessToken;

      // Format contacts for API
      const contactsForApi = localContacts.map((contact) => ({
        name: contact.name,
        relationship: contact.relationship,
        primary_phone: contact.primary_phone,
        alternative_phone: contact.alternative_phone || "",
      }));

      // Call the API to update emergency contacts
      const response = await fetch(
        `/api/v1/parishioners/${parishionerId}/emergency-contacts/batch`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactsForApi),
        }
      );

      if (!response.ok) {
        const info = await response.json();
        if (info.detail) {
          throw new Error(info.detail);
        } else throw new Error("Failed to update emergency contacts");
      }

      const result = await response.json();
      setSuccessMsg(result.message);
      onUpdate(result.data); // Update with the response from the server
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Failed to save emergency contacts:", error);
      setError(
        error.message ||
          "An error occured while trying to save emergency contacts"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalContacts(currentContacts);
    setCurrentContact({
      name: "",
      relationship: "",
      primary_phone: "",
      alternative_phone: "",
    });
    setEditingIndex(null);
    setSuccessMsg(null);
  };

  return (
    <BaseModal
      title="Update Emergency Contacts"
      buttonComponent={
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4 text-green-600" />
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
            variant={"info"}
            className="mb-4"
            title="Quick Notice"
            description={"You can add only a max of 3 emergency contacts"}
          />
          <Banner
            variant={"success"}
            className="mb-4"
            title={"Success"}
            description={successMsg || undefined}
          />
          <Banner
            variant={"error"}
            className="mb-4"
            title="Error"
            description={error}
          />
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
              <label htmlFor="primary_phone" className="text-sm font-medium">
                Primary Phone
              </label>
              <Input
                id="primary_phone"
                placeholder="Primary phone number"
                name="primary_phone"
                value={currentContact.primary_phone}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="alternative_phone"
                className="text-sm font-medium"
              >
                Alternative Phone
              </label>
              <Input
                id="alternative_phone"
                placeholder="Alternative phone number"
                name="alternative_phone"
                value={currentContact.alternative_phone || ""}
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
                !currentContact.primary_phone
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
                    <TableCell>{contact.primary_phone}</TableCell>
                    <TableCell>{contact.alternative_phone}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size={"icon"}
                          onClick={() => handleEditContact(index)}
                          disabled={isLoading}
                        >
                          <FilePenLine className="h-4 w-5 text-green-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size={"icon"}
                          onClick={() => handleRemoveContact(index)}
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
