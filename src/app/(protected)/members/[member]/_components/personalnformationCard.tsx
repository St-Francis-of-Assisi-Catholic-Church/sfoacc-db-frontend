import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IMember } from "../../_components/member-columns";

type Props = {
  member: IMember;
};

export default function PersonalnformationCard({ member }: Props) {
  return (
    <>
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
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
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
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
