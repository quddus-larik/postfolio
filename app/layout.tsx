import type { Metadata } from "next";
import { Google_Sans_Flex, Google_Sans_Code, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Google_Sans_Flex({
  variable: "--font-google-flex",
  subsets: ["latin"],
  preload: true
});

const geistMono = JetBrains_Mono({
  variable: "--font-jetbain-mono",
  subsets: ["latin"],
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  title: "Postfolio",
  description: "A light weight SSG blogs generator for developers portfolio that support local .md and dev.to API blogs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">{children}</body>
    </html>
  );
}
