import type { Metadata } from "next";
import "./globals.css";
import MainLeftSidebar from "../components/Sidebar/MainLeftSidebar";
import { MobileDetectionProvider } from "../components/_common/MobileDetectionProvider";

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
    <MobileDetectionProvider>
      <html lang="en">
        <body>
          <div className="min-h-screen bg-gray-100">
            <MainLeftSidebar />
            <main className="md:pl-72 lg:pl-80">{children}</main>
          </div>
        </body>
      </html>
    </MobileDetectionProvider>
  );
}
