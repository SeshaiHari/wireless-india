import type { Metadata } from "next";
import {
  Inter_Tight,
  Instrument_Serif,
  Fraunces,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      <body>{children}</body>
    </html>
  );
}
