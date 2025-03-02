import {
  Sheet,
  //   SheetClose,
  //   SheetClose,
  SheetContent,
  SheetDescription,
  //   SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import Logo from "@public/sfoacc-logo.png";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNavItem } from "./sidebarNavItem";
import { sideBarNavs } from "@/config/sidebarNavs";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>

      <SheetContent side={"left"} className="px-2 pt-0 pb-2">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>

          <div className="flex gap-2 justify-start items-start h-[50px] border-b">
            <Image
              src={Logo}
              className="h-[40px] w-[40px]"
              alt="logo"
              priority
            />
            <div className={cn("text-start")}>
              <h1 className="font-semibold">SFOACC</h1>
              <p className="font-light text-sm -mt-1">Church DB System v1.00</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className=" h-[calc(100%-78px)] mt-3">
          <nav className={cn(" space-y-1 ")}>
            {/* {sideBarNavs.map((item, index) => (
              //   <SidebarNavItem key={item.title + index} item={item} />
              <div key={item.title + index} onClick={() => setOpen(false)}>
                <SidebarNavItem item={item} />
              </div>
            ))} */}
            {sideBarNavs.map((item, index) => (
              <SidebarNavItem key={item.title + index} item={item} />
            ))}
            {/* 
            {sideBarNavs.map((item, index) =>
              item.isHeader ? (
                <div key={item.title + index} className="pt-4">
                  <SidebarNavItem item={item} />
                </div>
              ) : (
                <div key={item.title + index} onClick={() => setOpen(false)}>
                  <SidebarNavItem item={item} />
                </div>
              )
            )} */}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
