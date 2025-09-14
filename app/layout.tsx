import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Next.js + MongoDB + Better Auth",
  description: "Use MongoDB with Next.js and Better Auth for authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
