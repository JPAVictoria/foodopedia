"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { SnackbarProvider } from "@/app/context/SnackbarContext";
import { NavbarProvider } from "@/app/context/NavbarContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create a single instance of QueryClient for the app
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 3, // Will retry failed requests 3 times before displaying an error
      },
    },
  }));

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen`}>
        {/* Wrap with QueryClientProvider first */}
        <QueryClientProvider client={queryClient}>
          {/* Then wrap with your existing providers */}
          <SnackbarProvider>
            <NavbarProvider>
              {children}
            </NavbarProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}