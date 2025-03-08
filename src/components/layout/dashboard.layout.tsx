"use client";
import React, { ReactNode } from "react";
import LayoutLoader from "../loaders/layout-loader";
import { useMounted } from "@/hooks/use-mounted";
import Header from "../partials/header";
import Footer from "../partials/footer";
import Sidebar from "../partials/sidebar";
import { useSidebar } from "@/store";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useMediaQuery("(min-width: 768px)");
  const mounted = useMounted();
  const { collapsed } = useSidebar();

  if (!mounted) {
    return <LayoutLoader />;
  }
  return (
    <>
      {/* <div className="h-screen ">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
            {children}
          </div>
          <Footer />
        </div>
      </div> */}

      <div className="flex justify-between h-screen w-full ">
        <Sidebar />
        <main
          className={cn(
            "flex-1 flex flex-col w-full",
            isMobile && (collapsed ? "ml-[72px]" : "ml-[248px]")
          )}
        >
          <Header />
          <div className="flex-1 w-full overflow-x-auto overflow-y-auto bg-[#f2f3f8] pt-4 px-4 pb-2 ">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
