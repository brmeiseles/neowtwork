import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neowtwork Achievements",
  description: "A dark fantasy achievement board for Neowtwork.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
