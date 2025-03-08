import { metaObject } from "@/config/site.config";
import React from "react";
import MemberStats from "./member-stats";

export const metadata = {
  ...metaObject("Parishioners | Registration Overview"),
};

function page() {
  return (
    <>
      <MemberStats />
    </>
  );
}

export default page;
