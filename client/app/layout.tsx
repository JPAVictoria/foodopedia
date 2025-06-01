import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { SnackbarProvider } from "@/app/context/SnackbarContext";
import { NavbarProvider } from "@/app/context/NavbarContext";
import { LoadingProvider } from "@/app/context/LoaderContext";
import ReactQueryProvider from "@/app/providers/ReactQueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Foodopedia",
  description: "A site where all of your needed recipes are in one place. Log in or register for free along without thousands of users across the world and enjoy free access to recipes that came from around the globe.",
  authors: [{ name: "Andre Victoria", url: "https://andre-victoria.vercel.app" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
  themeColor: "#ffffff",
  openGraph: {
    title: "Foodopedia",
    description: "A modern CMS web application powered by Next.js",
    url: "https://yourapp.com",
    siteName: "Foodopedia",
    images: [
      {
        url: "https://yourapp.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "My App",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen`}>
        <LoadingProvider>
          <SnackbarProvider>
            <NavbarProvider>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </NavbarProvider>
          </SnackbarProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
