import { useEffect } from "react";
import { setPageTitle } from "../utils/seo";

export const NotFound = () => {
  useEffect(() => {
    setPageTitle("404 - Page not Found");
  }, []);

  return (
    <div className="error-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" className="btn primary">
        Return Home
      </a>
    </div>
  );
};
