import { useEffect } from "react";
import { setPageTitle } from "../utils/seo";

export function Dashboard() {
  useEffect(() => {
    setPageTitle("Dashboard");
  }, []);

  return (
    <div>
      <h1>Dashboard Page</h1>
    </div>
  );
}
