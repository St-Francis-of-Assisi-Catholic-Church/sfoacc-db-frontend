import { useEffect } from "react";
import { setPageTitle } from "../utils/seo";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export function Landing() {
  useEffect(() => {
    setPageTitle("Welcome");
  }, []);

  return (
    <div className="border border-purple-500 h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-lg">Welcome to Our Church</h1>

      <Button isLoading={false} variant={"outline"} className="">
        <Link to={"/auth/login"}>Log in</Link>
      </Button>
    </div>
  );
}
