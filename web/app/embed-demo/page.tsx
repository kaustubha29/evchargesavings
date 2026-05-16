import type { Metadata } from "next";
import { getAllStates } from "@/features/location/queries";
import { EmbedDemoClient } from "@/components/shared/EmbedDemoClient";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { StickySavingsBar } from "@/components/shared/StickySavingsBar";

export const metadata: Metadata = {
  title: "Embed the EV Savings Calculator — Partner Demo | EVChargeSavings",
  description: "Free embeddable EV savings calculator for utility sites, EV blogs, and dealership pages. Pre-load any US state. No API key required.",
  alternates: { canonical: "/embed-demo" },
};

export default function EmbedDemoPage() {
  const states = getAllStates().map((s) => ({ name: s.name, slug: s.slug }));
  return (
    <>
      <StickySavingsBar />
      <EmbedDemoClient states={states} />
      <SiteFooter />
    </>
  );
}
