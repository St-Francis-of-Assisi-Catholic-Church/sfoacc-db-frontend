import React from "react";
import SocietyDetails from "./society-details";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Societies "),
};

function page() {
  return (
    <>
      <SocietyDetails />
    </>
  );
}

export default page;
