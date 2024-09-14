import type { Metadata } from "next";
import "./globals.css";
import MainLeftSidebar from "../components/Sidebar/MainLeftSidebar";
import { MobileDetectionProvider } from "../components/_common/MobileDetectionProvider";
import { AuthProvider } from "@/components/_common/AuthProvider";
import { NotificationProvider } from "@/components/_common/Notification";
import { GlobalContextProvider } from "@/components/_common/GlobalContextProvider";

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
    <GlobalContextProvider>
      <AuthProvider>
        <MobileDetectionProvider>
          <html lang="en">
            <NotificationProvider>
              <body className="h-screen">
                <div className="min-h-screen bg-gray-100">
                  <MainLeftSidebar />
                  <main className="md:pl-72 lg:pl-80">{children}</main>
                </div>
              </body>
            </NotificationProvider>
          </html>
        </MobileDetectionProvider>
      </AuthProvider>
    </GlobalContextProvider>
  );
}
