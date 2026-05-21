import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const make  = searchParams.get("make")  ?? "";
  const model = searchParams.get("model") ?? "";
  const year  = searchParams.get("year")  ?? "";

  if (!make || !model || !year) {
    return NextResponse.json({ results: [] });
  }

  const url =
    `https://api.nhtsa.dot.gov/recalls/recallsByVehicle` +
    `?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 86400 },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`NHTSA ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ results: data.results ?? [] });
  } catch {
    return NextResponse.json({ results: [] }, { status: 502 });
  }
}
