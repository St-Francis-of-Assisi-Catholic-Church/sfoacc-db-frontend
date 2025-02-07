"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import membersData from "../_components/members.json";
import { IMember } from "../_components/member-columns";
import SacrementsCard from "./_components/sacrementsCard";
import PersonalnformationCard from "./_components/personalnformationCard";
import HeaderCard from "./_components/headerCard";
import EmergencyContactCard from "./_components/emergencyContactCard";
import MedicalConditionsCard from "./_components/medicalConditionCard";
import FamilyBackgroundCard from "./_components/familyCard";
import OccupationCard from "./_components/ocuupationCard";
import SocietalMembershipsCard from "./_components/societalMembershipCard";
import { SkillsCard } from "./_components/skillsCard";

import ContactInformationCard from "./_components/contactInformationCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RefreshCw } from "lucide-react";
import AdminActions from "./_components/adminActionss";

export default function MemberDetailsView() {
  const params = useParams();
  const memberID = params.member as string;
  const [isLoading] = useState(false);

  const isMobile = useMediaQuery("(min-width: 768px)");

  const member = membersData.members.find(
    (m) => m.systemID === parseInt(memberID)
  ) as IMember;

  if (!member) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-xl text-muted-foreground">Member not found</p>
      </div>
    );
  }

  return (
    <>
      <div className=" h-full flex flex-col justify-between gap-2 ">
        <div className=" w-full h-8 flex justify-end items-center ">
          <Button
            variant="outline"
            size="sm"
            // onClick={refreshData}
            className="flex items-center gap-2 h-8 mr-4"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            {isMobile && "Refresh"}
          </Button>
          <AdminActions member={member} />
        </div>

        <div className="overflow-auto h-full w-full space-y-6 pr-2 md:pr-0">
          {/* Header Card */}
          <HeaderCard member={member} />

          {/* Personal information */}
          <PersonalnformationCard member={member} refetch={() => {}} />

          {/* contact information */}
          <ContactInformationCard member={member} refetch={() => {}} />

          {/* occupation */}
          <OccupationCard />

          {/* family background */}
          <FamilyBackgroundCard />

          {/* emergency contact card */}
          <EmergencyContactCard />

          {/* medical conditio cards */}
          <MedicalConditionsCard />

          {/* Sacraments Card */}
          <SacrementsCard />

          <SocietalMembershipsCard />

          <SkillsCard />

          <div className="h-[2vh" />
        </div>
      </div>
    </>
  );
}
