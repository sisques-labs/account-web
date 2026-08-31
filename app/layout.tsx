import type { Metadata, Viewport } from "next";
import { Newsreader, DM_Sans, Caveat, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/shared/presentation/providers/providers";
import { Toaster } from "@/shared/presentation/components/ui/toaster/toaster";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Next.js DDD Template",
  description: "Sisques Labs Next.js frontend template — DDD + Hexagonal (Screaming Architecture)",
};

export const viewport: Viewport = {
  themeColor: "#2f5138",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${dmSans.variable} ${caveat.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
