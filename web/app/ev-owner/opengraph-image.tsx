import { ImageResponse } from "next/og";

export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

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

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "#081510", position: "relative", fontFamily: "sans-serif", overflow: "hidden" }}>

        {/* Background glows */}
        <div style={{ position: "absolute", right: 60, top: 20, width: 560, height: 560, borderRadius: 280, background: "radial-gradient(circle, rgba(46,204,113,0.11) 0%, rgba(46,204,113,0) 68%)", display: "flex" }} />
        <div style={{ position: "absolute", left: -40, bottom: 40, width: 360, height: 360, borderRadius: 180, background: "radial-gradient(circle, rgba(46,204,113,0.06) 0%, rgba(46,204,113,0) 70%)", display: "flex" }} />

        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, #1a5c38, #2ecc71 40%, #2ecc71 60%, #1a5c38)", display: "flex" }} />

        {/* LEFT — headline */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 460, padding: "60px 32px 60px 64px" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: 20, color: "#2ecc71" }}>⚡</span>
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,240,232,0.38)" }}>EV Charge Savings</span>
          </div>

          <div style={{ fontSize: 54, fontWeight: 600, color: "#f5f0e8", lineHeight: 1.05, letterSpacing: "-0.025em", fontFamily: serif, marginBottom: 4 }}>
            You own an EV.
          </div>
          <div style={{ fontSize: 54, fontWeight: 600, color: "#2ecc71", lineHeight: 1.05, letterSpacing: "-0.025em", fontFamily: serif, fontStyle: "italic", marginBottom: 24 }}>
            Make it cheaper.
          </div>

          <div style={{ fontSize: 16, color: "rgba(245,240,232,0.50)", lineHeight: 1.55, marginBottom: 32, maxWidth: 360 }}>
            Level 2 charger ROI, TOU rate savings, and EV insurance — the three moves most owners skip.
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            {["🔌 Level 2 install", "🕐 TOU rates", "🛡 EV insurance"].map((t) => (
              <span key={t} style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(245,240,232,0.25)", letterSpacing: "0.04em" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* RIGHT — three savings cards */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "40px 48px 40px 8px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>

            {/* Card 1 — Level 2 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(46,204,113,0.22)", borderRadius: 20, padding: "22px 28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,240,232,0.30)" }}>Level 2 charger</span>
                <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: "#f5f0e8", lineHeight: 1 }}>Full charge overnight</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                <span style={{ fontFamily: serif, fontSize: 34, fontWeight: 700, color: "#2ecc71", lineHeight: 1 }}>~16 mo</span>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(46,204,113,0.5)", letterSpacing: "0.08em" }}>avg payback</span>
              </div>
            </div>

            {/* Card 2 — TOU */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(46,204,113,0.22)", borderRadius: 20, padding: "22px 28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,240,232,0.30)" }}>TOU electricity rate</span>
                <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: "#f5f0e8", lineHeight: 1 }}>Charge off-peak only</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                <span style={{ fontFamily: serif, fontSize: 34, fontWeight: 700, color: "#2ecc71", lineHeight: 1 }}>30–60%</span>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(46,204,113,0.5)", letterSpacing: "0.08em" }}>rate reduction</span>
              </div>
            </div>

            {/* Card 3 — Insurance */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(46,204,113,0.22)", borderRadius: 20, padding: "22px 28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,240,232,0.30)" }}>EV insurance</span>
                <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: "#f5f0e8", lineHeight: 1 }}>Shop after year one</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                <span style={{ fontFamily: serif, fontSize: 34, fontWeight: 700, color: "#2ecc71", lineHeight: 1 }}>$400+</span>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(46,204,113,0.5)", letterSpacing: "0.08em" }}>avg annual savings</span>
              </div>
            </div>

          </div>
        </div>

        <div style={{ position: "absolute", bottom: 22, right: 68, display: "flex", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", color: "rgba(245,240,232,0.14)", textTransform: "uppercase" }}>
          evchargesavings.com
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
