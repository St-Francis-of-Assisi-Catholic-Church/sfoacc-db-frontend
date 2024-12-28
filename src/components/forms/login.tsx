"use client";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ErrorAlert } from "../ui/errorAlert";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { handleSignInWithEmail } from "@/lib/actions/auth/handleSignin";
import { toast } from "sonner";

interface LoginFormData {
  email: string; // Changed from username to email to match the server action
  password: string;
}

export default function LoginForm() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [formData, setFormData] = useState<LoginFormData>({
    email: "", // Changed from username to email
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await handleSignInWithEmail(
        {
          email: formData.email,
          password: formData.password,
        },
        callbackUrl
      );

      if (response?.error) {
        setError(response.error);
        toast.error(response.error);
        return;
      }

      // No need to manually redirect as NextAuth will handle the redirect
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      toast.error(`An unexpected error occurred. Please try again. ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
      <div className="my-2 hidden xl:block">
        <h1 className="font-semibold">Welcome back,</h1>
        <p>Please sign in below to continue</p>
      </div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div>
        <label htmlFor="email" className="font-medium text-default-600">
          Email
        </label>
        <Input
          id="email"
          name="email"
          className="mt-2"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          aria-label="Email address"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="font-medium text-default-600">
          Password
        </label>
        <Input
          id="password"
          name="password"
          className="mt-2"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          aria-label="Password"
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex-1 flex items-center gap-1.5">
          <div className="flex justify-center items-center">
            <input
              id="rememberMe"
              type="checkbox"
              className="border-default-300 mt-[1px] cursor-pointer"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-default-600 cursor-pointer whitespace-nowrap ml-1.5"
            >
              Remember me
            </label>
          </div>
        </div>
        <Link
          href="/auth/forgot"
          className="flex-none text-sm text-primary hover:underline"
          tabIndex={isLoading ? -1 : 0}
        >
          Forget Password?
        </Link>
      </div>

      <Button
        type="submit"
        className="mt-4"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Sign In
      </Button>
    </form>
  );
}
