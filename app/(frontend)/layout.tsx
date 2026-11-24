import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@/components/Analytics";

// Fonts are self-hosted from app/fonts (OFL-licensed files from Fontsource)
// instead of next/font/google, so production builds never depend on
// downloading from Google Fonts at build time.

const interTight = localFont({
  variable: "--font-inter-tight",
  src: "./fonts/inter-tight-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
});

const instrumentSerif = localFont({
  variable: "--font-instrument-serif",
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  display: "swap",
});

const fraunces = localFont({
  variable: "--font-fraunces",
  src: [
    { path: "./fonts/fraunces-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/fraunces-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  display: "swap",
});

const jetbrainsMono = localFont({
  variable: "--font-jetbrains-mono",
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wirelessindia.example"),
  title: {
    default: "Wireless India — Components, Audio & Accessories · Theni",
    template: "%s — Wireless India",
  },
  description:
    "Electronics shop in Theni. Sound bars, Bluetooth speakers, multimeters, ICs, cables, pendrives and more. Walk in or WhatsApp +91 98658 11796.",
  openGraph: {
    title: "Wireless India — Electronics, Theni",
    description:
      "Components, audio & accessories under one roof in Theni, Tamil Nadu.",
    type: "website",
  },
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrumentSerif.variable} ${fraunces.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
