import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";
//import { cn } from "@/lib/utils";
import { ReactQueryClientProvider } from "@/components/reactQuery-ClientProvider";
import { ThemeProvider } from "@/components/Theme-Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Manage Your Business With GrowEazie.com ",
  description: `All in one ERP to grow your business with ${<span className="text-2xl font-semibold">GrowEazie.com</span>}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter} antialiased`}
      >
       <ThemeProvider
        attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
       >
        {children}
       </ThemeProvider>
        
      </body>
    </html>
    </ReactQueryClientProvider>
  );
}
