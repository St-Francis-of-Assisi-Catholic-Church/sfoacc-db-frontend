"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import {
  ColDef,
  ClientSideRowModelModule,
  CsvExportModule,
  ValidationModule,
  ColumnAutoSizeModule,
  ColumnHoverModule,
  QuickFilterModule,
  RowAutoHeightModule,
  PaginationModule,
  CustomFilterModule,
  DateFilterModule,
  NumberFilterModule,
  TextFilterModule,
  RenderApiModule,
} from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { ErrorAlert } from "@/components/ui/errorAlert";
import AddUserModal from "./add-user-modal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSession } from "next-auth/react";
import { UserRole, UserStatus } from "@/types";
import ViewUserModal from "./view-user-modal";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

interface StatusCellRendererParams {
  value: UserStatus;
}

const StatusCellRenderer = ({ value }: StatusCellRendererParams) => {
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

const UserTable = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rowData, setRowData] = useState<User[] | null>(null);
  const [searchText, setSearchText] = useState("");

  const { data: session } = useSession();

  const isMobile = useMediaQuery("(min-width: 768px)");

  const fetchData = useCallback(
    async ({ refresh = false } = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/v1/user-management/users?skip=0&limit=100`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            mode: "cors",
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to fetch users: ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("response", result);
        setRowData(result.data);

        if (gridRef.current?.api) {
          gridRef.current.api.sizeColumnsToFit();
        }
        if (refresh) toast.success("Data refreshed successfully");
      } catch (err) {
        console.error("Fetch error:", err);
        const error = err as Error;
        const errorMessage = error.message || "Failed to fetch users";
        setError(errorMessage);
        toast.error(errorMessage);
        setRowData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [session?.accessToken]
  );

  const actionColumn: ColDef<User> = {
    headerName: "Actions",
    pinned: "right",
    maxWidth: 120,
    minWidth: 80,
    sortable: false,
    filter: false,
    cellRenderer: (props: CustomCellRendererProps) => (
      <ViewUserModal {...props} onRefreshData={refreshData} />
    ),
    cellDataType: false,
  };

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: "id", headerName: "ID", maxWidth: 70, minWidth: 60 },
      {
        field: "full_name",
        headerName: "Full Name",
        filter: true,
        minWidth: 180,
      },
      { field: "email", minWidth: 240, filter: true },
      { field: "role", minWidth: 180, filter: true },
      {
        field: "status",
        headerName: "Status",
        minWidth: 120,
        filter: true,
        cellRenderer: StatusCellRenderer,
      },
      {
        field: "created_at",
        headerName: "Created At",
        minWidth: 240,
        filter: true,
        valueFormatter: (params) => new Date(params.value).toLocaleString(),
      },
      {
        field: "updated_at",
        headerName: "Last Updated",
        minWidth: 240,
        filter: true,
        valueFormatter: (params) => new Date(params.value).toLocaleString(),
      },
      actionColumn,
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
    }),
    []
  );

  const onFilterTextBoxChanged = useCallback((value: string) => {
    setSearchText(value);
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("quickFilterText", value);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData({ refresh: true });
  }, [fetchData]);

  return (
    <div className="h-full w-full space-y-2 flex flex-col">
      <div className="w-full flex justify-between items-center">
        <div className={cn("relative w-28 md:w-72")}>
          <Input
            className={cn("h-8 pl-7 py-1")}
            type="search"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => onFilterTextBoxChanged(e.target.value)}
          />
          <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="flex items-center gap-2 h-8"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            {isMobile && "Refresh"}
          </Button>

          <AddUserModal onUserAdded={() => refreshData()} />
        </div>
      </div>

      <div className="flex flex-col justify-between h-[calc(100%-40px)]">
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        <div
          className={cn(
            "w-full ag-theme-quartz ag-theme-custom-data-table rounded-sm h-full",
            isLoading && "opacity-70"
          )}
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={isMobile && true}
            animateRows={true}
            enableCellTextSelection={true}
            suppressCellFocus={true}
            suppressPaginationPanel={false}
            suppressScrollOnNewData={true}
            suppressMovableColumns={false}
            theme="legacy"
            modules={[
              ValidationModule,
              ColumnAutoSizeModule,
              ColumnHoverModule,
              RowAutoHeightModule,
              QuickFilterModule,
              CsvExportModule,
              ClientSideRowModelModule,
              PaginationModule,
              TextFilterModule,
              NumberFilterModule,
              DateFilterModule,
              CustomFilterModule,
              RenderApiModule,
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default UserTable;
