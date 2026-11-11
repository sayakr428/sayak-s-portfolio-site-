import { REPOS, repoUrl, type Repo } from "@/data/projects";

export type Brief = {
  id: string;
  title: string;
  kind: string;
  what: string;
  problem: string;
  built: readonly string[];
  stack: readonly string[];
  links: readonly { label: string; href: string }[];
  image?: string;
  note?: string;
};

// Full write-ups for the projects people ask about; every other repository gets a brief built from its own data.
const RICH: Record<string, Brief> = {
  derq: {
    id: "derq", title: "Derq Ops", kind: "Internal operations platform · Derq",
    what: "One local web app that runs Derq's whole daily site-maintenance routine: it finds which traffic-AI sites are falling behind, checks their edge units and cameras over SSH, fixes what it can, and produces the day's reports.",
    problem: "Daily maintenance was a set of separate scripts and manual steps: read the QA post in Slack, look each site up on the dashboard, SSH into every edge unit, check cameras one by one, then write the report by hand.",
    built: [
      "Backlog report: reads the QA post through the Slack API, opens the DERQ dashboard in a sandboxed Chromium (Playwright, with a live screencast), checks each edge unit over SSH, then exports Excel/CSV and posts the result back to Slack.",
      "Priority 1 · site down: ping, SSH into the edge unit, standard checks, router fallback, power-strip status.",
      "Priority 2 · camera offline: camera configs, RTSP stream check with ffprobe, camera ping.",
      "Priority 3 · processes stopped: which Derq services are down and since when, one-click restart with a plain-language summary.",
      "Low-memory and link-speed reports, and camera-movement detection with OpenCV (live frame vs the reference picture).",
      "An AI agent (chat and voice) that can run any check on request, with MCP connectors to Gmail, Calendar, Drive, Slack, Notion and GitHub.",
      "230 automated tests, including end-to-end browser tests against a mock dashboard, and a dry-run mode with mock Slack.",
    ],
    stack: ["Python 3.12", "FastAPI", "Jinja2 + HTMX", "SQLite", "Playwright", "paramiko (SSH)", "OpenCV", "ffprobe", "MCP", "pytest"],
    links: [],
    note: "Internal tool built at Derq. Shown without customer data or site details.",
  },
  vitacount: {
    id: "vitacount", title: "MyChiffre", kind: "AI financial operating system · SaaS · formerly VitaCount",
    what: "The financial operating system for US small businesses: accounting, banking reconciliation, invoicing and an AI financial operator on one core, where every business event resolves into ledger postings.",
    problem: "Small businesses juggle bookkeeping, bank feeds and invoices in separate tools, and the numbers drift. MyChiffre makes the ledger the single source of truth, with plain-language screens on top and a full CPA mode underneath.",
    built: [
      "The Financial Graph: invoices, bank lines and bills resolve deterministically into GL postings through a pure-function posting engine; a Postgres trigger structurally refuses any entry that doesn't balance.",
      "Multi-tenant workspaces: Supabase Auth, roles, Row Level Security as the tenant boundary, team invites, Owner / CPA modes.",
      "Sales and purchases (AR/AP), receipt capture with Claude Vision OCR, Plaid bank feeds with a rule-based reconciliation centre.",
      "Three agents: reconciliation, AP bookkeeping and AR collections, with an agent control plane and an action log humans approve.",
      "Projects and FIFO inventory, where inventory value in the ledger always equals the cost layers; 40 database checks verify the maths and tenant isolation.",
      "Closed a privilege-escalation path (members could promote themselves through the REST API) with a role-guard trigger.",
    ],
    stack: ["Next.js App Router", "Tailwind v4", "shadcn/ui", "Supabase Postgres + RLS", "pgmq · pg_cron · Edge Functions", "Claude API", "Plaid", "Stripe"],
    links: [{ label: "Code (v1)", href: "https://github.com/sayakr428/vitacount" }],
    note: "Not public yet. The screens shown are from the running app, with test data; the current version lives in a private repository.",
    image: "/work/mc-dashboard.jpg",
  },
  shantiban: {
    id: "shantiban", title: "Shantiban City", kind: "3D township walkthrough · real estate",
    what: "A browser walkthrough of a real 220-plot gated township near Kolkata, plus its bilingual sales site, so buyers can walk the roads, plots and amenities on a phone before they visit.",
    problem: "Plot buyers can't picture a site from a flat brochure, and the site is 20 km out of the city.",
    built: [
      "The boundary is traced from the real master plan; the build fails if plots 1–220 skip or repeat.",
      "Roads, gates, community hall, park and nearby landmarks at their real distances; a procedural town around it.",
      "Physically based sky with raymarched clouds and the sun set for the site's latitude and date; wind shared by grass, leaves and shadows.",
      "Runs on phones with thumb controls; the sales site is bilingual English and Bengali.",
    ],
    stack: ["three.js r160", "WebGL", "esbuild", "Next.js (sales site)"],
    links: [{ label: "Walk the site", href: "https://walkthrough.mrityikaestates.com/" }, { label: "Sales site", href: "https://mrityikaestates.com/" }, { label: "Code", href: "https://github.com/sayakr428/the-Shantiban-city-3d-render" }],
    image: "/live/walkthrough.jpg",
  },
  stellar: {
    id: "stellar", title: "Stellar", kind: "Workspace for lighting-design studios · SaaS",
    what: "Project management built for lighting-design studios: every project moves through nine stages on one shared record that the studio, its clients and consultants all see.",
    problem: "Lighting projects pass between designers, clients and consultants, and drawings, revisions and approvals get lost across email.",
    built: ["Nine-stage project tracking on one record.", "Team, client and consultant sharing.", "Drawings with revisions and review approvals.", "Passwordless email sign-in codes."],
    stack: ["Web app", "Studio workspace"],
    links: [{ label: "Open Stellar", href: "https://app.stellardesigns.solutions/" }],
    image: "/work/stellar.webp",
  },
  "webgrow-ai": {
    id: "webgrow-ai", title: "WebGrow360 .AI", kind: "AI agency site · WebGL",
    what: "The site for WebGrow360's AI arm, built as an editorial edition: each service is a chapter that opens on an old-master painting, tears into parchment and shows the system the studio builds as a live interface fragment.",
    problem: "AI agencies all look the same; this one needed to feel like a publication, not a template.",
    built: ["A three-layer Creation of Adam hero that brings the hands together through four eras.", "WebGL noise-threshold torn edges and shatter transitions between chapters.", "One shared scroll engine, no animation library; every effect respects reduced motion."],
    stack: ["Next.js 16", "React 19", "three.js", "Lenis"],
    links: [{ label: "Visit the edition", href: "https://ai.webgrow360.online/" }, { label: "Code", href: "https://github.com/sayakr428/webgrow360_AI" }],
    image: "/work/webgrow-ai.webp",
  },
  webgrow: {
    id: "webgrow", title: "WebGrow360", kind: "Agency sites · four rebuilds",
    what: "A branding and marketing agency's web presence, rebuilt four times as it grew.",
    problem: "Each version had to load faster and capture more leads than the last.",
    built: ["v1: React + Vite with 20 service pages and an Express + Prisma backend in Docker.", "Netlify Functions logging leads and visits into MongoDB.", "webgrow360.online: hand-built HTML with GSAP and Lenis, a PHP enquiry endpoint into MongoDB Atlas.", "realestate.webgrow360.online: a fully prerendered Next.js static export."],
    stack: ["React", "Next.js", "GSAP", "Lenis", "PHP", "MongoDB", "Prisma"],
    links: [{ label: "webgrow360.online", href: "https://webgrow360.online/" }, { label: "Real estate desk", href: "https://realestate.webgrow360.online/" }],
    image: "/live/webgrow.jpg",
  },
  snow: {
    id: "snow", title: "Himalayan Snow Monitor", kind: "Map app · 2025 · two builds",
    what: "A map-based monitor for snow cover across the Himalaya: pick a region on the map, read its snow data in a control panel, with an onboarding tour for first-time users.",
    problem: "Snow-cover data lives in scientific datasets that are hard to read; this puts it on a map anyone can use.",
    built: ["The private build: an interactive map, a control panel, an onboarding tour and theme switching, backed by Supabase.", "The public build (Snow_Monitor): the map display with a help panel and loading states."],
    stack: ["React", "TypeScript", "Supabase", "Tailwind"],
    links: [{ label: "Public build on GitHub", href: "https://github.com/sayakr428/Snow_Monitor" }],
    note: "The full build is in a private repository.",
  },
};

const ALIAS: Record<string, string> = { "Vitacount-v2": "vitacount", "the-Shantiban-city-3d-render": "shantiban", M: "shantiban", "MRITYIKA-REALTERS-OPC-PRIVATE-LIMITED": "shantiban", webgrow360_AI: "webgrow-ai", "webgrow360.online": "webgrow", WebGrow360: "webgrow", webgrw360_exl_Integration: "webgrow", "realestate.webgrow360.online": "webgrow", Himalayan_Snow_Monitor: "snow", Snow_Monitor: "snow" };

export function briefFor(key: string): Brief {
  if (RICH[key]) return RICH[key];
  if (ALIAS[key]) return RICH[ALIAS[key]];
  const r = REPOS.find((x) => x.name === key) as Repo | undefined;
  if (!r) return RICH.derq;
  return {
    id: r.name, title: r.title, kind: `${r.lang ?? "Docs & workflow"} · ${r.year}${r.private ? " · private repository" : ""}${r.fork ? " · fork" : ""}`,
    what: r.summary, problem: "", built: [], stack: r.stack,
    links: [...(r.private ? [] : [{ label: "Code on GitHub", href: repoUrl(r) }]), ...(r.live ? [{ label: "Live site", href: r.live }] : [])],
    note: r.private ? "The code is in a private repository; ask me for a walkthrough." : undefined,
  };
}

export const openBrief = (key: string) => window.dispatchEvent(new CustomEvent<string>("brief", { detail: key }));
