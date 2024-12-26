import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

import { useSidebar } from "@/store";
import { NavChild, SideBarNavItem } from "@/config/sidebarNavs";
import { useMediaQuery } from "@/hooks/use-media-query";

export function SidebarNavItem({ item }: { item: SideBarNavItem }) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();
  const isMobile = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);

  // If it's a header
  if (item.isHeader) {
    return collapsed ? (
      <div className="pt-4"></div>
    ) : (
      <div className="px-3 pt-4 mb-2">
        <p className="text-xs font-semibold uppercase text-gray-500">
          {item.title}
        </p>
      </div>
    );
  }

  // If it has children (submenu)
  if (item.child) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors",
            pathname.startsWith(item.href!) && "bg-gray-100"
          )}
        >
          <div className="flex items-center justify-between ">
            {item.icon && (
              <item.icon
                className={cn(
                  "h-5 w-5 mr-2 text-gray-500",
                  pathname === item.href && "text-gray-800"
                )}
              />
            )}
            <span
              className={cn(
                "flex-1 text-sm"
                // isMobile && collapsed && "hidden"
              )}
            >
              {item.title}
            </span>
          </div>
          {!collapsed && (
            <>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "transform rotate-180"
                )}
              />
            </>
          )}
        </button>
        {isOpen && !collapsed && (
          <div className="ml-4 mt-1 space-y-1">
            {item.child.map((child) => (
              <ChildNavItem key={child.href} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Regular nav item
  return (
    <>
      <Link
        href={item.href!}
        className={cn(
          "flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors",
          pathname === item.href && "bg-gray-100"
        )}
      >
        {item.icon && (
          <item.icon
            className={cn(
              "h-5 w-5 mr-2 text-gray-500",
              pathname === item.href && "text-gray-800"
            )}
          />
        )}
        {!isMobile ? (
          <span
            className={cn(
              "text-sm",
              pathname === item.href && " font-semibold",
              collapsed
            )}
          >
            {item.title}
          </span>
        ) : (
          !collapsed && (
            <span
              className={cn(
                "text-sm",
                pathname === item.href && " font-semibold",
                collapsed
              )}
            >
              {item.title}
            </span>
          )
        )}
      </Link>
    </>
  );
}

function ChildNavItem({ item }: { item: NavChild }) {
  const pathname = usePathname();

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors",
        pathname === item.href && "bg-gray-100"
      )}
    >
      <item.icon
        className={cn(
          "h-4 w-4 mr-2 text-gray-500",
          pathname === item.href && "text-gray-800"
        )}
      />
      <span>{item.title}</span>
    </Link>
  );
}
