import { metaObject } from "@/config/site.config";
import React from "react";
import UserManagementView from "./user-management-view";

export const metadata = {
  ...metaObject("Settings | User Managemt"),
};

// users
// avatar - initiatials
// full name,
// email,
// status - active, inactive
// role - super admin, admin, user
// action
export default function UserManagemt() {
  return <UserManagementView />;
}
