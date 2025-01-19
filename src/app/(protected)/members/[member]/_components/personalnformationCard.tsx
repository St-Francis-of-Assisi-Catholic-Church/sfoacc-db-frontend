import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IMember } from "../../_components/member-columns";
import { Pencil } from "lucide-react";
// import { toast } from "sonner";

type Props = {
  member: IMember;
  refetch: () => void;
};

export default function PersonalInformationCard({ member, refetch }: Props) {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editedMember, setEditedMember] = useState(member);
  const [isLoading, setIsLoading] = useState(false);

  const updateMember = async (data: Partial<IMember>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/members/${member.systemID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update member");
      }

      refetch();
      setIsEditingPersonal(false);
      setIsEditingContact(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const personalInfoData = {
      firstName: editedMember.firstName,
      lastName: editedMember.lastName,
      otherNames: editedMember.otherNames,
      maidenName: editedMember.maidenName,
      gender: editedMember.gender,
      dateOfBirth: editedMember.dateOfBirth,
      placeOfBirth: editedMember.placeOfBirth,
      hometown: editedMember.hometown,
      region: editedMember.region,
      country: editedMember.country,
      maritalStatus: editedMember.maritalStatus,
    };
    await updateMember(personalInfoData);
  };

  const handleContactInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const contactInfoData = {
      mobileNumber: editedMember.mobileNumber,
      whatsAppNumber: editedMember.whatsAppNumber,
      emaillAddress: editedMember.emaillAddress,
    };
    await updateMember(contactInfoData);
  };

  const handleInputChange = (field: keyof IMember, value: string) => {
    setEditedMember((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      {/* Personal Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Information</CardTitle>
          <Dialog open={isEditingPersonal} onOpenChange={setIsEditingPersonal}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Personal Information</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input
                        value={editedMember.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Other Names</label>
                      <Input
                        value={editedMember.otherNames}
                        onChange={(e) =>
                          handleInputChange("otherNames", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input
                        value={editedMember.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Maiden Name</label>
                      <Input
                        value={editedMember.maidenName}
                        onChange={(e) =>
                          handleInputChange("maidenName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Gender</label>
                      <Select
                        value={editedMember.gender}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Marital Status
                      </label>
                      <Select
                        value={editedMember.maritalStatus}
                        onValueChange={(value) =>
                          handleInputChange("maritalStatus", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Date of Birth
                      </label>
                      <Input
                        type="date"
                        value={editedMember.dateOfBirth?.split("T")[0]}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Place of Birth
                      </label>
                      <Input
                        value={editedMember.placeOfBirth}
                        onChange={(e) =>
                          handleInputChange("placeOfBirth", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Hometown</label>
                      <Input
                        value={editedMember.hometown}
                        onChange={(e) =>
                          handleInputChange("hometown", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Region</label>
                      <Input
                        value={editedMember.region}
                        onChange={(e) =>
                          handleInputChange("region", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country</label>
                      <Input
                        value={editedMember.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditingPersonal(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p>
                  {member.firstName} {member.otherNames} {member.lastName}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Maiden Name
                </label>
                <p>{member.maidenName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Gender
                </label>
                <p>{member.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </label>
                <p>{new Date(member.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Place of Birth
                </label>
                <p>{member.placeOfBirth}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Hometown
                </label>
                <p>{member.hometown}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Region
                </label>
                <p>{member.region}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Country
                </label>
                <p>{member.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Marital Status
                </label>
                <p>{member.maritalStatus}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact Information</CardTitle>
          <Dialog open={isEditingContact} onOpenChange={setIsEditingContact}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Contact Information</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleContactInfoSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mobile Number</label>
                    <Input
                      value={editedMember.mobileNumber}
                      onChange={(e) =>
                        handleInputChange("mobileNumber", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      WhatsApp Number
                    </label>
                    <Input
                      value={editedMember.whatsAppNumber}
                      onChange={(e) =>
                        handleInputChange("whatsAppNumber", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      value={editedMember.emaillAddress}
                      onChange={(e) =>
                        handleInputChange("emaillAddress", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditingContact(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Mobile Number
            </label>
            <p>{member.mobileNumber}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              WhatsApp Number
            </label>
            <p>{member.whatsAppNumber}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email Address
            </label>
            <p>{member.emaillAddress}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
