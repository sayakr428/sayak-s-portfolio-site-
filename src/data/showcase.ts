/** The six builds as they stand in the WORKS scene, and how each one can be used inside the portfolio. */
export type Mode =
  | { kind: "live"; url: string; phone?: boolean }             // embeddable site, interactive in a device frame
  | { kind: "app"; screens: { label: string; img: string }[] }  // not deployed: its real screens, clickable
  | { kind: "still"; img: string; url: string; note: string }  // refuses embedding: screen + open link
  | { kind: "diagram" };                                       // internal tool: the live diagram

export type Build = {
  id: string; name: string; kind: string;
  screen: { x: number; y: number; w: number; h: number };    // % of the scene image
  hit: { x: number; y: number; w: number; h: number };       // larger click area around the device
  media: { video?: string; img?: string; diagram?: boolean };
  mode: Mode; also?: { label: string; url: string }[];
};

export const BUILDS: readonly Build[] = [
  { id: "stellar", name: "Stellar", kind: "SaaS · lighting studios",
    screen: { x: 12.06, y: 63.67, w: 7.52, h: 10.03 }, hit: { x: 10.5, y: 26, w: 12, h: 50 },
    media: { img: "/work/stellar.webp" },
    mode: { kind: "still", img: "/work/stellar.webp", url: "https://app.stellardesigns.solutions/", note: "Stellar's security settings don't allow it inside other sites, so it opens in its own tab." } },
  { id: "shantiban", name: "Shantiban City", kind: "3D township · three.js",
    screen: { x: 28.63, y: 63.61, w: 2.69, h: 10.48 }, hit: { x: 25.5, y: 26, w: 9, h: 50 },
    media: { video: "/live/walkthrough.mp4" },
    mode: { kind: "live", url: "https://walkthrough.mrityikaestates.com/" },
    also: [{ label: "Sales site", url: "https://mrityikaestates.com/" }] },
  { id: "derq", name: "Derq Ops", kind: "Internal platform · Derq",
    screen: { x: 42.15, y: 60.81, w: 10.76, h: 11.85 }, hit: { x: 40.5, y: 26, w: 14, h: 50 },
    media: { diagram: true },
    mode: { kind: "diagram" } },
  { id: "vitacount", name: "MyChiffre", kind: "Fintech SaaS",
    screen: { x: 58.03, y: 55.08, w: 13.15, h: 13.54 }, hit: { x: 56.5, y: 26, w: 16, h: 50 },
    media: { img: "/work/mc-dashboard.jpg" },
    mode: { kind: "app", screens: [{ label: "Dashboard", img: "/work/mc-dashboard.jpg" }, { label: "Ledger", img: "/work/mc-ledger.jpg" }, { label: "Agents", img: "/work/mc-agents.jpg" }, { label: "Sales", img: "/work/mc-sales.jpg" }] } },
  { id: "webgrow", name: "WebGrow360", kind: "Agency · four rebuilds",
    screen: { x: 75.8, y: 64.91, w: 2.51, h: 8.14 }, hit: { x: 73, y: 26, w: 9, h: 50 },
    media: { video: "/live/webgrow.mp4" },
    mode: { kind: "live", url: "https://webgrow360.online/", phone: true },
    also: [{ label: "Real estate desk", url: "https://realestate.webgrow360.online/" }] },
  { id: "webgrow-ai", name: "WebGrow .AI", kind: "AI agency · WebGL",
    screen: { x: 88.12, y: 59.9, w: 5.41, h: 13.02 }, hit: { x: 84, y: 26, w: 12, h: 50 },
    media: { video: "/live/webgrow-ai.mp4" },
    mode: { kind: "live", url: "https://ai.webgrow360.online/" } },
];

export const openProject = (id: string) => window.dispatchEvent(new CustomEvent<string>("project", { detail: id }));
