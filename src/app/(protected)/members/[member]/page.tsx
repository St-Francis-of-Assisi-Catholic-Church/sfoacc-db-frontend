import { metaObject } from "@/config/site.config";
import React from "react";
import MemberDetailsView from "./details-view";

export const metadata = {
  ...metaObject("Member Details "),
};

export default function page() {
  return <MemberDetailsView />;
}
