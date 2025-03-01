import { metaObject } from "@/config/site.config";
import React from "react";
import AddNewMemberView from "./_components/add-new-member-view";

export const metadata = {
  ...metaObject("Members | Add new member"),
};

function page() {
  return (
    <>
      <AddNewMemberView />
    </>
  );
}

export default page;
