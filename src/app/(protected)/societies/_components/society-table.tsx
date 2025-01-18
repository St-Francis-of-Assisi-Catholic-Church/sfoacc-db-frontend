"use client";
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import societiesData from "./societies.json";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";

export interface ISociety {
  id: number;
  name: string;
  description?: string;
  meetingTime?: string;
  meetingSchedule?: string;
  meetingVenue?: string;
  created_at: string;
  updated_at: string;
}

export function SocietyCard({ society }: { society: ISociety }) {
  // Create URL-friendly slug from society name
  const slug = society.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  //  router.push(`/societies/${society.id}-${slug}`);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full rounded-xl">
      <CardContent className="p-5 md:p-6 h-full">
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-primary mb-3">
              {society.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {society.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href={`/societies/${society.id}-${slug}`}>
              <Button className="w-full">View Society Details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SocietiesGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  const filteredSocieties = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return societiesData.societies.filter(
      (society) =>
        society.name.toLowerCase().includes(query) ||
        (society.description?.toLowerCase() || "").includes(query)
    );
  }, [searchQuery]);

  const displayedSocieties = useMemo(() => {
    return filteredSocieties.slice(0, displayCount);
  }, [filteredSocieties, displayCount]);

  const hasMore = displayedSocieties.length < filteredSocieties.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayCount((prev) => prev + 6);
      setIsLoading(false);
    }, 1000);
  }, [hasMore, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  // Reset display count when search query changes
  useEffect(() => {
    setDisplayCount(6);
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col justify-between gap-4">
      <div className="w-full flex justify-between">
        <div className="w-full md:w-96">
          <Input
            type="search"
            className="pl-9 w-full"
            placeholder="Search societies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefixx={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <div className="overflow-auto h-full pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedSocieties.map((society) => (
            <SocietyCard key={society.id} society={society} />
          ))}
        </div>

        {displayedSocieties.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No societies found matching your search.
          </div>
        )}

        {hasMore && (
          <div ref={loaderRef} className="w-full flex justify-center py-8">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more societies...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SocietiesGrid;
