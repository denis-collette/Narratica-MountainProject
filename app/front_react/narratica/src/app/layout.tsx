import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "../components/NavBar";
import Footer from "@/components/Footer";
import "./globals.css";
import { AudioProvider } from "@/components/audio/AudioContext";
import { SearchProvider } from "@/components/SearchContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Narratica",
  description: "The premier choice for audiobook streaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <SearchProvider>
          <AudioProvider>
            <NavBar />
            {children}
            <Footer />
          </AudioProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
