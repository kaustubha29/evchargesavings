// Daily EV news publisher — called by GitHub Actions
// Two-pass: (1) forced single web search, (2) article writing with no tools.

const { Anthropic } = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../web/features/news/data.ts");
const BASE_URL = "https://www.evchargesavings.com";
const INDEXNOW_KEY = "ccd656076fbc461f9a711d00e5945297";
const MARKER = "];\n\nexport function getNewsBySlug";

// Slugs attempted but never committed (keep model from repeating them)
const EXTRA_EXCLUDED_SLUGS = [
  "evgo-q1-2026-5280-stalls-nacs-expansion",
  "used-ev-ownership-costs-vs-gas-2026",
  "byd-5-minute-flash-charging-2026",
  "california-1-billion-ev-truck-rebate-2026",
  "hyundai-ioniq9-2026-lease-incentives",
  "california-200m-ev-rebate-first-time-buyers-2026",
  "tesla-supercharger-virtual-queue-pilot-2026",
];

function getExistingSlugs(content) {
  return [...content.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

function articleToTs(a) {
  const sections = a.sections
    .map((s) => {
      const listPart = s.list
        ? `\n        list: [\n${s.list.map((i) => `          ${JSON.stringify(i)},`).join("\n")}\n        ],`
        : "";
      return `      {\n        heading: ${JSON.stringify(s.heading)},\n        body: ${JSON.stringify(s.body)},${listPart}\n      },`;
    })
    .join("\n");

  const sourcesPart = Array.isArray(a.sources) && a.sources.length > 0
    ? `\n    sources: [\n${a.sources.map((s) => `      { label: ${JSON.stringify(s.label)}, url: ${JSON.stringify(s.url)} },`).join("\n")}\n    ],`
    : "";

  return [
    `  {`,
    `    slug: ${JSON.stringify(a.slug)},`,
    `    title: ${JSON.stringify(a.title)},`,
    `    hook: ${JSON.stringify(a.hook)},`,
    `    description: ${JSON.stringify(a.description)},`,
    `    readTime: ${JSON.stringify(a.readTime)},`,
    `    publishedAt: ${JSON.stringify(a.publishedAt)},`,
    `    sections: [`,
    sections,
    `    ],${sourcesPart}`,
    `  },`,
  ].join("\n");
}

async function main() {
  const client = new Anthropic({ maxRetries: 5 });
  const content = fs.readFileSync(DATA_FILE, "utf-8");
  const existingSlugs = [
    ...getExistingSlugs(content),
    ...EXTRA_EXCLUDED_SLUGS,
  ];
  const today = new Date().toISOString().split("T")[0];

  console.log(`[${today}] Fetching EV news. ${existingSlugs.length} known slugs.`);

  // Pass 1: force exactly one web search, collect results
  const searchMsg = await client.messages.create(
    {
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      tool_choice: { type: "tool", name: "web_search" },
      system: `You are a research assistant finding breaking news for evchargesavings.com — a US-only site about EV charging costs and savings. Search for a SPECIFIC EVENT or ANNOUNCEMENT published in the last 7 days. Must be one of: new US charging network expansion/pricing, EV tax credit or incentive change (US federal or state), utility rate change affecting EV charging in the US, new affordable EV model launch or pricing (US market), US government EV infrastructure policy, EV battery technology news (solid-state updates, battery warranty changes, charging limit recommendations from automakers). STRICT US-ONLY RULE: Ignore any story about Canadian, European, or other non-US companies, networks, or policy — even if the company also operates in the US. Do NOT pick evergreen analysis, opinion pieces, or "cost comparison" articles — must be a real news event with a date, company, or official announcement. Do NOT search for EVgo. Return only the raw search results.`,
      messages: [
        {
          role: "user",
          content: `Search for: EV charging news announcement OR EV incentive news OR electric vehicle policy news site:electrek.co OR site:insideevs.com OR site:greencarreports.com OR site:caranddriver.com OR site:prnewswire.com OR site:businesswire.com OR site:energy.gov ${today.slice(0, 7)}`,
        },
      ],
    },
    { headers: { "anthropic-beta": "web-search-2025-03-05" } }
  );

  // Extract search result blocks to pass to pass 2
  const searchBlocks = searchMsg.content.filter(
    (b) => b.type === "web_search_tool_result" || b.type === "server_tool_use"
  );
  console.log(`Search complete. ${searchBlocks.filter(b => b.type === "web_search_tool_result").length} result block(s).`);

  // Pass 2: write the article with no tools, using search results as context
  const articleMsg = await client.messages.create(
    {
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: `You are an EV news journalist for evchargesavings.com — a site helping people understand EV charging costs and savings in the US. Today is ${today}.

Based on the web search results provided, pick the single best story for evchargesavings.com readers — people who own or are buying EVs in the US and care about charging costs, savings, incentives, and battery health. US MARKET ONLY: if the only available stories are about Canadian, European, or other non-US companies or policy with no direct US impact, return NO_STORY.

MUST be a specific recent event/announcement (new law, new pricing, new network, new model launch, policy change, battery warranty update, automaker charging recommendation, solid-state battery milestone). Do NOT write about evergreen topics like "EVs vs gas cost comparison" or general analysis — pick something with a specific date, company, or government action in the search results.

STORY INTEGRITY RULE: Pick exactly ONE story from the search results. Every single fact, date, company name, and number in your article must come from that one story only — never combine or cross-reference multiple stories. If the search returns two BYD stories from different dates, they are separate events; write about only one.

DATE RULE: Always set publishedAt to "${today}" — this is the date we are publishing to our site. Reference the original event date naturally inside the article text (e.g. "On May 9, Hyundai announced…") but publishedAt must always be ${today}.

SPECIFICITY RULE: The article must contain real numbers — specific dollar amounts, port counts, mileage figures, percentage changes, or named locations. If the search results only contain vague claims with no concrete data, return NO_STORY. Do not write filler like "here's what to look for" or "contact your dealer" — every section must state actual facts.

If the search results contain genuinely no newsworthy EV story (only ads, spam, or purely evergreen analysis with no specific company/date/event), return ONLY this exact JSON and nothing else: {"slug":"NO_STORY","title":"","hook":"","description":"","readTime":"","publishedAt":"","sections":[]}

Already published slugs (do not duplicate): ${existingSlugs.filter((s) => /-202/.test(s)).join(", ")}

Return ONLY a valid JSON object — no markdown fences, no commentary — matching this shape exactly:
{
  "slug": "descriptive-kebab-case-slug",
  "title": "Clear, specific, factual headline",
  "hook": "One punchy sentence under 120 characters",
  "description": "1-2 sentence SEO description with key facts",
  "readTime": "3 min read",
  "category": "News",
  "publishedAt": "${today}",
  "sections": [
    { "heading": "...", "body": "..." },
    { "heading": "...", "body": "...", "list": ["item 1", "item 2"] }
  ],
  "sources": [
    { "label": "Company Press Release — Duracell Power Network", "url": "https://www.prnewswire.com/..." }
  ]
}

Requirements:
- 4-6 sections minimum
- Every fact must come from the search results provided
- Include specific numbers, dates, company names, dollar amounts
- Write original sentences — never copy source text verbatim
- Frame content for someone comparing EV vs gas or already owning an EV
- sources: include 1-3 OFFICIAL sources only — press releases (prnewswire.com, businesswire.com, globenewswire.com), government pages (.gov, .gov.uk), or automaker/company official sites (byd.com, tesla.com, ford.com, gm.com, rivian.com, lucidmotors.com, hyundai.com, kia.com, energy.gov, etc). Do NOT include EV news aggregators (electrek.co, insideevs.com, greencarreports.com, caranddriver.com). Only use URLs that literally appear in the search results — never construct or guess URLs. If no official URL appeared, output an empty sources array [].`,
      messages: [
        {
          role: "user",
          content: `Here are today's web search results:\n\n${JSON.stringify(searchBlocks, null, 2)}\n\nWrite the article JSON now.`,
        },
      ],
    }
  );

  // Extract JSON from final text block
  let article = null;
  for (const block of articleMsg.content) {
    if (block.type !== "text") continue;
    const text = block.text.trim().replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
    try {
      article = JSON.parse(text);
      break;
    } catch {
      const m = text.match(/\{[\s\S]+\}/);
      if (m) {
        try {
          article = JSON.parse(m[0]);
          break;
        } catch {}
      }
    }
  }

  if (!article?.slug || !Array.isArray(article.sections)) {
    console.error("No valid article JSON in response:");
    console.error(JSON.stringify(articleMsg.content, null, 2));
    process.exit(1);
  }

  // Sentinel: model signalled no qualifying story
  if (article.slug === "NO_STORY" || article.sections.length === 0) {
    console.log("No qualifying story found. Skipping publish.");
    process.exit(0);
  }

  // Reject vague articles with no concrete numbers or dollar amounts
  const allText = article.sections.map((s) => s.body + (s.list || []).join(" ")).join(" ");
  const hasNumbers = /\$[\d,]+|[\d,]+\s*(kW|mph|miles|km|ports?|stalls?|%|cents?|million|billion)/i.test(allText);
  if (!hasNumbers) {
    console.log("Article rejected: no specific numbers or dollar amounts. Skipping publish.");
    process.exit(0);
  }

  if (existingSlugs.includes(article.slug)) {
    console.log(`Slug already exists: ${article.slug}. Nothing to publish.`);
    process.exit(0);
  }

  // Append to data.ts before the closing ]; marker
  if (!content.includes(MARKER)) {
    console.error("Could not find insertion marker in data.ts");
    process.exit(1);
  }
  const ts = articleToTs(article);
  const updated = content.replace(MARKER, `${ts}\n${MARKER}`);
  fs.writeFileSync(DATA_FILE, updated, "utf-8");
  console.log(`✓ Published: /news/${article.slug}`);
  console.log(`  Title: ${article.title}`);

  // Signal success to GitHub Actions git step
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `published=true\nslug=${article.slug}\n`);
  }

  // Ping IndexNow
  const articleUrl = `${BASE_URL}/news/${article.slug}`;
  try {
    const r = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "www.evchargesavings.com",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: [articleUrl, `${BASE_URL}/news`],
      }),
    });
    console.log(`✓ IndexNow: ${r.status}`);
  } catch (e) {
    console.warn(`IndexNow failed (non-fatal): ${e.message}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
