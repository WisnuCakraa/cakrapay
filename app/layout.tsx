import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Sidebar } from "@/components/common/Sidebar";
import { Topbar } from "@/components/common/Topbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FINTECH ABYSS | Command Center",
  description: "Advanced financial dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground overflow-hidden`}
      >
        <Providers>
          <div className="flex h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
              <Topbar />
              <main className="flex-1 overflow-y-auto p-8 bg-background scroll-smooth">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
