import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./(website)/_components/footer";
import Navbar from "./(website)/_components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manage Your Business With Busieness.com ",
  description: `Manage and tranform your business operations with ${<span className="text-2xl font-semibold">Business.com</span>}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <div className="mb-24"><Navbar/></div>
        {children}
        <div className="mt-24"><Footer/></div>
      </body>
    </html>
  );
}
