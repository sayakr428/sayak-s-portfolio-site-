// Every repository on github.com/sayakr428 (45 in total, as of Nov 2026).
// Descriptions are written from each repo's own code and README.

export const GH = "https://github.com/sayakr428";

export const CATEGORIES = {
  infra: "Network & infrastructure",
  ai: "AI & automation",
  product: "Products & platforms",
  web: "Websites, 3D & client work",
  learn: "Learning & experiments",
} as const;

export type Category = keyof typeof CATEGORIES;

export type Repo = {
  /** exact GitHub repository name */
  name: string;
  /** human title */
  title: string;
  summary: string;
  stack: readonly string[];
  /** primary language as GitHub reports it; null when the repo is docs/workflow only */
  lang: string | null;
  year: number;
  category: Category;
  private?: boolean;
  fork?: boolean;
  live?: string;
};

export const repoUrl = (r: Pick<Repo, "name">) => `${GH}/${r.name}`;

export const REPOS = [
  // ── Network & infrastructure ────────────────────────────────────────────
  { name: "leo-kpi-monitoring", title: "LEO satellite KPI monitoring", summary: "Distributed probes measure latency, packet loss and throughput on Low Earth Orbit links with mtr and iperf3; a shell loop logs JSON and Python pushes it to InfluxDB for Chronograf dashboards.", stack: ["Bash", "Python", "iperf3", "mtr", "InfluxDB", "Chronograf"], lang: "Shell", year: 2025, category: "infra" },
  { name: "Implemented-BGP-monitoring-Protocol-to-get-graphical-representation-of-the-BGP-data-s", title: "BGP Monitoring Protocol framework", summary: "Containerised BMP pipeline for watching BGP updates: OpenBMP collectors feeding Kafka and PostgreSQL, so route anomalies can be graphed, replayed and alerted on.", stack: ["OpenBMP", "Kafka", "Zookeeper", "PostgreSQL", "Docker"], lang: null, year: 2025, category: "infra" },
  { name: "cloud-infra-automation", title: "NETCONF config push", summary: "Python with ncclient pushes YANG-modelled interface config to routers over NETCONF, driven by YAML device files.", stack: ["Python", "ncclient", "NETCONF", "YANG", "YAML"], lang: "Python", year: 2025, category: "infra" },
  { name: "cloud-butler-infra", title: "Conversational Infrastructure-as-Code", summary: "Terraform that takes a JSON blueprint from an n8n + LLM chat flow and provisions AWS: clamped EC2 counts on Ubuntu 22.04, private-by-default S3 buckets, every resource tagged ManagedBy=n8n.", stack: ["Terraform", "AWS", "n8n", "OpenAI / Gemini"], lang: "HCL", year: 2025, category: "infra" },

  // ── AI & automation ─────────────────────────────────────────────────────
  { name: "Job-Hunting-using-N8N", title: "AI job application assistant", summary: "An n8n workflow that scans LinkedIn daily at 5 PM, scores each posting against a résumé on Google Drive with GPT, drafts a cover letter, logs to Google Sheets and pings Telegram on a strong match.", stack: ["n8n", "OpenAI", "Google Sheets", "Telegram"], lang: null, year: 2025, category: "ai" },
  { name: "Paraphrasing-Using-ollama", title: "Local LLM paraphrasing at scale", summary: "Paraphrases large medical Excel datasets with LLaMA 3.2 on Ollama inside WSL: batched rows, local HTTP calls, resume-from-checkpoint for long runs, no external API.", stack: ["Python", "Ollama", "LLaMA 3.2", "WSL", "pandas"], lang: "Python", year: 2025, category: "ai" },
  { name: "Stock_portfolio", title: "Trading data assistant", summary: "Streamlit chatbot on GPT-4 that answers only from uploaded trades and holdings CSVs: fund performance by YTD P&L, holdings counts, trade statistics.", stack: ["Python", "Streamlit", "OpenAI GPT-4", "pandas"], lang: "Python", year: 2026, category: "ai" },
  { name: "WebScraping_to_gather_website_details", title: "BuySM product scraper", summary: "Selenium crawls all 218 product-list pages of buysm.com, then pandas cleans the messy output into a structured spreadsheet.", stack: ["Python", "Selenium", "pandas", "openpyxl"], lang: "Python", year: 2025, category: "ai", private: true },
  { name: "Prop-Content-OS", title: "Prop Content OS", summary: "A content operating system for property marketing. Repository initialised; build in progress.", stack: ["Planning"], lang: null, year: 2026, category: "ai" },

  // ── Products & platforms ────────────────────────────────────────────────
  { name: "vitacount", title: "VitaCount", summary: "A financial operating system for US small businesses: a Postgres ledger whose trigger refuses unbalanced journal entries, a pure-function posting engine, Supabase RLS multi-tenancy, and Claude tool-calling agents.", stack: ["Next.js", "Supabase", "Postgres", "Claude API", "Plaid", "Stripe"], lang: "TypeScript", year: 2026, category: "product", fork: true },
  { name: "Vitacount-v2", title: "VitaCount v2", summary: "The next iteration of VitaCount's architecture. Private, in progress.", stack: ["Next.js", "Supabase"], lang: null, year: 2026, category: "product", private: true },
  { name: "customex-hub", title: "Customex Hub", summary: "Work-from-home agent vetting and onboarding platform for a client: a seven-step funnel from registration to a training cohort. Private client project.", stack: ["Next.js 15", "Supabase", "Inngest", "Stripe", "Claude"], lang: "TypeScript", year: 2026, category: "product", private: true, fork: true },
  { name: "Golf_charity", title: "GolfGives", summary: "Subscription platform where golf scores enter members into monthly prize draws while funding charities: FastAPI with JWT refresh tokens, Stripe checkout, leaderboard and an admin console.", stack: ["React", "FastAPI", "MongoDB", "Stripe", "JWT"], lang: "JavaScript", year: 2026, category: "product", live: "https://golf-charity-beryl.vercel.app" },
  { name: "Golf-Charity-Subscription-Platform", title: "Golf charity subscription platform", summary: "The private working copy of GolfGives: draws, charities, plans and role-guarded routes.", stack: ["React", "FastAPI", "Stripe"], lang: "JavaScript", year: 2026, category: "product", private: true },
  { name: "finance-toolkit", title: "Finance Toolkit", summary: "17 free financial calculators (SIP, EMI, FD, retirement, GST and more) with a live crypto and FX ticker, 16 currencies and a scroll-expanding hero.", stack: ["React 19", "TypeScript", "Vite 8", "Tailwind v4", "framer-motion"], lang: "TypeScript", year: 2026, category: "product" },
  { name: "student_registration", title: "Student registration system", summary: "Registration with webcam photo capture and retake, live validation and roll-number uniqueness checks, on an Express API and Supabase.", stack: ["React", "TypeScript", "Express", "Supabase"], lang: "TypeScript", year: 2025, category: "product", private: true },
  { name: "Himalayan_Snow_Monitor", title: "Himalayan Snow Monitor", summary: "Map-based snow cover monitor with a control panel, onboarding tour and theme context, backed by Supabase.", stack: ["React", "TypeScript", "Supabase", "Tailwind"], lang: "TypeScript", year: 2025, category: "product", private: true },
  { name: "Snow_Monitor", title: "Snow Monitor", summary: "The public build of the snow monitor: interactive map display, help panel and loading states.", stack: ["React", "TypeScript", "Supabase"], lang: "TypeScript", year: 2025, category: "product" },
  { name: "info-stream-news-app", title: "Info Stream news aggregator", summary: "A Flask news aggregator with a written deployment guide comparing an Ngrok tunnel with cloud hosting on Render.", stack: ["Python", "Flask", "News API"], lang: "HTML", year: 2025, category: "product" },
  { name: "flask-signup-mongodb-app", title: "Flask signup on MongoDB Atlas", summary: "A Flask signup flow storing users in MongoDB Atlas through pymongo, with secrets in environment variables and a setup script.", stack: ["Python", "Flask", "MongoDB Atlas", "Bootstrap"], lang: "Python", year: 2025, category: "product" },
  { name: "Instagram-feed-flutter", title: "Instagram feed in Flutter", summary: "A pixel-close Flutter home feed: stories tray, carousels, shimmer loading, pinch-to-zoom with spring-back, infinite scroll and double-tap to like.", stack: ["Flutter", "Dart"], lang: "Dart", year: 2026, category: "product" },

  // ── Websites, 3D & client work ──────────────────────────────────────────
  { name: "the-Shantiban-city-3d-render", title: "Shantiban City 3D walkthrough", summary: "Browser walkthrough of a real 220-plot township: boundary traced from the master plan, a build that fails if plot numbers skip, a raymarched sky set to Tapna's latitude, and wind shared by grass, leaves and shadows.", stack: ["three.js r160", "esbuild", "WebGL", "Playwright"], lang: "JavaScript", year: 2026, category: "web", live: "https://walkthrough.mrityikaestates.com" },
  { name: "M", title: "Shantiban City website", summary: "The sales site for Shantiban City in Baruipur: bilingual English/Bengali pages, plot guides, a fact sheet, llms.txt, and LiveKit and MongoDB on the server side.", stack: ["Next.js (static)", "LiveKit", "MongoDB", "Netlify"], lang: "HTML", year: 2026, category: "web" },
  { name: "MRITYIKA-REALTERS-OPC-PRIVATE-LIMITED", title: "Mrityika Realters site", summary: "The static build of the Mrityika Realters / Shantiban City website.", stack: ["Next.js export", "HTML"], lang: "HTML", year: 2026, category: "web", live: "https://mrityikaestates.com" },
  { name: "webgrow360_AI", title: "WebGrow360 .AI, the Intell//gence Edition", summary: "An editorial site where each AI service is a chapter opening on an old-master painting: a three-layer Creation of Adam hero, WebGL torn-paper edges and shatter transitions, on one shared scroll engine.", stack: ["Next.js 16", "React 19", "three.js", "Lenis", "ThreeUI"], lang: "TypeScript", year: 2026, category: "web", live: "https://ai.webgrow360.online" },
  { name: "webgrow360.online", title: "WebGrow360 website", summary: "The agency's live site: hand-built HTML with GSAP and Lenis, an industry portfolio with rotate-and-stack scroll, a 'Soul Mode' canvas, and a PHP enquiry endpoint writing to MongoDB Atlas.", stack: ["HTML", "Tailwind", "GSAP", "Lenis", "PHP", "MongoDB"], lang: "HTML", year: 2026, category: "web", live: "https://webgrow360.online" },
  { name: "realestate.webgrow360.online", title: "WebGrow360 real estate", summary: "A marketing site for a real estate growth partner: seven disciplines on one desk, fully prerendered as a static export.", stack: ["Next.js", "Lenis", "motion", "Tailwind v4"], lang: "TypeScript", year: 2026, category: "web", private: true, fork: true, live: "https://realestate.webgrow360.online" },
  { name: "WebGrow360", title: "WebGrow360 v1, full stack", summary: "The first agency site: React and Vite with 20 service pages, WhatsApp lead capture, and an Express + Prisma backend, shipped in Docker.", stack: ["React", "Vite", "Express", "Prisma", "Docker"], lang: "TypeScript", year: 2025, category: "web", live: "https://webgroww360.netlify.app" },
  { name: "webgrw360_exl_Integration", title: "WebGrow360 lead and visit tracking", summary: "The agency site extended with Netlify Functions that store leads and visits in MongoDB, a floating lead form, and canvas and 3D-orb ambient effects.", stack: ["React", "Netlify Functions", "MongoDB", "Tailwind"], lang: "TypeScript", year: 2025, category: "web" },
  { name: "IOS", title: "Institute of Sales", summary: "Static site for a sales education institute: certificate, diploma and advanced diploma programmes from ₹999.", stack: ["Next.js export"], lang: "HTML", year: 2026, category: "web", private: true },
  { name: "realestate-site1", title: "Real estate application", summary: "Property landing app with a hero slider, an investment calculator, configurations, amenities, location advantages, a custom cursor and an intro mascot.", stack: ["Next.js", "GSAP", "framer-motion", "Tailwind"], lang: "TypeScript", year: 2026, category: "web", fork: true },
  { name: "websiteeeeee", title: "Real estate site, working copy", summary: "A private iteration of the real estate application with interactive grid and FAQ sections.", stack: ["Next.js", "GSAP", "motion"], lang: "TypeScript", year: 2026, category: "web", private: true },
  { name: "My_Portfolio", title: "Portfolio, 2025 edition", summary: "The previous portfolio: dark single page with a Three.js hero, auto-scrolling project slider, timeline and cursor-follow glow, deployed on Netlify.", stack: ["React", "Three.js", "framer-motion", "Tailwind"], lang: "JavaScript", year: 2025, category: "web" },
  { name: "Kaushik-s-Portfolio", title: "Portfolio for Koushik Chowdary", summary: "A portfolio built for a data scientist: a 3D particle field hero, orbiting skill clusters and interactive 3D project cards.", stack: ["React", "React Three Fiber", "framer-motion"], lang: "TypeScript", year: 2025, category: "web" },

  // ── Learning & experiments ──────────────────────────────────────────────
  { name: "Brute-Force-simulator-", title: "Recursive brute-force simulator", summary: "An algorithm visualiser that 'cracks' a string you type using only recursion and backtracking, showing the stack grow frame by frame and comparing two search strategies.", stack: ["React", "TypeScript", "Vite", "Tailwind"], lang: "TypeScript", year: 2026, category: "learn" },
  { name: "figma_clon", title: "Real-time Figma clone", summary: "A collaborative canvas with live cursors, comments and shapes on Fabric.js and Liveblocks, built along the JavaScript Mastery tutorial.", stack: ["Next.js", "Liveblocks", "Fabric.js", "Radix"], lang: "TypeScript", year: 2024, category: "learn" },
  { name: "sayakr428", title: "GitHub profile README", summary: "The profile README, with a Python script and a GitHub Action that redraw the activity graph.", stack: ["Python", "GitHub Actions"], lang: "Python", year: 2025, category: "learn" },
  { name: "python-for-devops", title: "Python for DevOps coursework", summary: "Exercises from the Python for DevOps (AI edition) course: CPU checks, environment checks, file I/O and API calls.", stack: ["Python"], lang: "Python", year: 2025, category: "learn", fork: true },
  { name: "py_prac", title: "Python practice", summary: "Practice scripts for lists, dictionaries and calling REST and weather APIs.", stack: ["Python", "requests"], lang: "Python", year: 2026, category: "learn" },
  { name: "Covid19-Testing-DBMS", title: "Covid-19 testing management system", summary: "A university DBMS project for patient, test and phlebotomist records, with date-range reports and an admin dashboard.", stack: ["PHP", "MySQL", "Bootstrap"], lang: "CSS", year: 2022, category: "learn" },
  { name: "face-recognition", title: "Face detection", summary: "OpenCV Haar-cascade face detection on still images, from an AI mini project.", stack: ["Python", "OpenCV"], lang: "Python", year: 2022, category: "learn" },
  { name: "blackjac", title: "Blackjack in Tkinter", summary: "Early Python experiments toward a Tkinter blackjack game.", stack: ["Python", "Tkinter"], lang: "Python", year: 2024, category: "learn" },
  { name: "sketchpy", title: "sketchpy", summary: "A placeholder for Python sketch-drawing experiments.", stack: ["Python"], lang: null, year: 2022, category: "learn" },
  { name: "onlineMobilerecharge", title: "Online mobile recharge portal", summary: "An archived recharge portal project, kept as a zip.", stack: ["Web"], lang: null, year: 2021, category: "learn" },
  { name: "awesome-github-profile-readme", title: "Awesome GitHub Profile README", summary: "A fork of the curated list of profile READMEs, kept for reference.", stack: ["Markdown"], lang: null, year: 2026, category: "learn", fork: true },
] as const satisfies readonly Repo[];

// Compile-time guard: there must be exactly 45 repositories listed.
type Len<T extends readonly unknown[]> = T["length"];
const _count: Len<typeof REPOS> = 45;
void _count;

export type RepoName = (typeof REPOS)[number]["name"];
export const byName = (n: RepoName): Repo => REPOS.find((r) => r.name === n)!;
