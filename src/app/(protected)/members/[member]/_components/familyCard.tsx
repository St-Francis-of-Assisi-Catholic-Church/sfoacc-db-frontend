import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BaseModal from "@/components/ui/modal";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Banner from "@/components/ui/banner";
import { useSession } from "next-auth/react";
import { IDetailedParishioner } from "../../_components/member-columns";
import { toast } from "sonner";

interface Props {
  parishioner: IDetailedParishioner;
  refetch: () => void;
}

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
}

interface Child {
  name: string;
}

interface Parent {
  name: string | null;
  status: string | null;
}

interface Spouse {
  name: string | null;
  status: string | null;
  phone: string | null;
}

interface FamilyData {
  spouse: Spouse;
  children: Child[];
  father: Parent;
  mother: Parent;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-muted-foreground block">
      {label}
    </label>
    <span className="block">{value || "-"}</span>
  </div>
);

export default function FamilyBackgroundCard({ parishioner, refetch }: Props) {
  const [familyData, setFamilyData] = useState<FamilyData>({
    spouse: {
      name: null,
      status: null,
      phone: null,
    },
    children: [],
    father: {
      name: null,
      status: null,
    },
    mother: {
      name: null,
      status: null,
    },
  });

  // Initialize data when parishioner is available
  useEffect(() => {
    if (parishioner && parishioner.family_info) {
      setFamilyData({
        spouse: {
          name: parishioner.family_info.spouse_name || null,
          status: parishioner.family_info.spouse_status || null,
          phone: parishioner.family_info.spouse_phone || null,
        },
        children: parishioner.family_info.children || [],
        father: {
          name: parishioner.family_info.father_name || null,
          status: parishioner.family_info.father_status || null,
        },
        mother: {
          name: parishioner.family_info.mother_name || null,
          status: parishioner.family_info.mother_status || null,
        },
      });
    }
  }, [parishioner]);

  const handleUpdateFamily = (newData: FamilyData) => {
    setFamilyData(newData);
  };

  if (!parishioner) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Family Background</CardTitle>
        <UpdateFamilyModal
          currentFamily={familyData}
          onUpdate={handleUpdateFamily}
          parishionerId={parishioner.id}
          refetch={refetch}
        />
      </CardHeader>
      <CardContent>
        {/* Spouse Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Spouse Information</h3>
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <InfoItem label="Spouse Name" value={familyData.spouse.name} />
            <InfoItem label="Status" value={familyData.spouse.status} />
            <InfoItem label="Contact" value={familyData.spouse.phone} />
          </div>
        </div>

        {/* Children Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Children</h3>
          {familyData.children && familyData.children.length > 0 ? (
            <div className="space-y-4">
              {familyData.children.map((child, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label={`Child ${index + 1}`} value={child.name} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">No children listed</span>
          )}
        </div>

        {/* Parents Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold mb-4">Parents Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Father's Information */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Father&apos;s Information</h4>
              <InfoItem label="Name" value={familyData.father.name} />
              <InfoItem label="Status" value={familyData.father.status} />
            </div>

            {/* Mother's Information */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Mother&apos;s Information</h4>
              <InfoItem label="Name" value={familyData.mother.name} />
              <InfoItem label="Status" value={familyData.mother.status} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface UpdateFamilyModalProps {
  currentFamily: FamilyData;
  onUpdate: (family: FamilyData) => void;
  parishionerId: number;
  refetch: () => void;
}

function UpdateFamilyModal({
  currentFamily,
  onUpdate,
  parishionerId,
  refetch,
}: UpdateFamilyModalProps) {
  const { data: session } = useSession();
  const [localFamily, setLocalFamily] = useState<FamilyData>(currentFamily);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  // Update localFamily when currentFamily changes
  useEffect(() => {
    setLocalFamily(currentFamily);
  }, [currentFamily]);

  const handleSpouseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalFamily((prev) => ({
      ...prev,
      spouse: {
        ...prev.spouse,
        [name]: value || null,
      },
    }));
  };

  const handleParentChange = (
    parent: "father" | "mother",
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalFamily((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value || null,
      },
    }));
  };

  const handleChildChange = (index: number, value: string) => {
    const updatedChildren = [...localFamily.children];
    updatedChildren[index] = { name: value };
    setLocalFamily((prev) => ({
      ...prev,
      children: updatedChildren,
    }));
  };

  const addChild = () => {
    setLocalFamily((prev) => ({
      ...prev,
      children: [...prev.children, { name: "" }],
    }));
  };

  const removeChild = (index: number) => {
    setLocalFamily((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      setSuccess(undefined);

      const accessToken = session?.accessToken;

      if (!accessToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `/api/v1/parishioners/${parishionerId}/family-info/batch`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(localFamily),
        }
      );

      if (!response.ok) {
        const info = await response.json();
        if (info.detail) {
          throw new Error(info.detail);
        } else throw new Error("Failed to update family info");
      }

      onUpdate(localFamily);
      setSuccess("Family information updated successfully");
      toast.success("Family information updated successfully");

      // Call refetch to update the parent component with the latest data
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to save family information:", error);
      setError(error.message || "Failed to update family information");
      toast.error(error.message || "Failed to update family information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalFamily(currentFamily);
    setError(undefined);
    setSuccess(undefined);
  };

  return (
    <BaseModal
      title="Update Family Information"
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
      <div className="px-6 py-4 space-y-6 overflow-auto max-h-[70vh]">
        {success && (
          <Banner
            variant="success"
            className="mb-4"
            title="Success"
            description={success}
          />
        )}
        {error && (
          <Banner
            variant="error"
            className="mb-4"
            title="Error"
            description={error}
          />
        )}
        {/* Spouse Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Spouse Information</h3>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                name="name"
                value={localFamily.spouse.name || ""}
                onChange={handleSpouseChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                value={localFamily.spouse.status || ""}
                onChange={handleSpouseChange}
                disabled={isLoading}
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">Select status</option>
                <option value="alive">Alive</option>
                <option value="deceased">Deceased</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                name="phone"
                value={localFamily.spouse.phone || ""}
                onChange={handleSpouseChange}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Children Information */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Children</h3>
            <Button
              onClick={addChild}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Button>
          </div>
          <div className="space-y-4">
            {localFamily.children.map((child, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <label className="text-sm font-medium">
                    Child {index + 1}
                  </label>
                  <Input
                    value={child.name}
                    onChange={(e) => handleChildChange(index, e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeChild(index)}
                  disabled={isLoading}
                  className="mt-6"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Parents Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Parents Information</h3>
          <div className="grid gap-6">
            {/* Father */}
            <div className="space-y-4">
              <h4 className="font-medium">Father&apos;s Information</h4>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    name="name"
                    value={localFamily.father.name || ""}
                    onChange={(e) => handleParentChange("father", e)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={localFamily.father.status || ""}
                    onChange={(e) => handleParentChange("father", e)}
                    disabled={isLoading}
                    className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="">Select status</option>
                    <option value="alive">Alive</option>
                    <option value="deceased">Deceased</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mother */}
            <div className="space-y-4">
              <h4 className="font-medium">Mother&apos;s Information</h4>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    name="name"
                    value={localFamily.mother.name || ""}
                    onChange={(e) => handleParentChange("mother", e)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={localFamily.mother.status || ""}
                    onChange={(e) => handleParentChange("mother", e)}
                    disabled={isLoading}
                    className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="">Select status</option>
                    <option value="alive">Alive</option>
                    <option value="deceased">Deceased</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
