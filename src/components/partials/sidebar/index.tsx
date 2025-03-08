import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSidebar } from "@/store";
import { cn } from "@/lib/utils";
import Image from "next/image";

import Logo from "@public/sfoacc-logo.png";
import { ScrollArea } from "../../ui/scroll-area";
import { SidebarNavItem } from "./sidebarNavItem";

import { sideBarNavs } from "@/config/sidebarNavs";

export default function Sidebar() {
  const isMobile = useMediaQuery("(min-width: 768px)");
  const { collapsed } = useSidebar();

  if (!isMobile) {
    return null;
  }
  return (
    <div
      className={cn(
        "border-r fixed h-full top-0 bg-[#152444]l bg-white",
        {
          "w-[248px]": !collapsed,
          "w-[72px]": collapsed,
        },
        ""
      )}
    >
      <div className="flex gap-2 justify-center items-center h-[46px]  mt-5  pb-1">
        <Image src={Logo} className="h-[38px] w-[38px]" alt="logo" priority />
        <div className={cn(collapsed && "hidden")}>
          <h1 className="font-semibold text-whitel">SFOACC</h1>
          <p className="font-light text-sm -mt-1 text-whitel">
            Church DB System v1.00
          </p>
        </div>
      </div>

      <ScrollArea className={cn("h-[calc(100%-48px)]", "mt-10 p-2")}>
        <nav
          className={cn(" space-y-1", {
            " space-y-2 text-center": collapsed,
          })}
        >
          {sideBarNavs.map((item, index) => (
            <SidebarNavItem key={item.title + index} item={item} />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
