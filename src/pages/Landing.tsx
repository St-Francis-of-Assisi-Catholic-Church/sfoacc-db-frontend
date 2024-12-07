import { useEffect } from "react";
import { setPageTitle } from "../utils/seo";

export function Landing() {
  useEffect(() => {
    setPageTitle("Welcome");
  }, []);

  return (
    <div className="border">
      <h1>Welcome to Our Church</h1>
    </div>
  );
}
