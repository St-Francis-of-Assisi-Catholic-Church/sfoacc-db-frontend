import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import React from "react";
// import Image from "next/image";
// import Logo from "@public/sfoacc-logo.png";
// import { Button } from "../ui/button";

export default function Footer() {
  const isMobile = useMediaQuery("(min-width: 768px)");

  if (isMobile) return null;
  // only show this if is mobile screen
  return (
    <div
      className={cn(
        " fixed bottom-0 w-full bg-[#161d26] h-10 flex justify-between items-center px-2",
        "relative"
      )}
    >
      {/* <Button
        className="absolute rounded-full left-[50%] right-[50%] top-[-10px]"
        variant={"ghost"}
        size={"icon"}
      >
        <Image src={Logo} className="h-[40px] w-[40px]" alt="logo" priority />
      </Button> */}
      <p className="text-secondary text-xs font-medium text-center w-full">
        © SFOACC 2024
      </p>
    </div>
  );
}
