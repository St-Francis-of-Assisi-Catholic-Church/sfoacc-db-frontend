import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import React from "react";

type SocietyLayoutProps = {
  children: React.ReactNode;
};

export default function SocietLayout({ children }: SocietyLayoutProps) {
  return (
    <div className="h-full flex flex-col justify-between">
      <Breadcrumbs />
      <div className="h-full overflow-scroll">{children}</div>
    </div>
  );
}
