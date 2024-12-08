import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <div className="mt-4 text-gray-600">
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-lg">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="min-w-[200px] gap-2"
          >
            {/* Back Arrow SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Go Back
          </Button>

          <Button onClick={() => navigate("/")} className="min-w-[200px] gap-2">
            {/* Home SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Return Home
          </Button>
        </div>

        <div className="mt-12 text-gray-500">
          <p>
            If you think this is a mistake, please{" "}
            <button
              onClick={() => navigate("/contact")}
              className="text-primary hover:underline focus:outline-none"
            >
              contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
