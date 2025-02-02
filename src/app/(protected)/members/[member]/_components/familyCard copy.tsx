import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-muted-foreground block">
      {label}
    </label>
    <span className="block">{value}</span>
  </div>
);

export default function FamilyBackgroundCard() {
  // Sample family data - replace with actual data
  const familyData = {
    spouse: {
      name: "Mary Addo",
      status: "Alive",
      phone: "+233 24 555 7890",
    },
    children: [
      {
        name: "John Addo Jr.",
      },
      {
        name: "Sarah Addo",
      },
      {
        name: "Michael Addo",
      },
    ],
    father: {
      name: "Peter Addo",
      status: "Deceased",
    },
    mother: {
      name: "Grace Addo",
      status: "Alive",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Family Background</CardTitle>
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
