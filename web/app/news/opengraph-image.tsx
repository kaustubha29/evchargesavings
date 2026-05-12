import { ImageResponse } from "next/og";
import { NEWS } from "@/features/news/data";

export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime     = "nodejs";

export default async function Image() {
  let fontRegular: ArrayBuffer | undefined;
  let fontItalic: ArrayBuffer | undefined;
  try {
    const [cssReg, cssItal] = await Promise.all([
      fetch("https://fonts.googleapis.com/css?family=Playfair+Display:700",       { headers: { "User-Agent": "Mozilla/4.0 (compatible)" } }).then((r) => r.text()),
      fetch("https://fonts.googleapis.com/css?family=Playfair+Display:700italic", { headers: { "User-Agent": "Mozilla/4.0 (compatible)" } }).then((r) => r.text()),
    ]);
    const urlReg  = cssReg.match(/url\(([^)]+)\)/)?.[1];
    const urlItal = cssItal.match(/url\(([^)]+)\)/)?.[1];
    [fontRegular, fontItalic] = await Promise.all([
      urlReg  ? fetch(urlReg).then((r) => r.arrayBuffer())  : Promise.resolve(undefined),
      urlItal ? fetch(urlItal).then((r) => r.arrayBuffer()) : Promise.resolve(undefined),
    ]);
  } catch { /* no-op */ }

  const serif = "Playfair Display, Georgia, serif";

  const recent = [...NEWS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "#081510", fontFamily: "sans-serif", position: "relative", overflow: "hidden" }}>

        {/* Background glow */}
        <div style={{ position: "absolute", right: -40, top: 40, width: 520, height: 520, borderRadius: 260, background: "radial-gradient(circle, rgba(46,204,113,0.10) 0%, rgba(46,204,113,0) 68%)", display: "flex" }} />

        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg, #1a5c38, #2ecc71 40%, #2ecc71 60%, #1a5c38)", display: "flex" }} />

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 480, padding: "60px 32px 60px 72px" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <span style={{ fontSize: 19, color: "#2ecc71", display: "flex" }}>⚡</span>
            <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", display: "flex" }}>EV Charge Savings</span>
          </div>

          <div style={{ display: "flex", fontSize: 60, fontWeight: 700, color: "#f5f0e8", lineHeight: 1.05, letterSpacing: "-0.025em", fontFamily: serif, marginBottom: 6 }}>
            Latest
          </div>
          <div style={{ display: "flex", fontSize: 60, fontWeight: 700, color: "#2ecc71", lineHeight: 1.05, letterSpacing: "-0.025em", fontFamily: serif, fontStyle: "italic", marginBottom: 28 }}>
            EV News
          </div>

          <div style={{ display: "flex", fontSize: 18, color: "rgba(245,240,232,0.48)", lineHeight: 1.55, maxWidth: 360, marginBottom: 36 }}>
            Daily coverage of EV charging costs, incentives, new models, and charging infrastructure across the US.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "rgba(46,204,113,0.12)", border: "1px solid rgba(46,204,113,0.28)", borderRadius: 100, padding: "9px 18px" }}>
            <div style={{ display: "flex", width: 7, height: 7, borderRadius: 4, backgroundColor: "#2ecc71" }} />
            <span style={{ display: "flex", fontFamily: "monospace", fontSize: 12, color: "#2ecc71", letterSpacing: "0.06em" }}>Updated daily</span>
          </div>
        </div>

        {/* RIGHT — recent headlines */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "48px 60px 48px 20px" }}>
          <div style={{ display: "flex", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.25)", marginBottom: 20 }}>Recent stories</div>
          <div style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.03)" }}>
            {recent.map((a, i) => (
              <div key={a.slug} style={{ display: "flex", flexDirection: "column", padding: "20px 28px", borderBottom: i < recent.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ display: "flex", fontFamily: "monospace", fontSize: 10, color: "rgba(46,204,113,0.5)", letterSpacing: "0.1em", marginBottom: 6 }}>
                  {new Date(a.publishedAt + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {a.readTime}
                </div>
                <div style={{ display: "flex", fontSize: 16, fontWeight: 600, color: "rgba(245,240,232,0.85)", lineHeight: 1.3, fontFamily: serif }}>
                  {a.title.length > 58 ? a.title.slice(0, 55) + "…" : a.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 22, right: 68, display: "flex", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", color: "rgba(245,240,232,0.14)", textTransform: "uppercase" }}>
          evchargesavings.com/news
        </div>

      </div>
    ),
    {
      ...size,
      fonts: [
        ...(fontRegular ? [{ name: "Playfair Display", data: fontRegular, style: "normal" as const, weight: 700 as const }] : []),
        ...(fontItalic  ? [{ name: "Playfair Display", data: fontItalic,  style: "italic" as const, weight: 700 as const }] : []),
      ],
    }
  );
}
