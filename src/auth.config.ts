import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const email: string = credentials.email as string;
          const password: string = credentials.password as string;

          const response = await fetch(
            "http://13.60.62.124:8000/api/v1/auth/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
              },
              body: new URLSearchParams({
                grant_type: "password",
                username: email,
                password: password,
                client_id: "string",
                client_secret: "string",
              }).toString(),
            }
          );

          console.log("----------heheheh------------------------");
          // Log the full response details for debugging
          console.log({
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
          });

          // Get the response text first
          const responseText = await response.text();
          console.log("Responseeee", response);
          console.log("Response text:", responseText);

          // Example authentication logic
          // In production, replace this with actual database lookup
          //   if (email === "user@example.com" && password === "password") {
          //     return {
          //       id: "1",
          //       email: email,
          //       name: "John Doe",
          //       full_name: "John Doe",
          //       role: "super_admin",
          //       is_active: true,
          //       accessToken: "example-access-token",
          //     };
          //   }
        } catch (error) {
          console.error("Authorization error:", error);
          const message =
            error instanceof Error ? error.message : "Authentication failed";
          throw new Error(message);
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
