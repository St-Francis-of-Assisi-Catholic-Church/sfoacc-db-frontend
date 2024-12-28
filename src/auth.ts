import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  events: {},

  callbacks: {
    async signIn({}) {
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.accessToken = token.accessToken as string;
        session.user.role = token.role as string;
        session.user.full_name = token.full_name as string;
        session.user.is_active = token.is_active as boolean;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.full_name = user.full_name;
        token.is_active = user.is_active;
      }
      return token;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  //   debug: process.env.NODE_ENV === "development",
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});
