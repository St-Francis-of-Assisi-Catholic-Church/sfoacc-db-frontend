import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OccupationCard() {
  // Sample occupation data - replace with actual data
  const occupation = {
    role: "Teacher",
    employer: "West Africa Civil Society Institute WACSI",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupation</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Occupation</TableHead>
              <TableHead>Employer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{occupation.role}</TableCell>
              <TableCell>{occupation.employer}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
