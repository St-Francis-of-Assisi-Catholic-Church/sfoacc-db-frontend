import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User2, ClipboardList, Wallet } from "lucide-react";

const leadershipData = {
  president: {
    name: "John Doe",
    contact: "+233 XX XXX XXXX",
  },
  vicePresident: {
    name: "Sarah Johnson",
    contact: "+233 XX XXX XXXX",
  },
  secretary: {
    name: "Michael Smith",
    contact: "+233 XX XXX XXXX",
  },
  treasurer: {
    name: "Grace Mensah",
    contact: "+233 XX XXX XXXX",
  },
};

export function SocietyLeadershipCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Society Leadership
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-12 px-4 py-2"></th>
                <th className="px-4 py-2 text-left font-medium">Role</th>
                <th className="px-4 py-2 text-left font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <User2 className="h-4 w-4 text-muted-foreground" />
                </td>
                <td className="px-4 py-2 font-medium">President</td>
                <td className="px-4 py-2">
                  <div>
                    <div className="font-medium">
                      {leadershipData.president.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {leadershipData.president.contact}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <User2 className="h-4 w-4 text-muted-foreground" />
                </td>
                <td className="px-4 py-2 font-medium">Vice President</td>
                <td className="px-4 py-2">
                  <div>
                    <div className="font-medium">
                      {leadershipData.vicePresident.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {leadershipData.vicePresident.contact}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </td>
                <td className="px-4 py-2 font-medium">Secretary</td>
                <td className="px-4 py-2">
                  <div>
                    <div className="font-medium">
                      {leadershipData.secretary.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {leadershipData.secretary.contact}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </td>
                <td className="px-4 py-2 font-medium">Treasurer</td>
                <td className="px-4 py-2">
                  <div>
                    <div className="font-medium">
                      {leadershipData.treasurer.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {leadershipData.treasurer.contact}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
