import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "CapyCharacter",
  description: "Talk with your favorite characters!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="pt-4 px-4 md:pl-72 lg:pl-80">
          {children}
        </main>
      </div>
      </body>
    </html>
  );
}
