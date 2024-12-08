import { useEffect } from "react";
import { setPageTitle } from "../../utils/seo";

export function Societies() {
  useEffect(() => {
    setPageTitle("Societies - Societies");
  }, []);

  return (
    <div className="border">
      <h1>Societies Page</h1>
    </div>
  );
}
