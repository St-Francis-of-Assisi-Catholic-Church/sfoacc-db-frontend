import DaybornsBarChart from "@/components/charts/dayBornsChart";
import SacramentsPieChart from "@/components/charts/sacramentsPieChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function SacramentsStats() {
  return (
    <>
      <div className="grid xl:grid-cols-2  grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sacrements</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <SacramentsPieChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Day Borns</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <DaybornsBarChart />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
