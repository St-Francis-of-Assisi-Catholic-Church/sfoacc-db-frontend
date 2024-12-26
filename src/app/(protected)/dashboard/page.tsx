import { metaObject } from "@/config/site.config";
import React from "react";

export const metadata = {
  ...metaObject("Dashboard | Home"),
};

export default function DashboardHomePage() {
  return (
    <div className="border w-full">
      <div className="border  h-52">Card</div>
    </div>
  );
}
