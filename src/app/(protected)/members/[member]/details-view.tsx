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
    <div className="w-full space-y-6  pr-2 md:pr-4">
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
  );
}
