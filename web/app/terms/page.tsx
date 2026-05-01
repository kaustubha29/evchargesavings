import type { Metadata } from "next";
import Link from "next/link";
import { SavingsSlotBand } from "@/components/shared/SavingsSlotBand";
import { SiteFooter } from "@/components/shared/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing your use of EV Charge Savings.",
};

export default function TermsPage() {
  return (
    <>
      <main className="bg-paper min-h-screen">
        <div className="section-wrap py-16 max-w-2xl">
          <Link href="/" className="font-mono text-xs text-ink-mute hover:text-forest mb-8 inline-block">← evchargesavings.com</Link>

          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Legal</div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-ink mb-2">Terms of Use</h1>
          <p className="font-mono text-xs text-ink-mute mb-10">Last updated: May 1, 2026</p>

          <div className="space-y-8 text-ink-2 leading-relaxed">

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">1. Acceptance</h2>
              <p>
                By using EV Charge Savings (&ldquo;the Site&rdquo;), you agree to these Terms of Use. If you do not agree, please do not use the Site.
                The Site is operated by EV Charge Savings (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;).
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">2. Calculator estimates</h2>
              <p>
                The savings calculations on this Site are <b className="text-ink">estimates only</b>. They are based on publicly available
                data (US EIA electricity rates, AAA gas prices, EPA efficiency ratings) and the inputs you provide.
                Actual savings will vary based on your driving habits, local utility rates, charging behaviour,
                vehicle condition, and other factors. Nothing on this Site constitutes financial, legal, or
                purchasing advice.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">3. Affiliate and advertising disclosure</h2>
              <p>
                This Site participates in affiliate programs including Amazon Associates, Impact, and CJ Affiliate.
                Product links marked with &ldquo;Amazon →&rdquo; or similar are affiliate links — we may earn a commission
                if you make a purchase. This never affects the accuracy of our calculator or the editorial integrity
                of our guides. Advertisements are served by Google AdSense.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">4. Installer quote requests</h2>
              <p>
                When you submit your email and ZIP code requesting installer quotes, you agree to be contacted
                by up to three licensed electricians in your area. We do not guarantee the quality, pricing,
                or availability of any installer. We are not a party to any agreement between you and an installer.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">5. Intellectual property</h2>
              <p>
                All content on this Site — including text, design, code, and data compilations — is owned by
                EV Charge Savings or its licensors. You may not reproduce, distribute, or create derivative works
                without written permission.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">6. Disclaimer of warranties</h2>
              <p>
                The Site is provided &ldquo;as is&rdquo; without warranties of any kind. We do not warrant that the Site
                will be uninterrupted, error-free, or that the data is complete or current. Rate data is updated
                periodically but may not reflect real-time prices.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">7. Limitation of liability</h2>
              <p>
                To the maximum extent permitted by law, EV Charge Savings shall not be liable for any indirect,
                incidental, or consequential damages arising from your use of the Site or reliance on its content.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">8. Governing law</h2>
              <p>These Terms are governed by the laws of the United States. Disputes shall be resolved in a court of competent jurisdiction.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">9. Contact</h2>
              <p><a href="mailto:hello@evchargesavings.com" className="text-forest underline">hello@evchargesavings.com</a></p>
            </section>

          </div>
        </div>
        <SavingsSlotBand
          eyebrow="Back to the calculator"
          title="Estimate first, decide with context"
          body="The examples are illustrative, and your final savings depend on your rates, vehicle, mileage, and charging habits."
        />
      </main>
      <SiteFooter />
    </>
  );
}
