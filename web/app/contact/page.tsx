import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/shared/SiteFooter";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach EV Charge Savings with questions, corrections, or data issues.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <main className="bg-paper min-h-screen">
        <div className="section-wrap py-16 max-w-xl">
          <Link href="/" className="font-mono text-xs text-ink-mute hover:text-forest mb-8 inline-block">← evchargesavings.com</Link>

          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Contact</div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-ink mb-4">Get in touch</h1>
          <p className="text-ink-2 leading-relaxed mb-10">
            We read every email. Response time is usually within 48 hours on weekdays.
          </p>

          <div className="space-y-6 mb-12">
            {[
              {
                heading: "Data corrections",
                detail: "If you spot a rate, efficiency figure, or vehicle spec that looks wrong, please send the source URL along with the correction. We update data when we can confirm it.",
              },
              {
                heading: "Installer partnerships",
                detail: "We connect homeowners with licensed electricians for Level 2 charger installation. If you're an electrician interested in receiving leads, reach out and include your license number and service area.",
              },
              {
                heading: "Press and media",
                detail: "For data licensing, media inquiries, or interview requests about EV adoption and charging costs, email us directly.",
              },
              {
                heading: "Privacy and data deletion",
                detail: "To remove your email and ZIP from our database, email us with the subject \"Delete my data\". We'll process it within 7 business days.",
              },
            ].map((item) => (
              <div key={item.heading} className="border border-line rounded-2xl p-6 bg-paper">
                <div className="font-serif text-lg font-medium text-ink mb-2">{item.heading}</div>
                <p className="text-sm text-ink-2 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="bg-ink text-cream rounded-2xl p-8">
            <div className="font-mono text-[10px] uppercase tracking-widest text-gold mb-3">Email us</div>
            <a
              href="mailto:hello@evchargesavings.com"
              className="font-serif text-2xl font-medium text-cream hover:text-gold transition-colors"
            >
              hello@evchargesavings.com
            </a>
            <p className="text-cream/50 text-sm mt-3">
              EV Charge Savings · Independent EV cost analysis
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
