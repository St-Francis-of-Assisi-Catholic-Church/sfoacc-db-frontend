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

export default function SocietalMembershipsCard() {
  // Sample memberships data - replace with actual data
  const memberships = [
    {
      society: "Catholic Men's Association",
      membershipId: "CMA-2020-123",
      dateJoined: "2020-03-15",
      status: "Active",
      role: "Secretary",
    },
    {
      society: "Church Choir",
      membershipId: "CHR-2018-456",
      dateJoined: "2018-06-01",
      status: "Active",
      role: "Member",
    },
    {
      society: "Catholic Teachers Guild",
      membershipId: "CTG-2019-789",
      dateJoined: "2019-09-15",
      status: "Active",
      role: "Member",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Societal Memberships</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Society</TableHead>
              <TableHead>Member ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((membership, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {membership.society}
                  <div className="text-sm text-muted-foreground">
                    Joined:{" "}
                    {new Date(membership.dateJoined).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>{membership.membershipId}</TableCell>
                <TableCell>{membership.role}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-sm
                    ${
                      membership.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {membership.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
