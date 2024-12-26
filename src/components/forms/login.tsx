// LoginForm.tsx
"use client";

import Link from "next/link";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { ApiSimulator } from "@/lib/utils";
import { ErrorAlert } from "../ui/errorAlert";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
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
      const data = await ApiSimulator(true, 2000);
      console.log("data", formData, data);
      router.push("/dashboard");
    } catch (error) {
      console.log("er", error);
      setError(
        "Failed to sign in. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="my-2 hidden xl:block">
        <h1 className="font-semibold">Welcome back,</h1>
        <p>Please sign in below to continue</p>
      </div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div>
        <label htmlFor="username" className="font-medium text-default-600">
          Email
        </label>
        <Input
          id="username"
          name="username"
          className="mt-2"
          type="email"
          value={formData.username}
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
