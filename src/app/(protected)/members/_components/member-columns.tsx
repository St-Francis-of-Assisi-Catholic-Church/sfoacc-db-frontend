import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import Link from "next/link";

export interface IParishioner {
  id: number;
  old_church_id?: string;
  new_church_id?: string;
  last_name: string;
  first_name: string;
  maiden_name?: string;
  other_names?: string;
  date_of_birth: string;
  place_of_birth: string;
  gender: string;
  hometown: string;
  region: string;
  country: string;
  marital_status: string;
  mobile_number: string;
  whatsapp_number?: string;
  email_address: string;
  place_of_worship: string;
  current_residence: string;
  membership_status: string;
  verification_status: string;
  created_at: string;
  updated_at: string;
}

interface Child {
  name: string;
}

// Interface for family information
export interface IFamilyInfo {
  id: number;
  spouse_name?: string | null;
  spouse_status?: string | null;
  spouse_phone?: string | null;
  father_name?: string | null;
  father_status?: string | null;
  mother_name?: string | null;
  mother_status?: string | null;
  children: Child[]; // You may want to define a more specific type for children
  created_at: string;
  updated_at: string;
}

// Interface for occupation
export interface IOccupation {
  id: number;
  role?: string | null;
  employer?: string | null;
  parishioner_id: number;
  created_at: string;
  updated_at: string;
}

// Interface for emergency contact
export interface IEmergencyContact {
  id: number;
  name: string;
  relationship: string;
  primary_phone: string;
  alternative_phone?: string | null;
  parishioner_id: number;
  created_at: string;
  updated_at: string;
}

// Interface for medical condition
export interface IParMedicalCondition {
  id: number;
  condition: string;
  notes?: string | null;
  parishioner_id: number;
  created_at: string;
  updated_at: string;
}

// Interface for sacrament
export interface IParSacrament {
  id: number;
  type: string;
  date: string;
  place: string;
  minister: string;
  parishioner_id: number;
  created_at: string;
  updated_at: string;
}

// Interface for skill
export interface IParSkill {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Detailed parishioner interface extending the base parishioner interface
export interface IDetailedParishioner extends IParishioner {
  family_info: IFamilyInfo;
  occupation?: IOccupation;
  emergency_contacts: IEmergencyContact[];
  medical_conditions: IParMedicalCondition[];
  sacraments: IParSacrament[];
  skills: IParSkill[];
}

const actionColumn: ColDef<IParishioner> = {
  headerName: "Actions",
  pinned: "right",
  maxWidth: 120,
  minWidth: 80,
  sortable: false,
  filter: false,
  cellRenderer: (props: CustomCellRendererProps) => (
    <>
      <Link
        href={`/members/${props.data.id}`}
        className="hover:underline underline-offset-1 text-blue-800"
      >
        View Details
      </Link>
    </>
  ),
  cellDataType: false,
};

const MemberColumnDefs: ColDef<IParishioner>[] = [
  {
    field: "id",
    headerName: "ID",
    filter: "agTextColumnFilter",
    minWidth: 80,
    pinned: "left",
  },
  {
    field: "old_church_id",
    headerName: "Old Church ID",
    filter: "agTextColumnFilter",
    minWidth: 80,
  },
  {
    field: "new_church_id",
    headerName: "New Church ID",
    filter: "agTextColumnFilter",
    minWidth: 80,
  },
  {
    field: "last_name",
    headerName: "Last Name",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "first_name",
    headerName: "First Name",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "maiden_name",
    headerName: "Maiden Name",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "other_names",
    headerName: "Other Names",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "date_of_birth",
    headerName: "Date of Birth",
    filter: "agDateColumnFilter",
    minWidth: 120,
    valueFormatter: (params) => {
      if (!params.value) return "";
      return new Date(params.value).toLocaleDateString();
    },
  },
  {
    field: "place_of_birth",
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
    field: "marital_status",
    headerName: "Marital Status",
    filter: "agTextColumnFilter",
    minWidth: 130,
  },
  {
    field: "mobile_number",
    headerName: "Mobile Number",
    filter: "agTextColumnFilter",
    minWidth: 130,
  },
  {
    field: "whatsapp_number",
    headerName: "WhatsApp",
    filter: "agTextColumnFilter",
    minWidth: 130,
  },
  {
    field: "email_address",
    headerName: "Email",
    filter: "agTextColumnFilter",
    minWidth: 200,
  },
  {
    field: "place_of_worship",
    headerName: "Place of Worship",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "current_residence",
    headerName: "Current Residence",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "membership_status",
    headerName: "Membership Status",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "verification_status",
    headerName: "Verification Status",
    filter: "agTextColumnFilter",
    minWidth: 150,
  },
  {
    field: "created_at",
    headerName: "Created At",
    filter: "agDateColumnFilter",
    minWidth: 160,
    valueFormatter: (params) => {
      if (!params.value) return "";
      return new Date(params.value).toLocaleString();
    },
  },
  {
    field: "updated_at",
    headerName: "Updated At",
    filter: "agDateColumnFilter",
    minWidth: 160,
    valueFormatter: (params) => {
      if (!params.value) return "";
      return new Date(params.value).toLocaleString();
    },
  },
  actionColumn,
];

export default MemberColumnDefs;
