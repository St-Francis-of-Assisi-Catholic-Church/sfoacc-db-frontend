"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

interface ISignInData {
  email: string;
  password: string;
}

const handleSignInWithEmail = async (
  data: ISignInData,
  callbackUrl?: string | null
) => {
  console.log("cl", callbackUrl);
  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      return {
        error: "Invalid credentials",
        success: false,
      };
    }

    // Return success without redirect URL - we'll handle it client-side
    return {
      success: true,
    };
  } catch (error) {
    console.error("Authentication error:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          return {
            error: error.cause?.err?.message || "Callback route error",
            success: false,
          };
        case "CredentialsSignin":
          return {
            error: "Invalid credentials",
            success: false,
          };
        default:
          return {
            error: "Something went wrong!",
            success: false,
          };
      }
    }

    return {
      error: "An unexpected error occurred",
      success: false,
    };
  }
};

const handleSignInWithEmail2 = async (
  data: ISignInData,
  callbackUrl?: string | null
) => {
  // TODO validate data

  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      // redirect: false,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    console.log("authActions====>:", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          return { error: error.cause?.err?.message };
        case "CredentialsSignin":
          console.log("server error", error);
          return { error: `Invalid credentials! ==${error}` };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};

export { handleSignInWithEmail, handleSignInWithEmail2 };
