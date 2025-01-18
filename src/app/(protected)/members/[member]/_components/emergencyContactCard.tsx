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

export default function EmergencyContactCard() {
  // Sample emergency contact data - replace with actual data
  const emergencyContacts = [
    {
      name: "Jane Doe",
      relationship: "Spouse",
      primaryPhone: "+233 24 765 4321",
      alternativePhone: "+233 24 765 4322",
    },
    {
      name: "Robert Smith",
      relationship: "Brother",
      primaryPhone: "+233 24 555 8888",
      alternativePhone: "+233 24 555 8889",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-y-auto">
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="w-[150px]">Relationship</TableHead>
                  <TableHead className="w-[180px]">Primary Contact</TableHead>
                  <TableHead className="w-[180px]">
                    Alternative Contact
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emergencyContacts.map((contact, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell>{contact.relationship}</TableCell>
                    <TableCell>{contact.primaryPhone}</TableCell>
                    <TableCell>{contact.alternativePhone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
