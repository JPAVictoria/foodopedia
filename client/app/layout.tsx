import { Inter } from "next/font/google";
import "./globals.css";
import { SnackbarProvider } from "@/components/snackbar";  // Update this to the actual path of your SnackbarProvider

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
      <body className={`${inter.variable} antialiased`}>
        {/* Wrap children with SnackbarProvider to make snackbar functionality global */}
        <SnackbarProvider>
          {children}
        </SnackbarProvider>
      </body>
    </html>
  );
}
