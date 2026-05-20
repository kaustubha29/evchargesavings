import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { evRepository, gasRepository, phevRepository } from "@/features/ev-data/repository";
import { calculateSavings, calculatePHEVCost } from "@/features/calculations/savings";
import { calculateCO2 } from "@/features/calculations/co2";
import { calculateBreakEven } from "@/features/calculations/break-even";
import { comparePageMeta } from "@/features/content/seo";
import { CalculatorShell } from "@/components/features/calculator/CalculatorShell";
import { CompareBarChart } from "@/components/features/calculator/CompareBarChart";
import { CompareHeroClient } from "@/components/features/calculator/CompareHeroClient";
import { LocationDetector } from "@/components/features/location/LocationDetector";
import { fmt } from "@/lib/format";
import { NATIONAL_AVG } from "@/features/location/data/states";

interface Props {
  params: Promise<{ comparison: string }>;
}

// Top EV IDs × top gas IDs to pre-build
const TOP_EV_SLUGS = [
  "t-my-lr-awd", "t-my-rwd", "t-m3-rwd", "t-m3-lr-awd",
  "h-i5-lr-rwd", "h-i6-lr-rwd", "k-ev6-lr-rwd", "k-ev9-wind",
  "f-mache-sr", "f-lt-sr", "r-r1t-dual", "r-r1s-dual",
  "c-bolt", "c-bl-lt", "vw-id4-pro", "ni-ariya-fwd",
  "bmw-ix-50", "ps-p2-lr1", "lu-air-pure", "mb-eqs-450",
  "c-eq-lt", "ho-pro-fwd", "t-ct-awd", "cd-lyriq-rwd",
  "bmw-i4-40", "do-charg-rt", "ge-gv60-sr", "c-sv-rst",
  "h-ioniq9", "r-r2", "sc-terra", "sc-trvlr",
];
const TOP_GAS_IDS = [
  "toyota-rav4", "honda-cr-v", "toyota-camry", "ford-f150",
  "honda-civic", "chevy-silverado", "ford-explorer",
  "hyundai-tucson", "jeep-grand-cherokee", "bmw-x5",
];
const TOP_PHEV_IDS = [
  "toyota-rav4-prime", "lexus-nx-450h-plus", "kia-sportage-phev",
  "hyundai-tucson-phev", "kia-sorento-phev", "jeep-grand-cherokee-4xe",
];
// Top EVs to pair against PHEVs (segment-relevant subset)
const TOP_EV_VS_PHEV_SLUGS = [
  "t-my-lr-awd", "t-my-rwd", "t-m3-rwd", "t-m3-lr-awd",
  "h-i5-lr-rwd", "h-i6-lr-rwd", "k-ev6-lr-rwd", "k-ev9-wind",
];

function parseComparison(slug: string): { evSlug: string; compId: string } | null {
  const sepIdx = slug.lastIndexOf("-vs-");
  if (sepIdx === -1) return null;
  return { evSlug: slug.slice(0, sepIdx), compId: slug.slice(sepIdx + 4) };
}

export function generateStaticParams() {
  const allEvs = evRepository.getAll();
  const params: { comparison: string }[] = [];

  // EV vs gas
  for (const evId of TOP_EV_SLUGS) {
    const ev = allEvs.find((e) => e.id === evId);
    if (!ev) continue;
    for (const gasId of TOP_GAS_IDS) {
      params.push({ comparison: `${ev.slug}-vs-${gasId}` });
    }
  }

  // EV vs PHEV
  for (const evId of TOP_EV_VS_PHEV_SLUGS) {
    const ev = allEvs.find((e) => e.id === evId);
    if (!ev) continue;
    for (const phevId of TOP_PHEV_IDS) {
      params.push({ comparison: `${ev.slug}-vs-${phevId}` });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { comparison } = await params;
  const parsed = parseComparison(comparison);
  if (!parsed) return {};
  const ev   = evRepository.getBySlug(parsed.evSlug);
  const gas  = gasRepository.getById(parsed.compId);
  const phev = !gas ? phevRepository.getById(parsed.compId) : null;
  if (!ev || (!gas && !phev)) return {};
  const compName = gas ? gas.name : phev!.name;
  const { title, description } = comparePageMeta(ev.fullName, compName);
  return {
    title,
    description,
    alternates: { canonical: `/compare/${comparison}` },
    openGraph: { title, description, url: `/compare/${comparison}` },
  };
}

const NATIONAL_KWH_CENTS  = NATIONAL_AVG.kwhCents;   // 18.3¢/kWh
const NATIONAL_GAS_DOLLAR = NATIONAL_AVG.gasDollar;  // $4.55/gal
const DEFAULT_MILES       = 13500;
const DEFAULT_HOME_PCT    = 80;
const NATIONAL_EV_FEE     = NATIONAL_AVG.evFee;   // 138 — national avg BEV surcharge
const NATIONAL_PHEV_FEE   = NATIONAL_AVG.phevFee; // 56  — national avg PHEV surcharge
const GAS_VEHICLE_MSRPS: Record<string, number> = {
  "toyota-rav4": 32000, "toyota-camry": 27000,
  "honda-cr-v": 31000, "honda-civic": 24000, "honda-accord": 28000,
  "ford-f150": 35000, "ford-explorer": 36000,
  "chevy-silverado": 36000, "chevy-equinox": 28000,
  "hyundai-tucson": 28000, "hyundai-elantra": 22000,
  "jeep-grand-cherokee": 40000, "jeep-wrangler": 32000,
  "subaru-outback": 29000, "subaru-forester": 28000,
  "bmw-x5": 67000, "bmw-3": 44000,
  "mercedes-glc": 48000, "audi-q5": 45000, "ram-1500": 36000,
};

export default async function ComparePage({ params }: Props) {
  const { comparison } = await params;
  const parsed = parseComparison(comparison);
  if (!parsed) notFound();

  const ev   = evRepository.getBySlug(parsed.evSlug);
  const gas  = gasRepository.getById(parsed.compId);
  const phev = !gas ? phevRepository.getById(parsed.compId) : null;
  if (!ev || (!gas && !phev)) notFound();

  const isPhev = !!phev;

  const evSummaries = evRepository.getSummaries();
  const gasVehicles  = gasRepository.getAll();
  const phevVehicles = phevRepository.getAll();

  // EV annual cost (same regardless of comparison type)
  const evSavings = calculateSavings({
    evEfficiency:   ev.efficiency,
    gasMpg:         gas?.mpg ?? 99,  // dummy — only evAnnualCost used for PHEV path
    annualMiles:    DEFAULT_MILES,
    homePct:        DEFAULT_HOME_PCT,
    homeRateKwh:    NATIONAL_KWH_CENTS,
    publicRateKwh:  NATIONAL_KWH_CENTS * 2.5,
    gasPriceDollar: NATIONAL_GAS_DOLLAR,
    stateEvFee:     0,
  });
  const evAnnualCost = evSavings.evAnnualCost;

  // Comparison vehicle annual cost + derived stats
  let compAnnualCost: number;
  let annualSavings:  number;
  let netAnnualSavings: number;
  let co2SavedLbs:    number;
  let breakEven:      { years: number } | null = null;

  if (isPhev) {
    const phevCost = calculatePHEVCost({
      evRange:        phev!.evRange,
      mpge:           phev!.mpge,
      mpgGas:         phev!.mpgGas,
      annualMiles:    DEFAULT_MILES,
      homePct:        DEFAULT_HOME_PCT,
      homeRateKwh:    NATIONAL_KWH_CENTS,
      publicRateKwh:  NATIONAL_KWH_CENTS * 2.5,
      gasPriceDollar: NATIONAL_GAS_DOLLAR,
    });
    compAnnualCost   = phevCost.totalCost;
    annualSavings    = compAnnualCost - evAnnualCost;
    // Net fee: EV surcharge minus PHEV surcharge you escape
    const netFee     = NATIONAL_EV_FEE - NATIONAL_PHEV_FEE;
    netAnnualSavings = annualSavings - netFee;
    // CO2: EV all-electric vs PHEV gas portion only
    const phevGasGallons = phevCost.gasMiles / phev!.mpgGas;
    co2SavedLbs = phevGasGallons * 19.6 - evSavings.annualKwh * 0.85;
  } else {
    const savings = calculateSavings({
      evEfficiency:   ev.efficiency,
      gasMpg:         gas!.mpg,
      annualMiles:    DEFAULT_MILES,
      homePct:        DEFAULT_HOME_PCT,
      homeRateKwh:    NATIONAL_KWH_CENTS,
      publicRateKwh:  NATIONAL_KWH_CENTS * 2.5,
      gasPriceDollar: NATIONAL_GAS_DOLLAR,
      stateEvFee:     NATIONAL_EV_FEE,
    });
    compAnnualCost   = savings.gasAnnualCost;
    annualSavings    = savings.annualSavings;
    netAnnualSavings = savings.netAnnualSavings;
    const gasMsrp    = GAS_VEHICLE_MSRPS[gas!.id] ?? 30000;
    breakEven        = calculateBreakEven(ev.msrp, gasMsrp, netAnnualSavings, 0);
    const co2        = calculateCO2(DEFAULT_MILES, gas!.mpg, savings.annualKwh);
    co2SavedLbs      = co2.savedLbs;
  }

  const compName = isPhev ? phev!.name : gas!.name;
  const isEvCheaper = annualSavings > 0;

  const { title, description } = comparePageMeta(ev.fullName, compName);

  // FAQ items — dynamically generated for SEO
  const gasMsrpForFaq = GAS_VEHICLE_MSRPS[gas?.id ?? ""] ?? 30000;
  const faqItems = isPhev ? [
    {
      q: `Is the ${ev.fullName} cheaper to drive than the ${compName}?`,
      a: isEvCheaper
        ? `Yes. At national average rates (${fmt.cents1(NATIONAL_KWH_CENTS)}/kWh electricity, ${fmt.money2(NATIONAL_GAS_DOLLAR)}/gal gas, 80% home charging), the ${ev.fullName} costs ${fmt.money0(evAnnualCost)}/year in electricity vs ${fmt.money0(compAnnualCost)}/year for the ${compName} — saving ${fmt.money0(annualSavings)}/year on driving costs.`
        : `At current national average rates, the ${compName} is cheaper to run by ${fmt.money0(-annualSavings)}/year. Driving patterns matter most: once you exceed the PHEV's ${phev!.evRange}-mile electric range, gas costs climb and the savings gap can flip.`,
    },
    {
      q: `When does the ${compName} switch from electric to gas?`,
      a: `The ${compName} has a ${phev!.evRange}-mile electric range. At a national average of ${Math.round(DEFAULT_MILES / 365)} miles/day, most drivers stay within that range and use electricity only. Gas kicks in on any single trip beyond ${phev!.evRange} miles.`,
    },
    {
      q: `What is the annual driving cost of the ${compName} PHEV?`,
      a: `At national average rates (${fmt.cents1(NATIONAL_KWH_CENTS)}/kWh, ${fmt.money2(NATIONAL_GAS_DOLLAR)}/gal, 80% home charging, 13,500 miles/year), the ${compName} costs about ${fmt.money0(compAnnualCost)}/year in combined electricity and gas — compared to ${fmt.money0(evAnnualCost)}/year for the ${ev.fullName}.`,
    },
    {
      q: `Do EV owners pay more in registration fees than PHEV drivers?`,
      a: `Most states charge both EVs and PHEVs annual surcharges. The national average EV surcharge is $${NATIONAL_EV_FEE} and the average PHEV surcharge is $${NATIONAL_PHEV_FEE}. Switching from the ${compName} to the ${ev.fullName} means a net fee increase of about $${NATIONAL_EV_FEE - NATIONAL_PHEV_FEE}/year nationally, which is already reflected in the net savings figure above.`,
    },
  ] : [
    {
      q: `Is the ${ev.fullName} cheaper to run than the ${gas!.name}?`,
      a: isEvCheaper
        ? `Yes. At national average rates (${fmt.cents1(NATIONAL_KWH_CENTS)}/kWh electricity, ${fmt.money2(NATIONAL_GAS_DOLLAR)}/gal gas, 80% home charging), the ${ev.fullName} costs ${fmt.money0(evAnnualCost)}/year in electricity vs ${fmt.money0(compAnnualCost)}/year in gas for the ${gas!.name} — saving ${fmt.money0(annualSavings)}/year in fuel.`
        : `At current national average rates, the ${gas!.name} is cheaper to fuel by ${fmt.money0(-annualSavings)}/year. Electricity prices vary widely by state — in low-cost states like Idaho or Louisiana, EVs often come out ahead even when the national average doesn't favor them.`,
    },
    {
      q: `How long until the ${ev.fullName} pays for itself vs the ${gas!.name}?`,
      a: breakEven
        ? `At current fuel prices and 13,500 miles/year, the ${fmt.money0(ev.msrp - gasMsrpForFaq)} price premium for the ${ev.fullName} over the ${gas!.name} takes about ${breakEven.years.toFixed(1)} years to recover through fuel savings. This uses national average rates — your state's electricity and gas prices will shift this timeline.`
        : ev.msrp <= gasMsrpForFaq
          ? `The ${ev.fullName} starts at ${fmt.money0(ev.msrp)}, similar to or lower than the ${gas!.name}'s estimated ${fmt.money0(gasMsrpForFaq)} — so fuel savings come with no price premium to recover.`
          : `After accounting for EV registration fees (~$${NATIONAL_EV_FEE}/year nationally), net savings are slim. Use the calculator below with your state's rates for an accurate break-even estimate.`,
    },
    {
      q: `What are the 5-year fuel costs for the ${ev.fullName} vs ${gas!.name}?`,
      a: `Over 5 years at 13,500 miles/year and national average rates, the ${ev.fullName} owner spends about ${fmt.money0(evAnnualCost * 5)} on electricity. The ${gas!.name} owner spends about ${fmt.money0(compAnnualCost * 5)} in gas — a ${fmt.money0(Math.abs(annualSavings * 5))} difference over the period.`,
    },
    {
      q: `Do EV owners pay more in registration fees than ${gas!.name} drivers?`,
      a: `Most states add an annual EV registration surcharge to offset lost gas-tax revenue — the national average is about $${NATIONAL_EV_FEE}/year. After this fee, the ${ev.fullName}'s net annual savings vs the ${gas!.name} are about ${fmt.money0(netAnnualSavings)}/year. Fees range from $0 (some states) to over $200 (Texas, Georgia). The calculator below factors in your state's exact fee.`,
    },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `https://evchargesavings.com/compare/${comparison}`,
    mainEntity: {
      "@type": "Dataset",
      name: `${ev.fullName} vs ${compName} cost comparison`,
      variableMeasured: [
        { "@type": "PropertyValue", name: "Annual EV fuel cost",   value: fmt.money0(evAnnualCost) },
        { "@type": "PropertyValue", name: "Annual comparison cost", value: fmt.money0(compAnnualCost) },
        { "@type": "PropertyValue", name: "Annual savings",        value: fmt.money0(annualSavings) },
      ],
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://evchargesavings.com" },
      { "@type": "ListItem", position: 2, name: "EV vs Gas", item: "https://evchargesavings.com/guides" },
      { "@type": "ListItem", position: 3, name: `${ev.fullName} vs ${compName}`, item: `https://evchargesavings.com/compare/${comparison}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <LocationDetector />

      <main>
        {/* Hero */}
        <section className="bg-paper border-b border-line py-16 md:py-24">
          <div className="section-wrap">
            <div className="inline-flex items-center gap-2 bg-good-bg text-good-fg font-mono text-xs px-3.5 py-1.5 rounded-full border border-good-fg/15 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              {isPhev ? "EV vs PHEV" : "EV vs Gas"} · 2026 national rates
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4 max-w-3xl leading-[1.05]">
              <em className="italic text-forest">{ev.fullName}</em>{" "}
              <span className="text-ink-mute">vs</span>{" "}
              {compName}
            </h1>
            <CompareHeroClient
              evName={ev.name}
              evRange={ev.range}
              evEfficiency={ev.efficiency}
              evConnector={ev.connector}
              evMsrp={ev.msrp}
              evFederalTaxCredit={ev.federalTaxCredit}
              compName={compName}
              isPhev={isPhev}
              gasMpg={gas?.mpg}
              gasType={gas?.type}
              gasMsrp={GAS_VEHICLE_MSRPS[gas?.id ?? ""]}
              phevEvRange={phev?.evRange}
              phevMpge={phev?.mpge}
              phevMpgGas={phev?.mpgGas}
              phevType={phev?.type}
              nationalEvCost={evAnnualCost}
              nationalCompCost={compAnnualCost}
              nationalAnnualSavings={annualSavings}
              nationalNetSavings={netAnnualSavings}
              nationalCo2Lbs={co2SavedLbs}
              nationalBreakEvenYrs={breakEven && breakEven.years <= 15 ? breakEven.years : null}
              nationalKwhCents={NATIONAL_KWH_CENTS}
              nationalGasDollar={NATIONAL_GAS_DOLLAR}
              nationalMiles={DEFAULT_MILES}
              nationalHomePct={DEFAULT_HOME_PCT}
              nationalEvFee={NATIONAL_EV_FEE}
              nationalPhevFee={NATIONAL_PHEV_FEE}
            />
          </div>
        </section>


        <CompareBarChart
          evName={ev.name}
          compName={compName}
          isPhev={isPhev}
          evEfficiency={ev.efficiency}
          gasMpg={gas?.mpg ?? 0}
          phev={isPhev ? { evRange: phev!.evRange, mpge: phev!.mpge, mpgGas: phev!.mpgGas } : undefined}
          nationalEvCost={evAnnualCost}
          nationalCompCost={compAnnualCost}
          nationalKwhCents={NATIONAL_KWH_CENTS}
          nationalGasDollar={NATIONAL_GAS_DOLLAR}
          nationalMiles={DEFAULT_MILES}
          nationalHomePct={DEFAULT_HOME_PCT}
        />

        {/* Full interactive calculator */}
        <section id="calculator" className="py-12">
          <div className="section-wrap">
            <h2 className="font-serif text-2xl font-medium tracking-tight mb-6">
              Customize with your zip code and driving habits
            </h2>
            <CalculatorShell
              evSummaries={evSummaries}
              gasVehicles={gasVehicles}
              phevVehicles={phevVehicles}
              defaultEvSlug={ev.slug}
              defaultComparisonType={isPhev ? "phev" : "gas"}
              defaultGasId={isPhev ? undefined : gas!.id}
              defaultPhevId={isPhev ? phev!.id : undefined}
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 border-t border-line">
          <div className="section-wrap max-w-3xl">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-ink mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {faqItems.map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-serif text-lg font-medium text-ink mb-2">{q}</h3>
                  <p className="text-ink-2 leading-relaxed text-sm">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="bg-ink text-cream/40 py-10 border-t border-white/10">
          <div className="section-wrap">
            <div className="flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
              <span>© 2026 EV Charge Savings</span>
              <span className="text-cream/25 text-center max-w-2xl">
                Rate data: EIA (electricity monthly, gas weekly) · EPA Fuel Economy Guide · DOE AFDC (state fees). Calculations are estimates.
              </span>
              <span>evchargesavings.com</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
