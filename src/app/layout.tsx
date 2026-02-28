import type { Metadata, Viewport } from "next";
import { DM_Mono, Sora } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Metronome — Precision Tempo for Musicians",
  description:
    "A modern, accurate online metronome built with Web Audio API. Simple, precise, and beautiful tempo control for practice and performance.",
  keywords: [
    "metronome",
    "online metronome",
    "music",
    "tempo",
    "bpm",
    "practice",
    "musician",
    "beat",
    "rhythm",
  ],
  openGraph: {
    title: "Metronome — Precision Tempo for Musicians",
    description:
      "A modern, accurate online metronome. Simple, precise, and beautiful.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a1408",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${dmMono.variable} antialiased`}>
        <TooltipProvider delayDuration={400}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
