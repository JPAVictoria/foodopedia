"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { SnackbarProvider } from "@/app/context/SnackbarContext";
import { NavbarProvider } from "@/app/context/NavbarContext";
import { LoadingProvider } from "@/app/context/LoaderContext";
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
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, 
        retry: 3, 
      },
    },
  }));

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen`}>
        <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <SnackbarProvider>
            <NavbarProvider>
              {children}
            </NavbarProvider>
          </SnackbarProvider>
          </LoadingProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}