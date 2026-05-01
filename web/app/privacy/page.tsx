import type { Metadata } from "next";
import Link from "next/link";
import { SavingsSlotBand } from "@/components/shared/SavingsSlotBand";
import { SiteFooter } from "@/components/shared/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EV Charge Savings collects and uses data.",
};

export default function PrivacyPage() {
  return (
    <>
      <main className="bg-paper min-h-screen">
        <div className="section-wrap py-16 max-w-2xl">
          <Link href="/" className="font-mono text-xs text-ink-mute hover:text-forest mb-8 inline-block">← evchargesavings.com</Link>

          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Legal</div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-ink mb-2">Privacy Policy</h1>
          <p className="font-mono text-xs text-ink-mute mb-10">Last updated: May 1, 2026</p>

          <div className="space-y-8 text-ink-2 leading-relaxed">

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">What we collect</h2>
              <p>EV Charge Savings does not require an account. We collect data in two ways:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li><b className="text-ink">Calculator preferences</b> (EV model, gas car, mileage, rate settings) — stored only in your browser&apos;s <code className="font-mono bg-cream-soft px-1 rounded">localStorage</code>. Never sent to our servers.</li>
                <li><b className="text-ink">Email address and ZIP code</b> — only if you voluntarily submit the installer quote form. Stored securely in our database and used solely to match you with licensed electricians.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">Location detection</h2>
              <p>
                To show accurate electricity and gas rates, we optionally detect your approximate location
                using your IP address via <a href="https://ipapi.co" target="_blank" rel="noopener noreferrer" className="text-forest underline">ipapi.co</a>.
                This request is anonymous — we do not log or store your IP. The result is cached in your browser for 30 days.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">Analytics</h2>
              <p>
                We use Google Analytics to understand aggregate traffic (page views, popular EV models, state pages).
                Google Analytics may use cookies and your IP address (anonymised). You can opt out via the{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-forest underline">Google Analytics opt-out browser add-on</a>.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">Advertising</h2>
              <p>
                This site displays ads via Google AdSense. Google may use cookies or device identifiers to show
                relevant ads based on your browsing history. You can opt out via{" "}
                <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-forest underline">
                  aboutads.info
                </a>{" "}or your browser&apos;s privacy settings.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">Affiliate links</h2>
              <p>
                Some product and service links are affiliate links (Amazon Associates, Impact, CJ Affiliate).
                If you click and make a purchase or request a quote, we may earn a commission at no extra cost to you.
                Third-party sites you visit through these links have their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">Third-party services</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><b className="text-ink">Supabase</b> — installer lead data is stored in a Supabase database (US region). Retained for up to 24 months.</li>
                <li><b className="text-ink">Resend</b> — used to send transactional confirmation emails when you submit the quote form.</li>
                <li><b className="text-ink">Google AdSense / Analytics</b> — see <a href="https://policies.google.com/privacy" className="text-forest underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.</li>
                <li><b className="text-ink">Amazon Associates</b> — see <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496" className="text-forest underline" target="_blank" rel="noopener noreferrer">Amazon Privacy Notice</a>.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">Data deletion</h2>
              <p>
                To remove your email and ZIP from our database, email{" "}
                <a href="mailto:hello@evchargesavings.com" className="text-forest underline">hello@evchargesavings.com</a>{" "}
                with the subject <em>"Delete my data"</em>. We will remove your record within 7 days.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">Children</h2>
              <p>This site is not directed at children under 13. We do not knowingly collect information from anyone under 13.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">Changes</h2>
              <p>We may update this policy periodically. The date at the top reflects the last revision. Continued use constitutes acceptance.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-ink mb-3">Contact</h2>
              <p>Questions? <a href="mailto:hello@evchargesavings.com" className="text-forest underline">hello@evchargesavings.com</a></p>
            </section>

          </div>
        </div>
        <SavingsSlotBand
          eyebrow="Back to the calculator"
          title="Your savings estimate stays private in your browser"
          body="The slot shows example EV savings, while your own calculator inputs stay local unless you choose to submit a quote request."
        />
      </main>
      <SiteFooter />
    </>
  );
}
