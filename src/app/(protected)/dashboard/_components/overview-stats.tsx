import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

export default function OverviewStats() {
  return (
    <>
      <div className="flex flex-wrap gap-4 items-center justify-between -mb-4">
        <div className="text-2xl font-medium text-default-800">Overview</div>
        {/* <DatePickerWithRange /> */}
      </div>
      <Card className="">
        <CardContent className="p-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Stats1 />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

const Stats1 = () => {
  const data = [
    {
      text: "Total Parishioners",
      total: "3,555",
      color: "primary",
      icon: <Users className="w-3.5 h-3.5" />,
    },
    {
      text: "Male",
      total: "536",
      color: "warning",
      icon: <Users className="w-3.5 h-3.5" />,
    },
    {
      text: "Female",
      total: "899",
      color: "success",
      icon: <Users className="w-3.5 h-3.5" />,
    },
    {
      text: "Belong to no Society",
      total: "332",
      color: "destructive",
      icon: <Users className="w-3.5 h-3.5" />,
    },
  ];

  const getIconStyles = (color: string) => {
    const styles = {
      primary: "border-sky-500 bg-sky-500",
      warning: "border-orange-500 bg-orange-500",
      success: "border-green-500 bg-green-500",
      destructive: "border-red-500 bg-red-500",
    };
    return styles[color as keyof typeof styles] || styles.primary;
  };

  return (
    <>
      {data.map((item, index) => (
        <div
          key={`reports-state-${index}`}
          className={cn(
            "border rounded-md flex flex-col gap-1.5 p-4  overflow-hidden items-start relative before:absolute before:left-1/2 before:-translate-x-1/2 before:bottom-1 before:h-[2px] before:w-9 before:bg-primary/50 dark:before:bg-primary-foreground before:hidden",
            {
              "bg-sky-50 dark:bg-sky-500": item.color === "primary",
              "bg-orange-50 dark:bg-orange-500": item.color === "warning",
              "bg-green-50 dark:bg-green-500": item.color === "success",
              "bg-red-50 dark:bg-red-500": item.color === "destructive",
            }
          )}
        >
          <span
            className={cn(
              "h-[95px] w-[95px] rounded-full absolute -top-8 -right-8 ring-[20px]",
              {
                "bg-sky-200 ring-sky-100 dark:bg-sky-300 dark:ring-sky-400":
                  item.color === "primary",
                "bg-orange-200 ring-orange-100 dark:bg-orange-300 dark:ring-orange-400":
                  item.color === "warning",
                "bg-green-200 ring-green-100 dark:bg-green-300 dark:ring-green-400":
                  item.color === "success",
                "bg-red-200 ring-red-100 dark:bg-red-300 dark:ring-red-400":
                  item.color === "destructive",
              }
            )}
          />
          <div
            className={cn(
              "w-8 h-8 grid place-content-center rounded-full border border-dashed",
              getIconStyles(item.color)
            )}
          >
            <span
              className={cn(
                "h-6 w-6 rounded-full grid place-content-center text-white",
                {
                  "dark:bg-[#EFF3FF]/30": item.color === "primary",
                  "dark:bg-[#FFF7ED]/30": item.color === "warning",
                  "dark:bg-[#ECFDF4]/30": item.color === "success",
                  "dark:bg-[#FEF2F2]/30": item.color === "destructive",
                }
              )}
            >
              {item.icon}
            </span>
          </div>
          <span className="mt-3 text-sm  dark:text-primary-foreground font-medium  relative z-10">
            {item.text}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold text-default-900 dark:text-primary-foreground">
              {item.total}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};
