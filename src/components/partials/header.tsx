import { useMediaQuery } from "@/hooks/use-media-query";
import { ChevronRight, Menu, Power, UserRound } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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

export default function Header() {
  const { collapsed, setCollapsed } = useSidebar();
  //   const isDesktop = useMediaQuery("(min-width: 1280px)");

  const isMobile = useMediaQuery("(min-width: 768px)");

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
            {" "}
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" w-52" align="end">
            <DropdownMenuLabel>
              <div>
                <div className="text-sm font-medium text-default-800 capitalize ">
                  jon Doe
                </div>
                <div className="text-xs text-default-600 hover:text-primary">
                  jondoe@gmail.com
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRound className="w-4 h-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mb-0 dark:bg-background" />
            <DropdownMenuItem
              //   onSelect={() => signOut()}
              className=""
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
