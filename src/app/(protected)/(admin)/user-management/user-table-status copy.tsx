// "use client";

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
// import {
//   ColDef,
//   ClientSideRowModelModule,
//   CsvExportModule,
//   ValidationModule,
//   ColumnAutoSizeModule,
//   ColumnHoverModule,
//   QuickFilterModule,
//   RowAutoHeightModule,
//   PaginationModule,
//   CustomFilterModule,
//   DateFilterModule,
//   NumberFilterModule,
//   TextFilterModule,
// } from "ag-grid-community";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { ApiSimulator, cn } from "@/lib/utils";
// import { RefreshCw, Search } from "lucide-react";
// import { toast } from "sonner";
// import { ErrorAlert } from "@/components/ui/errorAlert";
// import AddUserModal from "./add-user-modal";
// import { useMediaQuery } from "@/hooks/use-media-query";
// import { UserRole, UserStatus } from "@/types";

// interface User {
//   id: number;
//   fullname: string;
//   email: string;
//   role: UserRole;
//   status: UserStatus;
//   dateCreated: string;
//   lastUpdated: string;
// }

// interface StatusCellRendererParams {
//   value: UserStatus;
// }

// const initialUsers: User[] = [
//   {
//     id: 1,
//     fullname: "John Smith",
//     email: "john.smith@company.com",
//     role: "super_admin",
//     status: "active",
//     dateCreated: "2024-12-01T08:00:00Z",
//     lastUpdated: "2024-12-26T08:00:00Z",
//   },
//   {
//     id: 2,
//     fullname: "Sarah Johnson",
//     email: "sarah.j@company.com",
//     role: "admin",
//     status: "active",
//     dateCreated: "2024-12-10T09:30:00Z",
//     lastUpdated: "2024-12-26T08:00:00Z",
//   },
//   {
//     id: 3,
//     fullname: "Michael Chen",
//     email: "m.chen@company.com",
//     role: "user",
//     status: "disabled",
//     dateCreated: "2024-12-15T14:20:00Z",
//     lastUpdated: "2024-12-26T08:00:00Z",
//   },
// ];

// const ActionCellRenderer = (props: CustomCellRendererProps<User>) => {
//   const user = props.data;
//   if (!user) return null;

//   return (
//     <div className="flex gap-2">
//       <Dialog>
//         <DialogTrigger asChild className="w-full">
//           <Button variant="outline" size="sm" className="mt-1">
//             View
//           </Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>User Details</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div>
//               <strong>Name:</strong> {user.fullname}
//             </div>
//             <div>
//               <strong>Email:</strong> {user.email}
//             </div>
//             <div>
//               <strong>Role:</strong> {user.role}
//             </div>
//             <div>
//               <strong>Status:</strong> {user.status}
//             </div>
//             <div>
//               <strong>Created:</strong>{" "}
//               {new Date(user.dateCreated).toLocaleString()}
//             </div>
//             <div>
//               <strong>Last Updated:</strong>{" "}
//               {new Date(user.lastUpdated).toLocaleString()}
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// const StatusCellRenderer = ({ value }: StatusCellRendererParams) => (
//   <span
//     className={cn(
//       "px-2 py-1 rounded text-sm",
//       value === "active"
//         ? "bg-green-100 text-green-800"
//         : "bg-red-100 text-red-800"
//     )}
//   >
//     {value}
//   </span>
// );

// const UserTable = () => {
//   const gridRef = useRef<AgGridReact>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [rowData, setRowData] = useState<User[] | null>(null);
//   const [searchText, setSearchText] = useState("");

//   const isMobile = useMediaQuery("(min-width: 768px)");

//   const fetchData = useCallback(async ({ refresh = false } = {}) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       await ApiSimulator(true);
//       setRowData(initialUsers);

//       if (gridRef.current?.api) {
//         gridRef.current.api.sizeColumnsToFit();
//       }
//       if (refresh) toast.success("Data refreshed successfully");
//     } catch (err) {
//       const error = err as Error;
//       const errorMessage =
//         "message" in error ? error.message : "Failed to fetch data";
//       setError(errorMessage);
//       toast.error(errorMessage);
//       setRowData(null);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const actionColumn: ColDef<User> = {
//     headerName: "Actions",
//     pinned: "right",
//     maxWidth: 120,
//     minWidth: 80,
//     sortable: false,
//     filter: false,
//     cellRenderer: ActionCellRenderer,
//     cellDataType: false,
//   };

//   const columnDefs = useMemo<ColDef[]>(
//     () => [
//       { field: "id", headerName: "ID", maxWidth: 70, minWidth: 60 },
//       {
//         field: "fullname",
//         headerName: "Full Name",
//         filter: true,
//         minWidth: 180,
//       },
//       { field: "email", minWidth: 240, filter: true },
//       { field: "role", minWidth: 180, filter: true },
//       {
//         field: "status",
//         minWidth: 120,
//         filter: true,
//         cellRenderer: StatusCellRenderer,
//       },
//       {
//         field: "dateCreated",
//         headerName: "Created At",
//         minWidth: 240,
//         filter: true,
//         valueFormatter: (params) => new Date(params.value).toLocaleString(),
//       },
//       {
//         field: "lastUpdated",
//         headerName: "Last Updated",
//         minWidth: 240,
//         filter: true,
//         valueFormatter: (params) => new Date(params.value).toLocaleString(),
//       },
//       actionColumn,
//     ],
//     []
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       sortable: true,
//       resizable: true,
//     }),
//     []
//   );

//   const onFilterTextBoxChanged = useCallback((value: string) => {
//     setSearchText(value);
//     if (gridRef.current?.api) {
//       gridRef.current.api.setGridOption("quickFilterText", value);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // const handleUserAdded = useCallback((newUser: User) => {
//   //   setRowData((prevData) => (prevData ? [...prevData, newUser] : [newUser]));
//   // }, []);

//   const refreshData = useCallback(async () => {
//     await fetchData({ refresh: true });
//   }, [fetchData]);

//   return (
//     <div className="h-full w-full space-y-2 flex flex-col">
//       <div className="w-full flex justify-between items-center">
//         <div className={cn("relative w-28 md:w-72")}>
//           <Input
//             className={cn("h-8 pl-7 py-1")}
//             type="search"
//             placeholder="Search..."
//             value={searchText}
//             onChange={(e) => onFilterTextBoxChanged(e.target.value)}
//           />
//           <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
//         </div>

//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={refreshData}
//             className="flex items-center gap-2 h-8"
//           >
//             <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
//             {isMobile && "Refresh"}
//           </Button>

//           <AddUserModal onUserAdded={refreshData} />
//         </div>
//       </div>

//       <div className="flex flex-col justify-between h-[calc(100%-40px)]">
//         {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

//         <div
//           className={cn(
//             "w-full ag-theme-quartz ag-theme-custom-data-table rounded-sm h-full",
//             isLoading && "opacity-70"
//           )}
//         >
//           <AgGridReact
//             ref={gridRef}
//             rowData={rowData}
//             columnDefs={columnDefs}
//             defaultColDef={defaultColDef}
//             pagination={isMobile && true}
//             animateRows={true}
//             enableCellTextSelection={true}
//             suppressCellFocus={true}
//             suppressPaginationPanel={false}
//             suppressScrollOnNewData={true}
//             suppressMovableColumns={false}
//             theme="legacy"
//             modules={[
//               ValidationModule,
//               ColumnAutoSizeModule,
//               ColumnHoverModule,
//               RowAutoHeightModule,
//               QuickFilterModule,
//               CsvExportModule,
//               ClientSideRowModelModule,
//               PaginationModule,
//               TextFilterModule,
//               NumberFilterModule,
//               DateFilterModule,
//               CustomFilterModule,
//             ]}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserTable;
