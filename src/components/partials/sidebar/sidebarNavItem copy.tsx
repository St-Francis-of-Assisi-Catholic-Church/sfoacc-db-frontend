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

  // Helper function to check if a path is active
  const isPathActive = (itemPath: string) => {
    // Remove trailing slashes for consistency
    const normalizedPath = pathname.replace(/\/$/, "");
    const normalizedItemPath = itemPath.replace(/\/$/, "");

    // Special case for the members list route
    if (normalizedItemPath === "/members") {
      // Check if current path is either /members exactly or /members/{numeric_id}
      const isMemberDetail = /^\/members\/\d+$/.test(normalizedPath);
      const isExactMatch = normalizedPath === "/members";
      return isExactMatch || isMemberDetail;
    }

    // For nav items without children, check if the current path starts with the item path
    // But ensure it's a proper path segment to avoid partial matches
    // e.g., "/soc" shouldn't match "/societies"
    if (!item.child && normalizedItemPath !== "/") {
      return (
        normalizedPath === normalizedItemPath ||
        normalizedPath.startsWith(normalizedItemPath + "/")
      );
    }

    // For other routes, use exact matching
    return normalizedPath === normalizedItemPath;
  };

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
    const isChildActive = item.child.some((child) => isPathActive(child.href));

    return (
      <>
        {/* not collapsed */}
        {!collapsed && (
          <div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 hover:bg-gray-100 rounded-md transition-colors",
                (isPathActive(item.href!) || isChildActive) &&
                  "bg-darkblue/30 text-gray-900 hover:bg-darkblue/40"
              )}
            >
              <div className="flex items-center justify-between">
                {item.icon && (
                  <item.icon
                    className={cn(
                      "h-5 w-5 mr-2 text-gray-500",
                      (isPathActive(item.href!) || isChildActive) &&
                        "text-gray-800"
                    )}
                  />
                )}
                <span className={cn("flex-1 text-sm")}>{item.title}</span>
              </div>
              {!collapsed && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "transform rotate-180"
                  )}
                />
              )}
            </button>
            {isOpen && !collapsed && (
              <div className="ml-4 mt-1 space-y-1">
                {item.child.map((child) => (
                  <ChildNavItem
                    key={child.href}
                    item={child}
                    isActive={isPathActive(child.href)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* collapsed */}
        {collapsed && (
          <>
            <div>
              <Link
                href={item.href!}
                className={cn(
                  "flex-col flex items-center justify-center px-3 py-2 hover:bg-darkblue/20 rounded-md transition-colors",
                  isPathActive(item.href!) &&
                    "bg-darkblue text-white hover:bg-darkblue"
                )}
              >
                {item.icon && (
                  <item.icon
                    className={cn(
                      "h-5 w-5  text-gray-500",
                      isPathActive(item.href!) && "text-white"
                    )}
                  />
                )}
              </Link>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <Link
        href={item.href!}
        className={cn(
          "flex-row flex items-center px-3 py-2 hover:bg-darkblue/20 rounded-md transition-colors ",
          isPathActive(item.href!) &&
            "bg-darkblue text-white hover:bg-darkblue  ",
          collapsed && "flex-col hover:bg-gray-300"
        )}
      >
        {item.icon && (
          <item.icon
            className={cn(
              "h-5 w-5  text-gray-500",
              isPathActive(item.href!) && "text-white",
              collapsed && "text-white hover:text-[#152444]"
            )}
          />
        )}

        {!isMobile ? (
          <span
            className={cn(
              "text-sm ml-2 ",
              isPathActive(item.href!) && "font-semibold",
              collapsed
            )}
          >
            {item.title}
          </span>
        ) : (
          !collapsed && (
            <span
              className={cn(
                "text-sm ml-2  text-white",
                isPathActive(item.href!) && "font-semibold",
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

function ChildNavItem({
  item,
  isActive,
}: {
  item: NavChild;
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center px-3 py-2 text-sm hover:bg-darkblue/20 rounded-md transition-colors",
        isActive && "bg-darkblue text-white hover:bg-darkblue"
      )}
    >
      <item.icon
        className={cn("h-4 w-4 mr-2 text-gray-500", isActive && "text-white")}
      />
      <span>{item.title}</span>
    </Link>
  );
}
