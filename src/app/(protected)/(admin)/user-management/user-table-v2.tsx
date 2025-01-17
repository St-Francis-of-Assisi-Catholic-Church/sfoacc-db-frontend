"use client";

import { UserRole, UserStatus } from "@/types";
import { ColDef } from "ag-grid-community";
import { cn } from "@/lib/utils";
import CustomDataTable, {
  DataTableHandle,
} from "@/components/table/customDataTable";
import { useMemo, useRef } from "react";
import { CustomCellRendererProps } from "ag-grid-react";
import ViewUserModal from "./view-user-modal";
import AddUserModal from "./add-user-modal";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

const StatusCellRenderer = ({ value }: { value: UserStatus }) => {
  const statusConfig = {
    active: {
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      label: "Active",
    },
    disabled: {
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      label: "Disabled",
    },
    reset_required: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      label: "Reset Required",
    },
  };

  const config = statusConfig[value];

  return (
    <span
      className={cn(
        "px-2 py-1 rounded text-sm",
        config.bgColor,
        config.textColor
      )}
    >
      {config.label}
    </span>
  );
};

export default function UsersTable() {
  const tableRef = useRef<DataTableHandle>(null);

  const columnDefs = useMemo<ColDef<User>[]>(
    () => [
      { field: "id", headerName: "ID", maxWidth: 70, minWidth: 60 },
      { field: "full_name", headerName: "Full Name", minWidth: 180 },
      { field: "email", minWidth: 240 },
      { field: "role", minWidth: 180 },
      {
        field: "status",
        headerName: "Status",
        minWidth: 120,
        cellRenderer: StatusCellRenderer,
      },
      {
        field: "created_at",
        headerName: "Created At",
        minWidth: 240,
        valueFormatter: (params) => new Date(params.value).toLocaleString(),
      },
      {
        field: "updated_at",
        headerName: "Last Updated",
        minWidth: 240,
        valueFormatter: (params) => new Date(params.value).toLocaleString(),
      },
      {
        headerName: "Actions",
        pinned: "right",
        maxWidth: 120,
        minWidth: 80,
        sortable: false,
        filter: false,
        cellRenderer: (props: CustomCellRendererProps) => (
          <ViewUserModal
            {...props}
            onRefreshData={() => tableRef.current?.refreshData()}
          />
        ),
      },
    ],
    []
  );

  return (
    <CustomDataTable<User>
      ref={tableRef}
      fetchUrl="/api/v1/user-management/users"
      columnDefs={columnDefs}
      showSearchBar={true}
      showRefreshButton={true}
      showPagination={true}
      pageSize={10}
      customActions={
        <AddUserModal onUserAdded={() => tableRef.current?.refreshData()} />
      }
      onDataLoaded={(data) => console.log("Data loaded:", data.length, "users")}
      onError={(error) => console.error("Failed to load users:", error)}
    />
  );
}
