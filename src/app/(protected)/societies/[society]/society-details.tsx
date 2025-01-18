"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import societiesData from "../_components/societies.json";
import { ISociety } from "../_components/society-table";
import { SocietyLeadershipCard } from "./society-leadership-card";
import SocietyMeetingScheduleCard from "./society-meeting-schedule-card";

export default function SocietyDetails() {
  const params = useParams();
  const slug = params.society as string;

  // Extract the ID from the slug (format: "id-name-of-society")
  const id = parseInt(slug.split("-")[0]);

  const society = societiesData.societies.find((s) => s.id === id) as ISociety;

  if (!society) {
    return (
      <div className="">
        <div className="text-center py-8">Society not found.</div>
      </div>
    );
  }

  return (
    <div className="pt-0 space-y-6">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className=" text-2xl md:text-3xl font-bold">
            {society.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">About</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {society.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Created:</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {formatDate(society.created_at)}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Last Updated:</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {formatDate(society.updated_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SocietyMeetingScheduleCard society={society} />

        <SocietyLeadershipCard />
      </div>
    </div>
  );
}
