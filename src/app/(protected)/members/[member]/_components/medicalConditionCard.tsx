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

export default function MedicalConditionsCard() {
  // Sample medical conditions data - replace with actual data
  const medicalConditions = [
    {
      condition: "Type 2 Diabetes",
      notes: "",
    },
    {
      condition: "Hypertension",
      notes: "Regular blood pressure monitoring required",
    },
    {
      condition: "Asthma",
      notes: "Exercise-induced, carries inhaler when needed",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Condition</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicalConditions.length > 0 ? (
              medicalConditions.map((condition, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {condition.condition}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {condition.notes}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No medical conditions reported
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
