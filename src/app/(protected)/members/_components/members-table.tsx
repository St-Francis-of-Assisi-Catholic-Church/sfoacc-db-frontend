"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/errorAlert";
import {
  //   ColDef,
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";

import MemberColumnDefs, { IMember } from "./member-columns";

import membersData from "./members.json";

export default function MembersTable() {
  const gridRef = useRef<AgGridReact>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rowData, setRowData] = useState<IMember[] | null>(null);
  const [searchText, setSearchText] = useState("");

  const isMobile = useMediaQuery("(min-width: 768px)");

  const fetchData = useCallback(async ({ refresh = false } = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      setRowData(membersData.members);
      if (refresh) toast.success("Data refreshed successfully");
    } catch (err) {
      console.error("Fetch error:", err);
      const error = err as Error;
      const errorMessage = error.message || "Failed to fetch users";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

          {/* <AddUserModal onUserAdded={() => refreshData()} /> */}
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
            columnDefs={MemberColumnDefs}
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
}
