import request from "supertest";
import { app } from "../src/app.js";

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  gray: "\x1b[90m",
};

interface TestResult {
  endpoint: string;
  method: string;
  status: number;
  expectedStatus: number;
  durationMs: number;
  passed: boolean;
  notes: string;
  responseSnippet: string;
}

const results: TestResult[] = [];

async function testEndpoint(
  method: "GET" | "POST" | "PUT",
  path: string,
  expectedStatus: number,
  payload?: any,
  token?: string,
  notes: string = ""
) {
  const start = Date.now();
  let req = method === "GET"
    ? request(app).get(path)
    : method === "POST"
    ? request(app).post(path)
    : request(app).put(path);

  if (token) {
    req = req.set("Authorization", `Bearer ${token}`);
  }

  if (payload) {
    req = req.send(payload);
  }

  const res = await req;
  const durationMs = Date.now() - start;
  const passed = res.status === expectedStatus;

  let snippet = JSON.stringify(res.body);
  if (snippet.length > 110) {
    snippet = snippet.substring(0, 107) + "...";
  }

  results.push({
    endpoint: path,
    method,
    status: res.status,
    expectedStatus,
    durationMs,
    passed,
    notes,
    responseSnippet: snippet
  });

  const mark = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(
    ` ${mark} ${colors.bold}${method.padEnd(5)}${colors.reset} ${colors.cyan}${path.padEnd(42)}${colors.reset} Status: ${res.status} (${durationMs}ms) ${colors.gray}${notes}${colors.reset}`
  );

  return res.body;
}

async function runFullVerification() {
  console.log(`\n===============================================================`);
  console.log(`🧪 ${colors.bold}FiverrGrowth AI: Comprehensive 100% API Verification Suite${colors.reset}`);
  console.log(`===============================================================\n`);

  // 1. Health
  await testEndpoint("GET", "/health", 200, null, undefined, "System Health Check");

  // 2. Auth: Register
  const uniqueNum = Date.now();
  const regPayload = {
    username: `zayn_studio_${uniqueNum}`,
    email: `zayn_${uniqueNum}@example.com`,
    password: "Password123!",
    fiverr_profile_url: "https://fiverr.com/users/dev_zaynee"
  };
  const regRes = await testEndpoint("POST", "/api/v1/auth/register", 201, regPayload, undefined, "Register new seller with Fiverr URL");
  const token = regRes.token || regRes.data?.token;
  const userId = regRes.user?.id || regRes.data?.user?.id;

  // 3. Auth: Login
  const loginPayload = {
    email: regPayload.email,
    password: regPayload.password
  };
  await testEndpoint("POST", "/api/v1/auth/login", 200, loginPayload, undefined, "Authenticate with email & password");

  // 4. Auth: Profile Me
  await testEndpoint("GET", "/api/v1/auth/me", 200, null, token, "Retrieve authenticated session & profile");

  // 5. Strategist: Conversational Diagnostic Interview
  const interviewPayload = {
    message: "I am a full-stack engineer building Next.js apps and Python chatbots. My profile: https://fiverr.com/users/dev_zaynee",
    history: [
      { role: "agent", text: "Welcome! Tell me about yourself and your tech stack." }
    ]
  };
  await testEndpoint("POST", "/api/v1/strategist/interview", 200, interviewPayload, token, "Conversational Onboarding Interview turn");

  // 6. Strategist: Synthesize & Lock Market Blueprint
  const synthPayload = {
    fullName: "Zayn Raza",
    fiverrUrl: "https://fiverr.com/users/dev_zaynee",
    experienceYears: "4+ years",
    primarySkills: ["Next.js", "React", "Python FastAPI", "AI Chatbots"],
    secondarySkills: ["Tailwind CSS", "Docker", "PostgreSQL"],
    targetNiches: ["Custom Business AI Chatbots", "Full-Stack Web MVP"]
  };
  await testEndpoint("POST", "/api/v1/strategist/synthesize", 200, synthPayload, token, "Synthesize strategy & lock context in DB");

  // 7. Strategist: Retrieve Locked User Context
  await testEndpoint("GET", `/api/v1/strategist/context/${userId}`, 200, null, token, "Retrieve persistent locked user blueprint");

  // 8. Gig Generator: Synthesize SEO Gig
  const gigPayload = {
    service_niche: "Production Next.js & AI Chatbot Development",
    primary_skill: "Next.js, Python, FastAPI, OpenAI",
    experience_level: "Expert",
    target_turnaround: "24 Hours"
  };
  await testEndpoint("POST", "/api/v1/gigs/generate", 200, gigPayload, token, "Generate 5-tag SEO gig with pricing tiers");

  // 9. Gig Generator: List Saved Gigs
  await testEndpoint("GET", "/api/v1/gigs", 200, null, token, "List user's saved gigs in database");

  // 10. Buyer Briefs: Live External Jobs Feed (Jobicy + Remotive)
  await testEndpoint("GET", "/api/v1/briefs/live?tag=developer&limit=6", 200, null, token, "Multi-source live client briefs stream");

  // 11. Buyer Briefs: Propose Tailored Pitch
  const briefPayload = {
    brief_text: "Need a developer to build an automated AI customer chatbot and connect it to our Shopify store.",
    buyer_budget: "$350",
    urgency: "3 Days",
    user_skills: ["Python", "Next.js", "FastAPI", "Chatbots"]
  };
  await testEndpoint("POST", "/api/v1/briefs/propose", 200, briefPayload, token, "Craft tailored winning proposal");

  // 12. Buyer Briefs: List Generated Proposals
  await testEndpoint("GET", "/api/v1/briefs", 200, null, token, "List saved proposals in database");

  // 13. Market Research: Real Live Market Intelligence
  await testEndpoint("GET", "/api/v1/market/intelligence?niche=ai+chatbot", 200, null, token, "Harvest live Google queries, rates & GitHub tools");

  // 14. Market Research: Deep Niche Opportunity Analysis
  const researchPayload = {
    niche: "AI Chatbot Automation",
    skill_keywords: ["AI Chatbot", "FastAPI", "Next.js", "LangChain"]
  };
  await testEndpoint("POST", "/api/v1/research/niche", 200, researchPayload, token, "Deep niche opportunity & gap analysis");

  // 15. Market Research: History
  await testEndpoint("GET", "/api/v1/research/history", 200, null, token, "Retrieve historical market scans");

  // Summary
  console.log(`\n===============================================================`);
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  console.log(`📊 ${colors.bold}Verification Summary:${colors.reset} Total: ${total} | Passed: ${colors.green}${passed}${colors.reset} | Failed: ${failed > 0 ? colors.red + failed : colors.green + 0}${colors.reset}`);
  console.log(`===============================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runFullVerification().catch(console.error);
