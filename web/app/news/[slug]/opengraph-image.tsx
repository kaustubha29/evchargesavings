import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/features/news/data";

export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime     = "nodejs";

interface Props { params: Promise<{ slug: string }> }

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) notFound();

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

  const dateStr = new Date(article.publishedAt + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const title = article.title.length > 65 ? article.title.slice(0, 62) + "…" : article.title;
  const hook  = article.hook.length  > 95 ? article.hook.slice(0, 92)  + "…" : article.hook;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "#081510", fontFamily: "sans-serif", position: "relative", overflow: "hidden" }}>

        {/* Background glow */}
        <div style={{ position: "absolute", right: -60, top: 60, width: 560, height: 560, borderRadius: 280, background: "radial-gradient(circle, rgba(46,204,113,0.11) 0%, rgba(46,204,113,0) 68%)", display: "flex" }} />
        <div style={{ position: "absolute", left: -80, bottom: 0, width: 360, height: 360, borderRadius: 180, background: "radial-gradient(circle, rgba(46,204,113,0.05) 0%, rgba(46,204,113,0) 70%)", display: "flex" }} />

        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg, #1a5c38, #2ecc71 40%, #2ecc71 60%, #1a5c38)", display: "flex" }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 80px 52px", width: "100%" }}>

          {/* Site + section label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
            <span style={{ fontSize: 19, color: "#2ecc71" }}>⚡</span>
            <span style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)" }}>EV Charge Savings</span>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(46,204,113,0.35)", letterSpacing: "0.08em" }}>·</span>
            <span style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(46,204,113,0.6)" }}>News</span>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(245,240,232,0.22)", letterSpacing: "0.08em", marginLeft: 10 }}>{dateStr}</span>
          </div>

          {/* Title */}
          <div style={{ display: "flex", fontSize: 52, fontWeight: 700, color: "#f5f0e8", lineHeight: 1.12, letterSpacing: "-0.02em", fontFamily: serif, marginBottom: 30, maxWidth: 1040 }}>
            {title}
          </div>

          {/* Hook */}
          <div style={{ display: "flex", fontSize: 22, color: "rgba(245,240,232,0.52)", lineHeight: 1.55, maxWidth: 860, marginBottom: 44 }}>
            {hook}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "rgba(46,204,113,0.12)", border: "1px solid rgba(46,204,113,0.28)", borderRadius: 100, padding: "8px 18px" }}>
              <div style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: "#2ecc71", display: "flex" }} />
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "#2ecc71", letterSpacing: "0.06em" }}>{article.readTime}</span>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(245,240,232,0.18)", letterSpacing: "0.08em" }}>evchargesavings.com/news</span>
          </div>
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
