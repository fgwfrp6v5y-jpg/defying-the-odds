import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Defying The Odds",
  description: "Guest applications, scheduling, and production tracking for Defying The Odds."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
