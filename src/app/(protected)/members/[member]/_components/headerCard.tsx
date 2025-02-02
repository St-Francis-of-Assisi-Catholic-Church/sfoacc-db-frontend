import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IMember } from "../../_components/member-columns";

type Props = {
  member: IMember;
};

export default function HeaderCard({ member }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-row gap-4">
          <Avatar className="h-20 w-20  md:h-24 md:w-24">
            <AvatarImage src={member.pictureURL} alt={member.firstName} />
            <AvatarFallback>
              {member.firstName[0]}
              {member.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 ">
            <CardTitle className="text-lg md:text-2xl">
              {member.firstName} {member.otherNames} {member.lastName}
            </CardTitle>
            <div className="space-y-0">
              <table className=" ">
                {/* systemID */}
                <tr>
                  <td className="text-xs md:text-sm text-muted-foreground w-2/5  whitespace-nowrap">
                    systemID:
                  </td>
                  <td className="text-sm font-semibold pl-1">
                    {member.systemID}
                  </td>
                </tr>
                {/* oldchurchID */}
                <tr>
                  <td className="text-xs md:text-sm text-muted-foreground w-2/5 whitespace-nowrap">
                    old churchID:
                  </td>
                  <td className="text-sm font-semibold pl-1">
                    {member.oldChurchID}
                  </td>
                </tr>
                {/* new churchID */}
                <tr>
                  <td className="text-xs md:text-sm text-muted-foreground w-2/5 whitespace-nowrap">
                    new churchID:
                  </td>
                  <td className="text-sm font-semibold pl-1">
                    {member.newChurchID}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <table className=" ">
          <tr>
            <td className="text-xs md:text-sm text-muted-foreground w-2/5  whitespace-nowrap">
              Verification Status:
            </td>
            <td className="text-sm font-semibold pl-1 ">
              pending verification
            </td>
          </tr>
          <tr>
            <td className="text-xs md:text-sm text-muted-foreground w-2/5 whitespace-nowrap">
              Membership Status:
            </td>
            <td className="text-sm font-semibold pl-1">active</td>
          </tr>
        </table>
      </CardHeader>
    </Card>
  );
}
