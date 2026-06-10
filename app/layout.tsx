import type { Metadata } from "next";
import { Kreon } from "next/font/google";
import { brandConfig } from "@/config/brand";
import "./globals.css";

const kreon = Kreon({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kreon",
});

export const metadata: Metadata = {
  title: brandConfig.metadataTitle,
  description: brandConfig.metadataDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={kreon.variable} lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
