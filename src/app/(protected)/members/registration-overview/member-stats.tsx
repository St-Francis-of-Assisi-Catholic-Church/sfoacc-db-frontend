"use client";
import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Building2,
  TrendingUp,
  Fingerprint,
  AlertCircle,
  LucideIcon,
  UserRoundX,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import membershipStatsData from "./membership-stats.json";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Create an icon mapping object
const IconMap: Record<string, LucideIcon> = {
  Users,
  UserCheck,
  UserX,
  Clock,
  Building2,
  TrendingUp,
  Fingerprint,
  AlertCircle,
  UserRoundX,
  ShieldAlert,
};

interface StatsCardProps extends MembershipStats {
  isLoading?: boolean;
}

interface MembershipStats {
  id: string;
  title: string;
  value: number;
  icon: string;
  subtitle?: string;
}

interface StatsData {
  membershipStats: MembershipStats[];
  lastUpdated: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  subtitle,
  isLoading,
}: StatsCardProps) => {
  const Icon = IconMap[icon];
  const bgColor = title.includes("Pending") ? "bg-red-700" : "bg-green-600";
  const textColor = "text-white";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline">
              <h2
                className={cn(
                  "text-3xl font-semibold",
                  isLoading && "animate-pulse"
                )}
              >
                {isLoading
                  ? "..."
                  : typeof value === "number"
                  ? value.toLocaleString()
                  : value}
              </h2>
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {isLoading ? "..." : subtitle}
              </p>
            )}
          </div>
          <div className={`p-2 rounded-lg ${bgColor}`}>
            {Icon && <Icon className={`w-5 h-5 ${textColor}`} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Simulated API call
const fetchMembershipStats = async (): Promise<StatsData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate random fluctuations in the data
  const randomizedStats = membershipStatsData.membershipStats.map((stat) => ({
    ...stat,
    value:
      typeof stat.value === "number"
        ? Math.floor(stat.value * (0.95 + Math.random() * 0.1))
        : stat.value,
  }));

  return {
    membershipStats: randomizedStats,
    lastUpdated: new Date().toISOString(),
  };
};

export default function MemberStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState<StatsData>(membershipStatsData);
  const isMobile = useMediaQuery("(min-width: 768px)");

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await fetchMembershipStats();
      setStatsData(data);
      toast.success("Data fetched successfully");
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="h-full flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between ">
        <h1 className="text-lg md:text-xl font-bold">
          Membership Registration Overview
        </h1>

        <div className="flex flex-col items-center md:items-end gap-1">
          <Button
            size="sm"
            className="flex items-center gap-2 h-8 bg-green-700 text-white hover:bg-green-800 hover:text-white"
            onClick={fetchStats}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            {isMobile && "Refresh"}
          </Button>
          {isMobile && (
            <p className="text-sm text-muted-foreground">
              Last updated:{" "}
              {new Date(statsData.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="h-full overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.membershipStats.map((stat) => (
            <StatsCard
              key={stat.id}
              id={stat.id}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              subtitle={stat.subtitle}
              isLoading={isLoading}
            />
          ))}

          <div>
            {!isMobile && (
              <p className="text-sm text-muted-foreground">
                Last updated:{" "}
                {new Date(statsData.lastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
