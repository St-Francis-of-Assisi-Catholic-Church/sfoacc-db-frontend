import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IDetailedParishioner } from "../../_components/member-columns";

type Props = {
  parishioner: IDetailedParishioner;
};

export default function HeaderCard({ parishioner }: Props) {
  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
          {/* Left section with avatar and name */}
          <div className="flex flex-row gap-3 w-full sm:w-auto items-center">
            <Avatar className="h-[5rem] w-[5rem] sm:h-20 sm:w-20 md:h-24 md:w-24 flex-shrink-0 ">
              <AvatarImage
                src={parishioner.first_name}
                alt={parishioner.first_name}
              />
              <AvatarFallback className="font-semiBold text-2xl sm:text-3xl tracking-wide">
                {parishioner.first_name[0]}
                {parishioner.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 min-w-0 ">
              <CardTitle className="text-lg sm:text-lg md:text-2xl truncate">
                {parishioner.first_name} {parishioner.other_names}{" "}
                {parishioner.maiden_name} {parishioner.last_name}
              </CardTitle>
              <div className="space-y-0">
                <table className="w-full table-fixed">
                  <tbody>
                    {/* systemID */}
                    <tr>
                      <td className="text-xs md:text-sm text-muted-foreground  w-2/5 md:w-[12%] whitespace-nowrap pr-1 ">
                        systemID:
                      </td>
                      <td className="text-xs sm:text-sm font-semibold pl-1 truncate ">
                        {parishioner.id}
                      </td>
                    </tr>
                    {/* oldchurchID */}
                    <tr>
                      <td className="text-xs md:text-sm text-muted-foreground w-[12%] whitespace-nowrap pr-1">
                        old churchID:
                      </td>
                      <td className="text-xs sm:text-sm font-semibold pl-1 truncate">
                        {parishioner.old_church_id}
                      </td>
                    </tr>
                    {/* new churchID */}
                    <tr>
                      <td className="text-xs md:text-sm text-muted-foreground w-[12%] whitespace-nowrap pr-1">
                        new churchID:
                      </td>
                      <td className="text-xs sm:text-sm font-semibold pl-1 truncate">
                        {parishioner.new_church_id}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right section with status information */}
          <div className="mt-3 sm:mt-0 w-full sm:w-auto sm:ml-auto">
            <table className="w-full sm:w-auto ">
              <tbody>
                <tr>
                  <td className="text-xs md:text-sm text-muted-foreground whitespace-nowrap pr-1">
                    Verification Status:
                  </td>
                  <td className="text-xs sm:text-sm font-semibold pl-1">
                    {parishioner.verification_status}
                  </td>
                </tr>
                <tr>
                  <td className="text-xs md:text-sm text-muted-foreground whitespace-nowrap pr-1">
                    Membership Status:
                  </td>
                  <td className="text-xs sm:text-sm font-semibold pl-1">
                    {parishioner.membership_status}
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
