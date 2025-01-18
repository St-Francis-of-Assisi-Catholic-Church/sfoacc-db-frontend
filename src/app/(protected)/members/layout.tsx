import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import React from "react";

type MembersLayoutProps = {
  children: React.ReactNode;
};

export default function MembersLayout({ children }: MembersLayoutProps) {
  return (
    <div className="h-full flex flex-col justify-between">
      <Breadcrumbs />
      <div className="h-full overflow-scroll">{children}</div>
    </div>
  );
}
