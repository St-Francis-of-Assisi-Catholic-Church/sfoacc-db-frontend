"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AgGridReact } from "ag-grid-react";
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
  GridReadyEvent,
  GridApi,
} from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { ErrorAlert } from "@/components/ui/errorAlert";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSession } from "next-auth/react";

export interface DataTableHandle {
  refreshData: () => Promise<void>;
  exportToCsv: () => void;
  api: GridApi | null;
}

interface DataTableProps<T> {
  fetchUrl: string;
  columnDefs: ColDef<T>[];
  showSearchBar?: boolean;
  showRefreshButton?: boolean;
  showPagination?: boolean;
  customActions?: React.ReactNode;
  rowHeight?: number;
  pageSize?: number;
  onDataLoaded?: (data: T[]) => void;
  onError?: (error: string) => void;
  fetchOptions?: RequestInit;
  transformResponse?: (data: unknown) => T[];
  className?: string;
  containerClassName?: string;
}

function DataTable<T>(
  props: DataTableProps<T>,
  ref: React.ForwardedRef<DataTableHandle>
) {
  const {
    fetchUrl,
    columnDefs,
    showSearchBar = true,
    showRefreshButton = true,
    showPagination = true,
    customActions,
    rowHeight = 48,
    pageSize = 100,
    onDataLoaded,
    onError,
    fetchOptions = {},
    transformResponse,
    className,
    containerClassName,
  } = props;

  const gridRef = useRef<AgGridReact>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rowData, setRowData] = useState<T[] | null>(null);
  const [searchText, setSearchText] = useState("");
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const { data: session } = useSession();
  const isMobile = useMediaQuery("(min-width: 768px)");

  // Memoize fetchOptions to prevent unnecessary re-renders
  const memoizedFetchOptions = useMemo(() => fetchOptions, []);

  // Memoize the headers object
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${session?.accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    [session?.accessToken]
  );

  const fetchData = useCallback(
    async ({ refresh = false } = {}) => {
      if (!session?.accessToken) {
        setError("No authentication token available");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(fetchUrl, {
          method: "GET",
          headers,
          ...memoizedFetchOptions,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to fetch data: ${response.statusText}`
          );
        }

        const data = await response.json();
        const transformedData = transformResponse
          ? transformResponse(data)
          : (data as T[]);

        setRowData(transformedData);
        onDataLoaded?.(transformedData);

        if (gridApi) {
          gridApi.sizeColumnsToFit();
        }

        if (refresh) {
          toast.success("Data refreshed successfully");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch data";
        setError(errorMessage);
        onError?.(errorMessage);
        toast.error(errorMessage);
        setRowData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [
      fetchUrl,
      headers,
      memoizedFetchOptions,
      session?.accessToken,
      transformResponse,
      onDataLoaded,
      onError,
      gridApi,
    ]
  );

  const exportToCsv = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `export-${new Date().toISOString()}.csv`,
      });
    }
  }, [gridApi]);

  // Memoize the handle to prevent unnecessary re-renders
  const handle = useMemo(
    () => ({
      refreshData: async () => {
        await fetchData({ refresh: true });
      },
      exportToCsv,
      api: gridApi,
    }),
    [fetchData, exportToCsv, gridApi]
  );

  useImperativeHandle(ref, () => handle, [handle]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    }),
    []
  );

  const onFilterTextBoxChanged = useCallback(
    (value: string) => {
      setSearchText(value);
      if (gridApi) {
        gridApi.setGridOption("quickFilterText", value);
      }
    },
    [gridApi]
  );

  const debouncedFilterChange = useMemo(
    () => debounce(onFilterTextBoxChanged, 300),
    [onFilterTextBoxChanged]
  );

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  // Only fetch data on initial mount and when fetchUrl changes
  useEffect(() => {
    fetchData();
  }, [fetchUrl]); // Remove fetchData from dependencies

  // Clean up function for debounce
  useEffect(() => {
    return () => {
      debouncedFilterChange.cancel();
    };
  }, [debouncedFilterChange]);

  return (
    <div
      className={cn(
        "h-full w-full space-y-2 flex flex-col",
        containerClassName
      )}
    >
      {(showSearchBar || showRefreshButton || customActions) && (
        <div className="w-full flex justify-between items-center gap-2">
          {showSearchBar && (
            <div className={cn("relative w-28 md:w-72")}>
              <Input
                className={cn("h-8 pl-7 py-1")}
                type="search"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => debouncedFilterChange(e.target.value)}
              />
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
            </div>
          )}

          <div className="flex gap-2">
            {showRefreshButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchData({ refresh: true })}
                disabled={isLoading}
                className="flex items-center gap-2 h-8"
              >
                <RefreshCw
                  className={cn("h-4 w-4", isLoading && "animate-spin")}
                />
                {isMobile && "Refresh"}
              </Button>
            )}
            {customActions}
          </div>
        </div>
      )}

      <div className="flex flex-col justify-between h-[calc(100%-40px)]">
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        <div
          className={cn(
            "w-full ag-theme-quartz ag-theme-custom-data-table rounded-sm h-full",
            isLoading && "opacity-70",
            className
          )}
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={showPagination && isMobile}
            paginationPageSize={pageSize}
            rowHeight={rowHeight}
            animateRows={true}
            enableCellTextSelection={true}
            suppressCellFocus={true}
            suppressPaginationPanel={false}
            suppressScrollOnNewData={true}
            suppressMovableColumns={false}
            onGridReady={onGridReady}
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

// Utility function for debouncing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    clearTimeout(timeout);
  };

  return debounced;
}

export default forwardRef(DataTable) as <T>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<DataTableHandle> }
) => React.ReactElement;
