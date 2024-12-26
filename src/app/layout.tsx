import { Geist, Geist_Mono } from "next/font/google";
import { Toaster as SonnerToaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        spellCheck
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SonnerToaster
          expand={false}
          position="top-right"
          richColors
          closeButton
        />
        {children}
      </body>
    </html>
  );
}
