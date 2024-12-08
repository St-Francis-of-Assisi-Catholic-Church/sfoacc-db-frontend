import { useEffect } from "react";
import { setPageTitle } from "../../utils/seo";

function Card() {
  return (
    <div
      className="w-full border bg-white px-2 py-3 flex flex-col items-center justify-between
        "
    >
      <h1 className="text-xl font-bold">309555</h1>
      <p>Total Registered Users</p>
    </div>
  );
}

export function Dashboard() {
  useEffect(() => {
    setPageTitle("Dashboard");
  }, []);

  return (
    <div className="">
      <h1 className="text-lg font-semibold text-muted-foreground">
        Dashboard Overview
      </h1>

      <div className="mt-3 flex gap-6">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}
