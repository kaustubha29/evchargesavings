import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EV Charge Savings — How Much Will You Save Going Electric?",
    template: "%s | EV Charge Savings",
  },
  description:
    "See exactly how much an EV would save you in your zip code. Real 2026 electricity and gas rates for all 50 US states, 130+ EV models, free forever.",
  metadataBase: new URL("https://evchargesavings.com"),
  openGraph: {
    type: "website",
    siteName: "EV Charge Savings",
    url: "https://evchargesavings.com",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
