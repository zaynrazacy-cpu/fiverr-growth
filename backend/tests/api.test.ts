import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("FiverrGrowth Backend Integration Tests", () => {
  it("GET /health should return healthy status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("healthy");
    expect(res.body.service).toBe("fiverr-growth-backend");
  });

  it("POST /api/v1/gigs/generate should generate and persist a complete Fiverr gig", async () => {
    const payload = {
      service_niche: "Python Web Scraping & Lead Generation",
      primary_skill: "Python, Playwright, Scrapy",
      experience_level: "Expert"
    };

    const res = await request(app).post("/api/v1/gigs/generate").send(payload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.title.toLowerCase()).toContain("i will");
    expect(res.body.data.packages.basic.price_usd).toBeGreaterThan(0);
    expect(res.body.data.packages.premium.price_usd).toBeGreaterThan(res.body.data.packages.basic.price_usd);
    expect(res.body.data.seo_score).toBeGreaterThanOrEqual(70);
  });

  it("GET /api/v1/gigs should retrieve persisted gigs", async () => {
    const res = await request(app).get("/api/v1/gigs");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/v1/briefs/propose should synthesize a winning proposal", async () => {
    const payload = {
      brief_text: "Need a developer to scrape real estate listings from Redfin daily to CSV.",
      buyer_budget: "$150",
      urgency: "2 days",
      user_skills: ["Python", "Playwright", "FastAPI"]
    };

    const res = await request(app).post("/api/v1/briefs/propose").send(payload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.proposal_text.length).toBeGreaterThan(40);
    expect(res.body.data.suggested_bid_usd).toBeGreaterThan(0);
    expect(res.body.data.recommended_delivery_days).toBeGreaterThanOrEqual(1);
  });

  it("POST /api/v1/research/niche should return market metrics and opportunity score", async () => {
    const payload = {
      skill_keywords: ["Python scraper", "FastAPI bot"],
      target_category: "Programming & Tech"
    };

    const res = await request(app).post("/api/v1/research/niche").send(payload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.target_keywords.length).toBeGreaterThan(0);
    expect(res.body.data.overall_niche_score).toBeGreaterThan(0);
  });
});
