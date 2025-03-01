"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { IDetailedParishioner } from "../_components/member-columns";

export default function MemberDetailsView() {
  const params = useParams();
  const parishionerId = params.member as string;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [member, setMember] = useState<IDetailedParishioner | null>(null);

  const { data: session } = useSession();
  const isMobile = useMediaQuery("(min-width: 768px)");

  const fetchParishioner = useCallback(
    async ({ refresh = false } = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/v1/parishioners/${parishionerId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
          mode: "cors",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to fetch parishioner: ${response.statusText}`
          );
        }
        const result = await response.json();
        console.log("Parishioner data:", result.data);

        setMember(result.data);
        if (refresh) toast.success("Data refreshed successfully");
      } catch (err) {
        console.error("Fetch error:", err);
        const error = err as Error;
        const errorMessage = error.message || "Failed to fetch parishioner";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [parishionerId, session?.accessToken]
  );

  // Fetch data when component mounts
  useEffect(() => {
    if (session?.accessToken) {
      fetchParishioner();
    }
  }, [fetchParishioner, session?.accessToken]);

  if (!member) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        {isLoading ? (
          <p className="text-xl text-muted-foreground flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading parishioner data...
          </p>
        ) : error ? (
          <p className="text-xl text-red-500">{error}</p>
        ) : (
          <p className="text-xl text-muted-foreground">Parishioner not found</p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col justify-between gap-2">
        <div className="w-full h-8 flex justify-end items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchParishioner({ refresh: true })}
            className="flex items-center gap-2 h-8 mr-4"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            {isMobile && "Refresh"}
          </Button>
          <AdminActions member={member} />
        </div>

        <div className="overflow-auto h-full w-full space-y-6 pr-2 md:pr-2">
          {/* Header Card */}
          <HeaderCard parishioner={member} />

          {/* Personal information */}
          <PersonalnformationCard
            parishioner={member}
            refetch={() => fetchParishioner({ refresh: true })}
          />

          {/* contact information */}
          <ContactInformationCard
            parishioner={member}
            refetch={() => fetchParishioner({ refresh: true })}
          />

          {/* occupation */}
          <OccupationCard
            parishioner={member}
            refetch={() => fetchParishioner({ refresh: true })}
          />

          {/* family background */}
          <FamilyBackgroundCard
          // parishioner={member}
          // refetch={() => fetchParishioner({ refresh: true })}
          />

          {/* emergency contact card */}
          <EmergencyContactCard
          // contacts={member.emergency_contacts}
          // refetch={() => fetchParishioner({ refresh: true })}
          />

          {/* medical conditio cards */}
          <MedicalConditionsCard
          // conditions={member.medical_conditions}
          // refetch={() => fetchParishioner({ refresh: true })}
          />

          {/* Sacraments Card */}
          <SacrementsCard
          // sacraments={member.sacraments}
          // refetch={() => fetchParishioner({ refresh: true })}
          />

          {/* Societal Memberships Card */}
          <SocietalMembershipsCard
          // member={member}
          // refetch={() => fetchParishioner({ refresh: true })}
          />

          {/* Skills Card */}
          <SkillsCard
          // skills={member.skills}
          // refetch={() => fetchParishioner({ refresh: true })}
          />

          <div className="h-[2vh]" />
        </div>
      </div>
    </>
  );
}
