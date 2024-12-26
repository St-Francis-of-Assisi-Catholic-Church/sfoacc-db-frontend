import DashboardLayout from "@/components/layout/dashboard.layout";
import React from "react";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
