import {
  BookUser,
  ChartPie,
  Church,
  Cog,
  LucideIcon,
  UserCog,
  UserPlus,
  // UserRoundCheck,
  Users,
} from "lucide-react";

export interface NavChild {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface SideBarNavItem {
  title: string;
  isHeader?: boolean;
  icon?: LucideIcon;
  href?: string;
  child?: NavChild[];
}

// Add your existing sideBarNavs array with the proper type
export const sideBarNavs: SideBarNavItem[] = [
  // {
  //   isHeader: true,
  //   title: "menu",
  // },
  {
    title: "Dashboard",
    icon: ChartPie,
    href: "/dashboard",
  },
  {
    title: "Members",
    icon: Users,
    href: "/members",
    child: [
      {
        title: "Registration Overview",
        href: "/members/registration-overview",
        icon: ChartPie,
      },
      {
        title: "All Members",
        href: "/members",
        icon: BookUser,
      },
      {
        title: "Add New Member",
        href: "/members/add-new-member",
        icon: UserPlus,
      },
      // {
      //   title: "Verify Member",
      //   href: "/members/verify-member",
      //   icon: UserRoundCheck,
      // },
    ],
  },

  {
    title: "Societies",
    icon: Church,
    href: "/societies",
    // child: [
    //   {
    //     title: "Overview",
    //     href: "/societies/",
    //     icon: Church,
    //   },
    //   {
    //     title: "Add New Society",
    //     href: "/societies/add-new-society",
    //     icon: Church,
    //   },
    // ],
  },
  {
    isHeader: true,
    title: "Admin",
  },
  {
    title: "User Management",
    icon: UserCog,
    href: "/user-management",
  },
  {
    title: "System Settings",
    icon: Cog,
    href: "/settings",
  },
];
