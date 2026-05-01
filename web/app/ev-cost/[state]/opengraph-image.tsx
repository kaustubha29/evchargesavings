import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/features/location/queries";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { calculateSavings } from "@/features/calculations/savings";
import { statePageMeta } from "@/features/content/seo";

interface Props {
  params: Promise<{ state: string }>;
}

export const runtime = "nodejs";

export default async function Image({ params }: Props) {
  const { state: stateSlug } = await params;
  const stateData = getStateBySlug(stateSlug);

  if (!stateData) notFound();

  // Pre-compute example: Model Y LR vs Toyota RAV4
  const modelY = evRepository.getBySlug("t-my-lr-awd") ?? evRepository.getAll()[0];
  const rav4 = gasRepository.getById("toyota-rav4") ?? gasRepository.getAll()[0];

  const exSavings = calculateSavings({
    evEfficiency: modelY.efficiency,
    gasMpg: rav4.mpg,
    annualMiles: 15000,
    homePct: 80,
    homeRateKwh: stateData.kwhCents,
    publicRateKwh: stateData.kwhCents * 2.5,
    gasPriceDollar: stateData.gasDollar,
  });

  const annualSavingsRounded = Math.round(exSavings.annualSavings);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1200px",
          height: "630px",
          backgroundColor: "#f5f1eb",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system",
          padding: "40px",
          gap: "20px",
        }}
      >
        {/* Top badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "16px",
            color: "#6b7280",
            fontFamily: "monospace",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
            }}
          />
          EV Savings Calculator
        </div>

        {/* Main heading */}
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 500,
            color: "#1f2937",
            textAlign: "center",
            margin: "0",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          EV Savings in{" "}
          <span style={{ fontStyle: "italic", color: "#166534" }}>
            {stateData.name}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "28px",
            color: "#6b7280",
            margin: "10px 0 30px 0",
            textAlign: "center",
            maxWidth: "1000px",
          }}
        >
          Save ${annualSavingsRounded.toLocaleString()} yearly with an EV
        </p>

        {/* Key metrics row */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "24px",
            color: "#4b5563",
            fontFamily: "monospace",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "20px", color: "#9ca3af", marginBottom: "4px" }}>
              Electricity
            </div>
            <div style={{ fontSize: "32px", fontWeight: 600, color: "#1f2937" }}>
              {stateData.kwhCents}¢/kWh
            </div>
          </div>

          <div style={{ color: "#d1d5db", fontSize: "40px" }}>·</div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "20px", color: "#9ca3af", marginBottom: "4px" }}>
              Gas Price
            </div>
            <div style={{ fontSize: "32px", fontWeight: 600, color: "#1f2937" }}>
              ${stateData.gasDollar}/gal
            </div>
          </div>
        </div>

        {/* Footer tagline */}
        <div
          style={{
            fontSize: "18px",
            color: "#9ca3af",
            marginTop: "20px",
            fontFamily: "monospace",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          evchargesavings.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
