import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import Link from "next/link";

export interface IMember {
  systemID: number;
  oldChurchID?: string;
  newChurchID?: string;
  lastName: string;
  firstName: string;
  maidenName: string;
  otherNames: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  hometown: string;
  region: string;
  country: string;
  maritalStatus: string;
  mobileNumber: string;
  whatsAppNumber: string;
  emaillAddress: string;
  pictureURL: string;
}

const actionColumn: ColDef<IMember> = {
  headerName: "Actions",
  pinned: "right",
  maxWidth: 120,
  minWidth: 80,
  sortable: false,
  filter: false,
  cellRenderer: (props: CustomCellRendererProps) => (
    <>
      <Link
        href={`/members/${props.data.systemID}`}
        className="hover:underline underline-offset-1 text-blue-800"
      >
        View Details
      </Link>
    </>
  ),
  cellDataType: false,
};

const MemberColumnDefs: ColDef<IMember>[] = [
  {
    field: "systemID",
    headerName: "systemID",
    filter: "agTextColumnFilter",
    minWidth: 80,
    pinned: "left",
  },
  {
    field: "oldChurchID",
    headerName: "Old Church ID",
    filter: "agTextColumnFilter",
    minWidth: 80,
  },
  {
    field: "newChurchID",
    headerName: "New Church ID",
    filter: "agTextColumnFilter",
    minWidth: 80,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "firstName",
    headerName: "First Name",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "maidenName",
    headerName: "Maiden Name",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "otherNames",
    headerName: "Other Names",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "dateOfBirth",
    headerName: "Date of Birth",
    filter: "agDateColumnFilter",
    minWidth: 120,
    valueFormatter: (params) => {
      if (!params.value) return "";
      return new Date(params.value).toLocaleDateString();
    },
  },
  {
    field: "placeOfBirth",
    headerName: "Place of Birth",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "gender",
    headerName: "Gender",
    filter: "agTextColumnFilter",
    minWidth: 100,
  },
  {
    field: "hometown",
    headerName: "Hometown",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "region",
    headerName: "Region",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "country",
    headerName: "Country",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "maritalStatus",
    headerName: "Marital Status",
    filter: "agTextColumnFilter",
    minWidth: 130,
  },
  {
    field: "mobileNumber",
    headerName: "Mobile Number",
    filter: "agTextColumnFilter",
    minWidth: 130,
  },
  {
    field: "whatsAppNumber",
    headerName: "WhatsApp",
    filter: "agTextColumnFilter",
    minWidth: 130,
  },
  {
    field: "emaillAddress",
    headerName: "Email",
    filter: "agTextColumnFilter",
    minWidth: 200,
  },
  {
    field: "pictureURL",
    headerName: "Picture",
    filter: false,
    sortable: false,
    minWidth: 100,
    cellRenderer: (params: CustomCellRendererProps) => {
      return params.value ? (
        <div className="flex items-center justify-center">{params.value}</div>
      ) : null;
    },
  },
  actionColumn,
];

export default MemberColumnDefs;
