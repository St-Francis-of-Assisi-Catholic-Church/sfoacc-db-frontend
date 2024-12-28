"use server";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

interface ISignInData {
  email: string;
  password: string;
}

const handleSignInWithEmail = async (
  data: ISignInData,
  callbackUrl?: string | null
) => {
  // TODO validate data

  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
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

export { handleSignInWithEmail };
