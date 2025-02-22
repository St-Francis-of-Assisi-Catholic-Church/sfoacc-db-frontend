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
      <CardHeader className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
          {/* Left section with avatar and name */}
          <div className="flex flex-row gap-3 w-full sm:w-auto">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 flex-shrink-0">
              <AvatarImage src={member.pictureURL} alt={member.firstName} />
              <AvatarFallback>
                {member.firstName[0]}
                {member.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 min-w-0">
              <CardTitle className="text-base sm:text-lg md:text-2xl truncate">
                {member.firstName} {member.otherNames} {member.lastName}
              </CardTitle>
              <div className="space-y-0">
                <table className="w-full table-fixed">
                  <tbody>
                    {/* systemID */}
                    <tr>
                      <td className="text-xs md:text-sm text-muted-foreground w-2/5 whitespace-nowrap pr-1">
                        systemID:
                      </td>
                      <td className="text-xs sm:text-sm font-semibold pl-1 truncate">
                        {member.systemID}
                      </td>
                    </tr>
                    {/* oldchurchID */}
                    <tr>
                      <td className="text-xs md:text-sm text-muted-foreground w-2/5 whitespace-nowrap pr-1">
                        old churchID:
                      </td>
                      <td className="text-xs sm:text-sm font-semibold pl-1 truncate">
                        {member.oldChurchID}
                      </td>
                    </tr>
                    {/* new churchID */}
                    <tr>
                      <td className="text-xs md:text-sm text-muted-foreground w-2/5 whitespace-nowrap pr-1">
                        new churchID:
                      </td>
                      <td className="text-xs sm:text-sm font-semibold pl-1 truncate">
                        {member.newChurchID}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right section with status information */}
          <div className="mt-3 sm:mt-0 w-full sm:w-auto sm:ml-auto">
            <table className="w-full sm:w-auto">
              <tbody>
                <tr>
                  <td className="text-xs md:text-sm text-muted-foreground whitespace-nowrap pr-1">
                    Verification Status:
                  </td>
                  <td className="text-xs sm:text-sm font-semibold pl-1">
                    pending verification
                  </td>
                </tr>
                <tr>
                  <td className="text-xs md:text-sm text-muted-foreground whitespace-nowrap pr-1">
                    Membership Status:
                  </td>
                  <td className="text-xs sm:text-sm font-semibold pl-1">
                    active
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
