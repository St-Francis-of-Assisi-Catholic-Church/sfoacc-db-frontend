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

export default function SacrementsCard() {
  // Sample sacrament data - replace with actual data
  const sacraments = [
    {
      type: "Baptism",
      date: "2000-03-15",
      place: "St. Francis of Assisi Catholic Church",
      minister: "Rev. Fr. James Brown",
    },
    {
      type: "First Holy Communion",
      date: "2008-06-22",
      place: "St. Francis of Assisi Catholic Church",
      minister: "Rev. Fr. Peter Smith",
    },
    {
      type: "Confirmation",
      date: "2010-08-30",
      place: "St. Francis of Assisi Catholic Church",
      minister: "Most Rev. John Doe",
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sacraments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sacrament</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Place</TableHead>
                <TableHead>Minister</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sacraments.map((sacrament, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {sacrament.type}
                  </TableCell>
                  <TableCell>
                    {new Date(sacrament.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{sacrament.place}</TableCell>
                  <TableCell>{sacrament.minister}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
