import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      full_name?: string;
      is_active?: boolean;
      status: string;
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    full_name: string;
    is_active: boolean;
    status: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: string;
    accessToken: string;
    role: string;
    full_name: string;
    is_active: boolean;
    status: string;
  }
}
