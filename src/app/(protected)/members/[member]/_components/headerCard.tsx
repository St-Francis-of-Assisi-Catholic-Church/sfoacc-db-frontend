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
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20  md:h-24 md:w-24">
          <AvatarImage src={member.pictureURL} alt={member.firstName} />
          <AvatarFallback>
            {member.firstName[0]}
            {member.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-lg md:text-2xl">
            {member.firstName} {member.otherNames} {member.lastName}
          </CardTitle>
          <div className="space-y-0">
            <p className="text-xs md:text-sm text-muted-foreground">
              old churchID:{" "}
              <span className="font-semibold text-sm">
                {member.oldChurchID}
              </span>
            </p>

            <p className="text-xs md:text-sm text-muted-foreground">
              new churchID:{" "}
              <span className="font-semibold text-sm">
                {member.newChurchID}
              </span>
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
