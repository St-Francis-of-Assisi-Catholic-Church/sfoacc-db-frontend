"use client";
import React from "react";
import SiteLogo from "@public/sfoacc-logo.png";
import { Loader2 } from "lucide-react";
import Image from "next/image";
const LayoutLoader = () => {
  return (
    <div className=" h-screen flex items-center justify-center flex-col space-y-2">
      {/* <SiteLogo className=" h-10 w-10 text-primary" /> */}
      <Image src={SiteLogo} className="h-[4rem] w-[4rem]" alt="logo" priority />
      <span className=" inline-flex gap-1 items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <p>Loading...</p>
      </span>
    </div>
  );
};

export default LayoutLoader;
