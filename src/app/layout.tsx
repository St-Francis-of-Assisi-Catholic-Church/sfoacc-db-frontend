import { Geist, Geist_Mono } from "next/font/google";
import { Toaster as SonnerToaster } from "sonner";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SessionProvider session={session}>
            <SonnerToaster
              expand={false}
              position="top-right"
              richColors
              closeButton
            />
            {children}
          </SessionProvider>
        </body>
      </html>
    </>
  );
}
