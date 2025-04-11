import { Inter } from "next/font/google";
import "./globals.css";
import { SnackbarProvider } from "@/app/context/SnackbarContext"; // Adjust the path if needed
import { NavbarProvider } from "@/app/context/NavbarContext"; // Import your context

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
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen`}>
        <SnackbarProvider>
          <NavbarProvider>
            {children}
          </NavbarProvider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
