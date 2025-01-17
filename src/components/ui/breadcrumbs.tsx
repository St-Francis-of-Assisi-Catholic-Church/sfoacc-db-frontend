/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = segment.replace(/-/g, " ");
    const isLast = index === pathSegments.length - 1;

    // Capitalize and format the label
    const formattedLabel = label
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return { href, label: formattedLabel, isLast };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm md:text-md mt-1 mb-4">
      <Link
        href="/"
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="h-5 w-5 " />
      </Link>

      {breadcrumbItems.map((item, _index) => (
        <React.Fragment key={item.href}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.isLast ? (
            <span className="font-medium text-primary">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-primary transition-colors hover:underline "
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
