import { metaObject } from "@/config/site.config";
import React from "react";
import MembersTable from "./_components/members-table";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export const metadata = {
  ...metaObject("Members | Home"),
};

function page() {
  return (
    <>
      <MembersTable />
    </>
  );
}

export default page;
