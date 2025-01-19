"use client";

import { useParams } from "next/navigation";
import React from "react";
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
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function MemberDetailsView() {
  const params = useParams();
  const memberID = params.member as string;

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
    <div className=" h-full flex flex-col justify-between gap-2 ">
      <div className="border w-full h-8 flex justify-end gap-2">
        <Button className="h-8 px-3">
          Actions <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="overflow-auto h-full w-full space-y-6 pr-2 md:pr-4">
        {/* Header Card */}
        <HeaderCard member={member} />

        {/* Personal information */}
        <PersonalnformationCard member={member} />

        <OccupationCard />

        <FamilyBackgroundCard />

        {/* emergency contact card */}
        <EmergencyContactCard />

        {/* medical conditio cards */}
        <MedicalConditionsCard />

        {/* Sacraments Card */}
        <SacrementsCard />

        <SocietalMembershipsCard />

        <SkillsCard />
      </div>
    </div>
  );
}
