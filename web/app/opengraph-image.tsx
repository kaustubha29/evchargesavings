import { ImageResponse } from "next/og";

export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Google Fonts v1 CSS with legacy UA returns TTF (Satori requires TTF/OTF)
  // Playfair Display is the closest available serif to Fraunces
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
        <div style={{ position: "absolute", right: 80, top: 15, width: 600, height: 600, borderRadius: 300, background: "radial-gradient(circle, rgba(46,204,113,0.13) 0%, rgba(46,204,113,0) 68%)", display: "flex" }} />
        <div style={{ position: "absolute", left: -60, top: 100, width: 400, height: 400, borderRadius: 200, background: "radial-gradient(circle, rgba(46,204,113,0.06) 0%, rgba(46,204,113,0) 70%)", display: "flex" }} />

        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, #1a5c38, #2ecc71 40%, #2ecc71 60%, #1a5c38)", display: "flex" }} />

        {/* LEFT — headline */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 460, padding: "60px 32px 60px 64px" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: 20, color: "#2ecc71" }}>⚡</span>
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,240,232,0.38)" }}>EV Charge Savings</span>
          </div>

          <div style={{ fontSize: 58, fontWeight: 600, color: "#f5f0e8", lineHeight: 1.0, letterSpacing: "-0.025em", fontFamily: serif, marginBottom: 4 }}>
            Should you
          </div>
          <div style={{ fontSize: 58, fontWeight: 600, color: "#2ecc71", lineHeight: 1.0, letterSpacing: "-0.025em", fontFamily: serif, fontStyle: "italic", marginBottom: 24 }}>
            switch to an EV?
          </div>

          <div style={{ fontSize: 17, color: "rgba(245,240,232,0.52)", lineHeight: 1.5, marginBottom: 32, maxWidth: 360 }}>
            Calculate exact fuel savings using live EIA electricity &amp; gas rates for your state.
          </div>

          <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, backgroundColor: "rgba(46,204,113,0.15)", border: "1px solid rgba(46,204,113,0.35)", borderRadius: 100, padding: "9px 18px" }}>
              <div style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: "#2ecc71", display: "flex" }} />
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "#2ecc71", letterSpacing: "0.06em" }}>Free · no account needed</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            {["📡 Live EIA rates", "🚗 140+ EVs", "📊 EPA data"].map((t) => (
              <span key={t} style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(245,240,232,0.25)", letterSpacing: "0.04em" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* RIGHT — slot machine card */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "24px 44px 24px 8px" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 680, borderRadius: 36, border: "1px solid rgba(46,204,113,0.22)", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.05)" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 33px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontFamily: "monospace", fontSize: 15, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.32)" }}>EV savings · real examples</span>
              <div style={{ display: "flex", gap: 9 }}>
                {[0.3, 0.55, 0.8].map((op, i) => (
                  <div key={i} style={{ width: 13, height: 13, borderRadius: 7, backgroundColor: "#2ecc71", opacity: op }} />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, padding: "24px 33px 9px" }}>
              {["EV model", "Location", "Saves / yr"].map((l) => (
                <div key={l} style={{ flex: 1, textAlign: "center", fontFamily: "monospace", fontSize: 15, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,240,232,0.28)" }}>{l}</div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, padding: "0 33px 33px" }}>
              <div style={{ flex: 1, height: 87, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 19, color: "rgba(245,240,232,0.88)" }}>
                Model Y LR
              </div>
              <div style={{ flex: 1, height: 87, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 17, color: "rgba(245,240,232,0.88)" }}>
                Los Angeles, CA
              </div>
              <div style={{ flex: 1, height: 87, borderRadius: 18, backgroundColor: "rgba(46,204,113,0.15)", border: "2px solid rgba(46,204,113,0.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <span style={{ fontSize: 39, fontWeight: 700, fontFamily: serif, color: "#2ecc71", lineHeight: 1 }}>$1,847</span>
                <span style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(46,204,113,0.6)", letterSpacing: "0.08em", marginTop: 9 }}>/yr</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 15, padding: "19px 33px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: 21, color: "#2ecc71" }}>⚡</span>
              <span style={{ fontFamily: "monospace", fontSize: 16, color: "rgba(245,240,232,0.38)" }}>The avg EV owner spends $900 less on fuel every year</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 33px", backgroundColor: "rgba(255,255,255,0.025)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(245,240,232,0.16)", letterSpacing: "0.05em" }}>vs equivalent gas car · 13,500 mi/yr</span>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: "#2ecc71" }} />
                <span style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(46,204,113,0.6)", letterSpacing: "0.07em" }}>live</span>
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

