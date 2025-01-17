import { useMediaQuery } from "@/hooks/use-media-query";
import { ChevronRight, Menu, Power, UserRound } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { useSidebar } from "@/store";
import MobileSidebar from "./sidebar/mobileSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import handleSignOut from "@/lib/actions/auth/handleSignOut";
import { useSession } from "next-auth/react";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const { collapsed, setCollapsed } = useSidebar();
  //   const isDesktop = useMediaQuery("(min-width: 1280px)");

  const isMobile = useMediaQuery("(min-width: 768px)");
  const userInitials = getInitials(session?.user.full_name);

  return (
    <div className="border w-full h-[50px]">
      <div className="p-2 flex justify-between items-center">
        {/* menu butto */}
        {isMobile ? (
          <Button
            onClick={() => setCollapsed(!collapsed)}
            variant={"ghost"}
            size={"icon"}
          >
            {!collapsed ? <Menu /> : <ChevronRight />}
          </Button>
        ) : (
          <MobileSidebar />
        )}

        {/* user avatar */}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8 ">
              <AvatarFallback className="bg-darkblue border text-white text-xs font-semiBold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" w-52" align="end">
            <DropdownMenuLabel>
              <div>
                <div className="text-sm font-medium text-default-800 capitalize ">
                  {session?.user.full_name}
                </div>
                <div className="text-xs text-default-600 hover:text-primary">
                  {session?.user.email}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={"/profile"}
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserRound className="w-4 h-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mb-0 dark:bg-background" />
            <DropdownMenuItem
              onSelect={() => handleSignOut()}
              className="cursor-pointer"
            >
              <Power className="w-4 h-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
