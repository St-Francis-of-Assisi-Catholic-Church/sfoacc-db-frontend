import { metaObject } from "@/config/site.config";
import React from "react";
import SocietiesTable from "./_components/society-table";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export const metadata = {
  ...metaObject("Societies | Home"),
};

function page() {
  return (
    <>
      <SocietiesTable />
    </>
  );
}

export default page;
