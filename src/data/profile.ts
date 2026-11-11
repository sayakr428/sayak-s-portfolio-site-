export const PROFILE = {
  name: "Sayak Roy",
  role: "AI Automation & Platform Engineer",
  email: "sayakr428@gmail.com",
  linkedin: "https://www.linkedin.com/in/sayak--roy",
  github: "https://github.com/sayakr428",
  city: "Agartala, Tripura",
  country: "India",
  timezone: "Asia/Kolkata",
  resume: "/resume/Sayak_Roy_Resume.pdf",
} as const;

export type Hop = {
  org: string;
  role: string;
  place: string;
  span: string;
  /** years this hop lasted, shown as its "latency" */
  ms: string;
  points: readonly string[];
};

// Career as a traceroute, from where it started to now.
export const HOPS: readonly Hop[] = [
  {
    org: "Pranavananda Vidyamandir",
    role: "AISSE, Science",
    place: "Agartala, Tripura",
    span: "until 2019",
    ms: "—",
    points: ["Where it started: school in Agartala, Tripura, finishing the science stream in May 2019."],
  },
  {
    org: "SRM University",
    role: "B.Tech, Computer Science — Cyber Security",
    place: "Chennai, Tamil Nadu",
    span: "2019 – 2023",
    ms: "4 yrs",
    points: [
      "Specialised in cyber security; built a Covid-19 testing records system and an OpenCV face-detection mini project along the way.",
    ],
  },
  {
    org: "Accenture",
    role: "IT Consultant (Analyst intern)",
    place: "Bengaluru, Karnataka",
    span: "Mar 2022 – Jan 2023",
    ms: "11 mo",
    points: [
      "Built real-time campaign analytics dashboards in React, Tailwind CSS and Redux-Saga.",
      "Queried and pre-processed large datasets with Python, SQL and MongoDB to power interactive filtering.",
      "Tightened API structures and JSON payloads between backend services and dashboards, and helped define marketing KPIs.",
    ],
  },
  {
    org: "Tata Communications",
    role: "AI Infrastructure & Automation Engineer, Global IP & Ethernet Engineering",
    place: "Chennai, Tamil Nadu",
    span: "Apr 2023 – Dec 2025",
    ms: "2.7 yrs",
    points: [
      "Automated multi-vendor router configuration through the OpenDaylight SDN controller over NETCONF and RESTCONF, cutting manual provisioning effort by 80%.",
      "Built RESTful APIs that fetch live routing data and push configuration, improving operational efficiency by 30%.",
      "Designed YAML OpenConfig templates for BGP, OSPF, IS-IS and EIGRP across heterogeneous devices.",
      "Automated IRR-driven route paths and ASN lists with Python and bgpq3.",
      "Engineered LEO satellite KPI monitoring with distributed Raspberry Pi probes, Python ingestion and Chronograf dashboards.",
      "Built a containerised BGP monitoring stack on OpenBMP, Kafka, Zookeeper and PostgreSQL, and a conversational IaC pipeline on n8n, OpenAI/Gemini and Terraform Cloud.",
    ],
  },
  {
    org: "Derq",
    role: "Deployment & Maintenance Software Engineer",
    place: "Dubai, UAE (remote)",
    span: "Dec 2025 – now",
    ms: "now",
    points: [
      "Deploy, configure and maintain AI-powered Intelligent Transportation Systems across distributed edge sites with Linux, Docker and Python.",
      "Troubleshoot edge processors, RTSP/IP cameras, VPN, TCP/IP and SSH in production through log analysis and root-cause work.",
      "Built Derq Ops: one local app for daily site maintenance, with SSH health checks, backlog reports, camera-movement detection and an AI agent.",
    ],
  },
];

export const CAPABILITIES = [
  { area: "Network automation", tools: "OpenDaylight · NETCONF · RESTCONF · YANG · OpenConfig" },
  { area: "Routing", tools: "BGP · OSPF · IS-IS · EIGRP · IRR · bgpq3 · OpenBMP" },
  { area: "Cloud & IaC", tools: "AWS · Azure · Terraform · Ansible · CDK · CloudFormation" },
  { area: "Containers & CI/CD", tools: "Docker · Kubernetes · EKS · ECS · GitHub Actions · Jenkins · GitLab CI" },
  { area: "Telemetry", tools: "InfluxDB · Telegraf · Chronograf · Grafana · Prometheus · iperf3 · mtr" },
  { area: "AI workflows", tools: "n8n · OpenAI · Gemini · Claude · Ollama · LangChain" },
  { area: "Full stack", tools: "React · Next.js · Node · FastAPI · Flask · Supabase · MongoDB · Prisma" },
] as const;

export const CERTS = [
  "Google Cloud Professional Data Engineer",
  "Red Hat",
  "Designing and Implementing Azure AI Solutions",
  "Building Modern Python Applications on AWS",
  "Google IT Automation with Python",
  "Security Governance and Compliance",
  "React",
  "SQL",
] as const;

export const SPOKEN = [
  { lang: "Bengali", level: "Native" },
  { lang: "English", level: "Full professional" },
  { lang: "Hindi", level: "Full professional" },
  { lang: "German", level: "Limited working" },
] as const;
