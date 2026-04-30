import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EV Charge Savings collects and uses data.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-paper min-h-screen">
      <div className="section-wrap py-16 max-w-2xl">
        <Link href="/" className="font-mono text-xs text-ink-mute hover:text-forest mb-8 inline-block">← evchargesavings.com</Link>

        <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Legal</div>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-ink mb-2">Privacy Policy</h1>
        <p className="font-mono text-xs text-ink-mute mb-10">Last updated: April 2026</p>

        <div className="space-y-8 text-ink-2 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-medium text-ink mb-3">What we collect</h2>
            <p>
              EV Charge Savings does not require you to create an account or provide personal information.
              We store your calculator preferences (EV model, gas car, mileage, home charging split) locally
              in your browser&apos;s <code className="font-mono text-sm bg-cream-soft px-1.5 py-0.5 rounded">localStorage</code> only.
              This data never leaves your device and is not sent to our servers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-ink mb-3">Location detection</h2>
            <p>
              To show you accurate electricity and gas rates, we optionally detect your approximate location
              using your IP address via <a href="https://ipapi.co" target="_blank" rel="noopener noreferrer" className="text-forest underline">ipapi.co</a>.
              This is a one-time request made anonymously; we do not store or log your IP address or location.
              The result is cached in your browser for 30 days to avoid repeat lookups.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-ink mb-3">Analytics</h2>
            <p>
              We use privacy-respecting analytics to understand aggregate traffic (page views, popular EV models,
              state pages). No cross-site tracking or advertising IDs are used.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-ink mb-3">Advertising</h2>
            <p>
              This site displays third-party advertisements. Ad networks may use cookies or device identifiers
              to show relevant ads. You can opt out via your browser&apos;s privacy settings or tools like the{" "}
              <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-forest underline">
                Digital Advertising Alliance opt-out
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-ink mb-3">Affiliate links</h2>
            <p>
              Some product links are affiliate links. If you purchase through them, we may earn a small
              commission at no extra cost to you. This does not affect our recommendations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-ink mb-3">Contact</h2>
            <p>
              Questions? Email us at{" "}
              <a href="mailto:hello@evchargesavings.com" className="text-forest underline">
                hello@evchargesavings.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
