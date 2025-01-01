import { auth } from "@/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { metaObject } from "@/config/site.config";
import { cn, getInitials } from "@/lib/utils";
import { Lock, MonitorSmartphone } from "lucide-react";

export const metadata = {
  ...metaObject("Profile"),
};

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h1 className="text-xl md:text-xl font-semibold text-default-800">
          My Profile
        </h1>
      </div>

      {/* Profile Card */}
      {/* <Card className="overflow-hidden">
        <CardContent className="flex flex-col md:flex-row gap-6 p-6">
          <div className="flex flex-col items-center space-y-3 md:w-1/4">
            <Avatar className="h-32 w-32">
              <AvatarFallback className="bg-darkblue text-white text-4xl font-bold">
                {getInitials(session?.user.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="font-semibold text-lg">
                {session?.user.full_name}
              </h2>
              <p className="text-sm text-gray-600">{session?.user.role}</p>
            </div>
          </div>

          <div className="md:w-3/4">
            <table className="w-full border rounded-lg overflow-hidden">
              <tbody className="divide-y text-sm md:text-base">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-600">
                    Full Name
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {session?.user.full_name}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-600">Email</td>
                  <td className="px-6 py-4 font-semibold">
                    {session?.user.email}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-600">Role</td>
                  <td className="px-6 py-4 font-semibold capitalize">
                    {session?.user.role}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-600">
                    Status
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-3 py-1 text-sm rounded-full font-medium",
                        session?.user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {session?.user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-600">
                    Date Joined
                  </td>
                  <td className="px-6 py-4 font-semibold">Not available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card> */}

      <Card className="">
        <CardContent className=" flex  flex-col md:flex-row gap-5 p-2">
          <div className=" flex items-center justify-center md:px-4 py-3">
            <Avatar className="h-28 w-28 md:h-28 md:w-28">
              <AvatarFallback className="bg-darkblue border text-white text-3xl md:text-5xl font-bold">
                {getInitials(session?.user.full_name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className=" rounded-lg overflow-hidden w-full border">
            <table className="w-full">
              <tbody className="divide-y-0 text-md whitespace-nowra">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-[3px] font-normal whitespace-nowra">
                    Full Name:
                  </td>
                  <td className="px-4 py-[3px] font-semibold">
                    {session?.user.full_name}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 bg-gray-100">
                  <td className="px-4 py-[3px] font-normal">Email:</td>
                  <td className="px-4 py-[3px] font-semibold">
                    {session?.user.email}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-[3px] font-normal">Role:</td>
                  <td className="px-4 py-[3px] font-semibold">
                    {session?.user.role}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 bg-gray-100">
                  <td className="px-4 py-[3px] font-normal">Status:</td>
                  <td className="px-4 py-[3px]">
                    <span
                      className={cn(
                        "px-2 py-[3px] text-sm rounded-full "
                        // session?.user.is_active
                        //   ? "bg-green-100 text-green-800"
                        //   : "bg-red-100 text-red-800"
                      )}
                    >
                      {session?.user.status}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-[3px] font-normal whitespace-nowra">
                    Date joined:
                  </td>
                  <td className="px-4 py-[3px] font-semibold whitespace-nowrap">
                    {"null"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Features */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Reset Password Card */}
        <Card>
          <CardTitle className="p-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Reset Password
          </CardTitle>
          <CardContent className="p-4 pt-0">
            <div className="border rounded-lg p-6 min-h-[8rem] flex flex-col items-center justify-center text-center space-y-2">
              <p className="text-gray-600">Password management coming soon!</p>
              <p className="text-sm text-gray-500">
                Change your password and manage security settings
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Devices & Sessions Card */}
        <Card>
          <CardTitle className="p-4 flex items-center gap-2">
            <MonitorSmartphone className="w-5 h-5" />
            Devices & Sessions
          </CardTitle>
          <CardContent className="p-3 pt-0">
            <div className="border rounded-lg p-6 min-h-[8rem] flex flex-col items-center justify-center text-center space-y-2">
              <p className="text-gray-600">Session management coming soon!</p>
              <p className="text-sm text-gray-500">
                View and manage your active sessions across devices
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
