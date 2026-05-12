// Daily EV news publisher — called by GitHub Actions
// Searches for today's top EV story via Claude web search,
// writes it as a Guide entry, appends to data.ts, pings IndexNow.

const { Anthropic } = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../web/features/news/data.ts");
const BASE_URL = "https://www.evchargesavings.com";
const INDEXNOW_KEY = "ccd656076fbc461f9a711d00e5945297";
const MARKER = "];\n\nexport function getNewsBySlug";

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
    `    ],`,
    `  },`,
  ].join("\n");
}

async function main() {
  const client = new Anthropic();
  const content = fs.readFileSync(DATA_FILE, "utf-8");
  const existingSlugs = getExistingSlugs(content);
  const today = new Date().toISOString().split("T")[0];

  console.log(`[${today}] Fetching EV news. ${existingSlugs.length} existing articles.`);

  const msg = await client.messages.create(
    {
      model: "claude-opus-4-7",
      max_tokens: 32000,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 1 }],
      system: `You are an EV news journalist for evchargesavings.com — a site helping people understand EV charging costs and savings in the US. Today is ${today}.

Search for a newsworthy EV story published in the last 7 days. Prioritise: public charging infrastructure, new EV pricing/availability, government EV policy, utility rates affecting EV owners, major automaker EV news. Do NOT pick stories about EVgo unless they are the ONLY option.

Already published slugs (do not pick any topic covered by these slugs): ${existingSlugs.filter((s) => /-202/.test(s)).join(", ")}

IMPORTANT: Do one search, pick one story, write the article. Do not search again.

After searching, return ONLY a valid JSON object — no markdown fences, no commentary — matching this shape exactly:
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
  ]
}

Requirements:
- 4-6 sections minimum
- Every fact must be verified from search results
- Include specific numbers, dates, company names, dollar amounts
- Write original sentences — never copy source text verbatim
- Frame content for someone comparing EV vs gas or already owning an EV`,
      messages: [
        {
          role: "user",
          content: "Search for today's top EV news and return the article as JSON.",
        },
      ],
    },
    { headers: { "anthropic-beta": "web-search-2025-03-05" } }
  );

  // Extract JSON from final text block
  let article = null;
  for (const block of msg.content) {
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
    console.error(JSON.stringify(msg.content, null, 2));
    process.exit(1);
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
