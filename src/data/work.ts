import { REPOS, type RepoName } from "@/data/projects";

/** Where each project lives on the page. Every repository is claimed exactly once. */
export type Feature = {
  id: string; name: string; word: string; kind: string; year: string;
  line: string; statement: string; decision: string;
  media: { label: string; video?: string; img?: string; diagram?: "derq" }[];
  repos: readonly RepoName[]; live?: string;
};

export const FEATURES: readonly Feature[] = [
  { id: "derq", name: "Derq Ops", word: "OPS", kind: "Internal platform · Derq", year: "2026",
    line: "A day of traffic-AI site maintenance, in one window.",
    statement: "Checks every edge unit and camera over SSH, fixes what it can, and writes the day's report.",
    decision: "Turn a folder of scripts into one app the whole team can run.",
    media: [{ label: "How it works", diagram: "derq" }, { label: "Roads it keeps watching", video: "/broll/traffic.mp4" }], repos: [] },
  { id: "vitacount", name: "MyChiffre", word: "LEDGER", kind: "Fintech SaaS · formerly VitaCount", year: "2026",
    line: "Books that can never go out of balance.",
    statement: "Accounting, banking and an AI operator on one ledger, for small businesses.",
    decision: "Make the database the auditor: a trigger refuses any entry that doesn't balance.",
    media: [{ label: "Dashboard", img: "/work/mc-dashboard.jpg" }, { label: "Ledger", img: "/work/mc-ledger.jpg" }, { label: "Agents", img: "/work/mc-agents.jpg" }, { label: "Sales", img: "/work/mc-sales.jpg" }], repos: ["vitacount", "Vitacount-v2"] },
  { id: "shantiban", name: "Shantiban City", word: "CITY", kind: "Real estate · three.js", year: "2026",
    line: "220 plots you can walk in a browser.",
    statement: "A real township near Kolkata, traced from its master plan, plus the bilingual sales site.",
    decision: "Draw the real plan, not a render. The build fails if a plot number skips.",
    media: [{ label: "Walkthrough", video: "/live/walkthrough.mp4" }, { label: "Sales site", video: "/live/mrityika.mp4" }], repos: ["the-Shantiban-city-3d-render", "M", "MRITYIKA-REALTERS-OPC-PRIVATE-LIMITED"], live: "https://walkthrough.mrityikaestates.com/" },
  { id: "stellar", name: "Stellar", word: "LUX", kind: "SaaS · lighting design", year: "2026",
    line: "Lighting studios, one shared record.",
    statement: "Nine project stages, clients and consultants on one record, drawings with their approvals.",
    decision: "One record per project, seen by everyone who touches it.",
    media: [{ label: "Workspace", img: "/work/stellar.webp" }], repos: [], live: "https://app.stellardesigns.solutions/" },
  { id: "webgrow-ai", name: "WebGrow .AI", word: "AI", kind: "Agency site · WebGL", year: "2026",
    line: "An AI studio, told in old masters.",
    statement: "Each service opens on a painting that tears into parchment and shows the system built.",
    decision: "Make every service a chapter, not a card.",
    media: [{ label: "The edition", video: "/live/webgrow-ai.mp4" }], repos: ["webgrow360_AI"], live: "https://ai.webgrow360.online/" },
  { id: "webgrow", name: "WebGrow360", word: "GROW", kind: "Agency · four rebuilds", year: "2025–26",
    line: "Brands built for the scroll.",
    statement: "Four generations of an agency's sites, from React + Prisma to hand-tuned GSAP, plus a real estate desk.",
    decision: "Rebuild until it's fast, then keep the leads flowing into MongoDB.",
    media: [{ label: "webgrow360.online", video: "/live/webgrow.mp4" }, { label: "Real estate desk", video: "/live/realestate.mp4" }],
    repos: ["webgrow360.online", "WebGrow360", "webgrw360_exl_Integration", "realestate.webgrow360.online", "realestate-site1", "websiteeeeee"], live: "https://webgrow360.online/" },
];

export const LAB_REPOS: readonly RepoName[] = ["cloud-butler-infra", "Job-Hunting-using-N8N", "Implemented-BGP-monitoring-Protocol-to-get-graphical-representation-of-the-BGP-data-s", "leo-kpi-monitoring", "Himalayan_Snow_Monitor", "Snow_Monitor", "Paraphrasing-Using-ollama"];

/** Four more, shown in full in the index with a picture each (variants of the same project share a row). */
export const INDEX_FEATURED: readonly { repos: readonly RepoName[]; pic: string; tags: string }[] = [
  { repos: ["Golf_charity", "Golf-Charity-Subscription-Platform"], pic: "/index/golf.jpg", tags: "Subscriptions · Stripe · Draws" },
  { repos: ["finance-toolkit"], pic: "/index/finance.jpg", tags: "17 calculators · Live FX" },
  { repos: ["customex-hub"], pic: "/index/customex.jpg", tags: "Client project · Onboarding funnel" },
  { repos: ["Instagram-feed-flutter"], pic: "/index/feed.jpg", tags: "Flutter · Gestures" },
];
/** Everything else lives in the archive rolodex and on GitHub. */
export const ARCHIVE: readonly RepoName[] = [
  "Stock_portfolio", "Brute-Force-simulator-", "figma_clon", "student_registration", "IOS", "Prop-Content-OS", "WebScraping_to_gather_website_details",
  "info-stream-news-app", "flask-signup-mongodb-app", "cloud-infra-automation", "Kaushik-s-Portfolio", "My_Portfolio", "sayakr428",
  "python-for-devops", "py_prac", "Covid19-Testing-DBMS", "face-recognition", "blackjac", "sketchpy", "onlineMobilerecharge", "awesome-github-profile-readme",
];

// guard: every repository is placed exactly once
const placed = [...FEATURES.flatMap((f) => f.repos), ...LAB_REPOS, ...INDEX_FEATURED.flatMap((x) => x.repos), ...ARCHIVE];
if (import.meta.env.DEV) {
  const missing = REPOS.filter((r) => !placed.includes(r.name)).map((r) => r.name);
  const dup = placed.filter((n, i) => placed.indexOf(n) !== i);
  if (missing.length || dup.length) console.warn("work.ts placement", { missing, dup });
}
export const PLACED_COUNT = new Set(placed).size;
