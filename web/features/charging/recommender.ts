import type { ConnectorType } from "@/features/ev-data/types";
import type { ConnectorCompat } from "./types";
import { NETWORKS } from "./data/networks";

export function connCompat(evConn: ConnectorType | null, netConns: string[]): ConnectorCompat {
  if (!evConn) return { label:"Select your EV", cls:"adapter", note:"Pick your EV above to see compatibility" };
  if (evConn === "NACS" && netConns.includes("NACS")) return { label:"✓ Native NACS", cls:"yes", note:"Your EV plugs in directly" };
  if (evConn === "CCS"  && netConns.includes("CCS"))  return { label:"✓ Native CCS",  cls:"yes", note:"Your EV plugs in directly" };
  if (evConn === "CHADEMO" && netConns.includes("CHAdeMO")) return { label:"✓ CHAdeMO", cls:"yes", note:"Your EV plugs in directly" };
  if (evConn === "NACS" && netConns.includes("CCS") && !netConns.includes("NACS"))
    return { label:"⚡ Needs adapter", cls:"adapter", note:"CCS→NACS adapter required (~$149)" };
  if (evConn === "CCS" && netConns.includes("NACS") && !netConns.includes("CCS"))
    return { label:"⚡ Needs adapter", cls:"adapter", note:"NACS→CCS adapter required (~$249)" };
  if (evConn === "CHADEMO")
    return { label:"✗ Not compatible", cls:"incompat", note:"CHAdeMO not supported at this network" };
  return { label:"Check app", cls:"adapter", note:"Verify connector type with network app" };
}

export function rankNetworks(publicKwh: number, evConn: ConnectorType | null) {
  const annualPublicKwh = Number.isFinite(publicKwh) ? Math.max(publicKwh, 0) : 0;
  const compatRank: Record<ConnectorCompat["cls"], number> = {
    yes: 0,
    adapter: 1,
    incompat: 2,
  };

  return NETWORKS
    .map((n) => {
      const compat = connCompat(evConn, n.connectors);
      return { ...n, annualCost: annualPublicKwh * n.perKwh, compat };
    })
    .sort((a, b) => {
      const compatDiff = compatRank[a.compat.cls] - compatRank[b.compat.cls];
      if (compatDiff !== 0) return compatDiff;
      return a.annualCost - b.annualCost;
    });
}
