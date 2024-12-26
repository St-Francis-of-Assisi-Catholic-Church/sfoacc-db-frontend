import { metaObject } from "@/config/site.config";
import React from "react";

export const metadata = {
  ...metaObject("Members | Home"),
};

function page() {
  return <div>Members Home</div>;
}

export default page;
