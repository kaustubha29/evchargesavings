import { NextRequest, NextResponse } from "next/server";

const KEY      = "ccd656076fbc461f9a711d00e5945297";
const HOST     = "www.evchargesavings.com";
const BASE     = `https://${HOST}`;
const KEY_LOC  = `${BASE}/${KEY}.txt`;

const STATIC_URLS = [
  "/",
  "/about",
  "/contact",
  "/ev-owner",
  "/guides",
  "/ev-insurance",
  "/how-we-calculate",
  "/privacy",
  "/terms",
];

export async function POST(req: NextRequest) {
  const secret = process.env.INDEXNOW_SECRET;
  if (secret && req.headers.get("x-indexnow-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const urls: string[] = Array.isArray(body.urls)
    ? body.urls
    : STATIC_URLS.map((p) => `${BASE}${p}`);

  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOC,
      urlList: urls,
    }),
  });

  return NextResponse.json({ status: res.status, urls: urls.length });
}
