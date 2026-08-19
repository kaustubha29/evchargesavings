#!/usr/bin/env node
// Submit new/changed URLs to IndexNow (Bing, Yandex, Seznam, Naver).
//
// IMPORTANT: only run this AFTER the pages are live in production. IndexNow tells
// search engines "fetch this now" — pointing it at URLs that still 404 wastes the
// submission and can hurt trust in the host.
//
// Usage:
//   node scripts/submit-indexnow.mjs --check          # verify URLs are live, submit nothing
//   node scripts/submit-indexnow.mjs                  # verify, then submit
//   node scripts/submit-indexnow.mjs --skip-check     # submit without verifying (not advised)
//
// Scope: every /news/<slug> from web/features/news/data.ts, plus the pages whose
// content changed in the rates + §30C refresh.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const HOST = "www.evchargesavings.com";
const BASE = `https://${HOST}`;
const KEY = "ccd656076fbc461f9a711d00e5945297";
const KEY_LOCATION = `${BASE}/${KEY}.txt`;

const CHECK_ONLY = process.argv.includes("--check");
const SKIP_CHECK = process.argv.includes("--skip-check");

// Only submit news published on/after this date (the backfill window). Pass
// --all to submit every news URL instead.
const SINCE = process.argv.includes("--all") ? "0000-00-00" : "2026-06-03";

function newsUrls() {
  const src = fs.readFileSync(path.join(ROOT, "web/features/news/data.ts"), "utf8");
  const out = [];
  const re = /slug:\s*"([^"]+)"[\s\S]*?publishedAt:\s*"([\d-]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m[2] >= SINCE) out.push(`${BASE}/news/${m[1]}`);
  }
  return [...new Set(out)];
}

function stateSlugs() {
  const src = fs.readFileSync(path.join(ROOT, "web/features/location/data/states.ts"), "utf8");
  const out = [];
  const re = /^\s*[A-Z]{2}:\{name:"([^"]+)"/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push(m[1].toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  }
  return out;
}

// Pages whose content changed in this pass: rate baselines + the §30C expiry rewrite.
const CHANGED_PAGES = [
  "/",
  "/news",
  "/research",
  "/how-we-calculate",
  "/ev-owner",
  "/guides",
  "/best-home-ev-charger",
  "/ev-charger-installation-cost",
];

const urlList = [
  ...CHANGED_PAGES.map((p) => BASE + p),
  ...newsUrls(),
  ...stateSlugs().map((s) => `${BASE}/ev-cost/${s}`),
  ...stateSlugs().map((s) => `${BASE}/ev-charger-installation-cost/${s}`),
];

console.log(`Prepared ${urlList.length} URLs`);
console.log(`  changed pages:        ${CHANGED_PAGES.length}`);
console.log(`  news (>= ${SINCE}):  ${newsUrls().length}`);
console.log(`  state rate pages:     ${stateSlugs().length * 2}`);

async function verify(urls) {
  // Spot-check a sample rather than all of them; enough to catch "not deployed yet".
  const sample = [urls[0], ...newsUrls().slice(0, 3), `${BASE}/${KEY}.txt`].filter(Boolean);
  let ok = true;
  for (const u of sample) {
    try {
      const res = await fetch(u, { method: "HEAD", redirect: "follow" });
      const good = res.status >= 200 && res.status < 400;
      console.log(`  ${good ? "OK " : "BAD"} ${res.status}  ${u}`);
      if (!good) ok = false;
    } catch (e) {
      console.log(`  ERR       ${u}  ${e.message}`);
      ok = false;
    }
  }
  return ok;
}

if (!SKIP_CHECK) {
  console.log("\nVerifying a sample is live...");
  const live = await verify(urlList);
  if (!live) {
    console.error("\nSome URLs are not reachable. Deploy first, then re-run.");
    process.exit(1);
  }
  console.log("Sample looks live.");
}

if (CHECK_ONLY) {
  console.log("\n--check specified — nothing submitted.");
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
});

console.log(`\nIndexNow response: ${res.status} ${res.statusText}`);
if (res.status === 200 || res.status === 202) {
  console.log(`Submitted ${urlList.length} URLs.`);
} else {
  console.error(await res.text().catch(() => ""));
  process.exit(1);
}
