import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const make  = searchParams.get("make")  ?? "";
  const model = searchParams.get("model") ?? "";
  const year  = searchParams.get("year")  ?? "";

  if (!make || !model || !year) {
    return NextResponse.json({ results: [] });
  }

  try {
    const url =
      `https://api.nhtsa.dot.gov/recalls/recallsByVehicle` +
      `?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`NHTSA ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ results: data.results ?? [] });
  } catch {
    return NextResponse.json({ results: [] }, { status: 502 });
  }
}
