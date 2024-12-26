import { metaObject } from "@/config/site.config";
import React from "react";

import OverviewStats from "./_components/overview-stats";
import SacramentsStats from "./_components/sacraments-stats";

export const metadata = {
  ...metaObject("Dashboard | Home"),
};

export default function DashboardHomePage() {
  return (
    <div className=" w-full space-y-6">
      {/* <div className="border  h-52">Card</div> */}

      <OverviewStats />
      <SacramentsStats />
    </div>
  );
}
