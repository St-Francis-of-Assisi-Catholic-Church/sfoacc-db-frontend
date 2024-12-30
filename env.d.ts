// env.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    AUTH_SECRET: string;
    API_URL: string;
    NEXT_PUBLIC_API_URL: string;
  }
}
