import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import React from "react";
import { ISociety } from "../_components/society-table";

type Props = {
  society: ISociety;
};

export default function SocietyMeetingScheduleCard({ society }: Props) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Meeting Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-12 px-4 py-2"></th>
                <th className="px-4 py-2 text-left font-medium">Details</th>
                <th className="px-4 py-2 text-left font-medium">Information</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </td>
                <td className="px-4 py-2 font-medium">Day</td>
                <td className="px-4 py-2">{society.meetingSchedule}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </td>
                <td className="px-4 py-2 font-medium">Time</td>
                <td className="px-4 py-2">{society.meetingTime}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </td>
                <td className="px-4 py-2 font-medium">Venue</td>
                <td className="px-4 py-2">{society.meetingVenue}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
