import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("FiverrGrowth Backend End-to-End Suite", () => {
  let authToken = "";
  let testUserId = "";

  it("GET /health should return healthy status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("healthy");
  });

  it("POST /api/v1/auth/register should register a new user and return JWT", async () => {
    const testUser = {
      email: `freelancer_${Date.now()}@example.com`,
      username: `fiverrpro_${Date.now()}`,
      password: "Password123!"
    };

    const res = await request(app).post("/api/v1/auth/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);

    authToken = res.body.token;
    testUserId = res.body.user.id;
  });

  it("GET /api/v1/auth/me should return authenticated user profile", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.id).toBe(testUserId);
  });

  it("POST /api/v1/onboarding/message should return conversational guidance from Strategist", async () => {
    const payload = {
      messages: [
        { role: "user", content: "Hi, I am Alexander, a Python and Next.js developer with 4 years experience." }
      ]
    };

    const res = await request(app)
      .post("/api/v1/onboarding/message")
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.reply).toBeDefined();
    expect(res.body.reply.length).toBeGreaterThan(20);
  });

  it("POST /api/v1/onboarding/synthesize-strategy should lock in user context & market strategy", async () => {
    const payload = {
      fullName: "Alexander Wright",
      fiverrUrl: "https://www.fiverr.com/alexander_dev",
      experienceYears: "4 years",
      primarySkills: ["Python", "FastAPI", "Next.js", "AI Agents"],
      secondarySkills: ["PostgreSQL", "Docker", "Tailwind"],
      targetNiches: ["AI Chatbot Integration", "Full-stack MVP Development"]
    };

    const res = await request(app)
      .post("/api/v1/onboarding/synthesize-strategy")
      .set("Authorization", `Bearer ${authToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.onboardingCompleted).toBe(true);
    expect(res.body.data.marketStrategy.recommendedNiches.length).toBeGreaterThan(0);
    expect(res.body.data.marketStrategy.recommendedNiches[0].avgTicketPriceUSD).toBeGreaterThan(0);
  });

  it("GET /api/v1/user/context should return the locked user context", async () => {
    const res = await request(app)
      .get("/api/v1/user/context")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fullName).toBe("Alexander Wright");
    expect(res.body.data.fiverrUrl).toBe("https://www.fiverr.com/alexander_dev");
    expect(res.body.data.onboardingCompleted).toBe(true);
  });

  it("POST /api/v1/gigs/generate should use locked context to generate personalized gig", async () => {
    const payload = {
      service_niche: "AI Chatbot Integration for Shopify",
      primary_skill: "Python, FastAPI, OpenAI API",
      target_turnaround: "24 Hours"
    };

    const res = await request(app)
      .post("/api/v1/gigs/generate")
      .set("Authorization", `Bearer ${authToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.userId).toBe(testUserId);
    expect(res.body.data.title.toLowerCase()).toContain("i will");
  });

  it("POST /api/v1/briefs/propose should use locked user context to tailor proposal", async () => {
    const payload = {
      brief_text: "Need a developer to build an automated AI customer support chatbot for my store.",
      buyer_budget: "$200",
      urgency: "2 days"
    };

    const res = await request(app)
      .post("/api/v1/briefs/propose")
      .set("Authorization", `Bearer ${authToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.userId).toBe(testUserId);
    expect(res.body.data.proposal_text.length).toBeGreaterThan(40);
  });
});
