import { useEffect } from "react";
import { setPageTitle } from "../../utils/seo";

export function Members() {
  useEffect(() => {
    setPageTitle("Dashboard - Members");
  }, []);

  return (
    <div className="border">
      <h1>Members Page</h1>
    </div>
  );
}
