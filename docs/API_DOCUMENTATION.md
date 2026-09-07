# FiverrGrowth AI: Complete API Documentation & Swagger Guide

Interactive Swagger UI is available at:
👉 **`http://localhost:5000/api/docs`**

---

## 1. Endpoints Reference

### 1.1 Generate Fiverr Gig
* **Route:** `POST /api/v1/gigs/generate`
* **Description:** Synthesizes an end-to-end Fiverr Gig with title, 5 search tags, 3-tier pricing packages, description, and FAQs.
* **Request Body (JSON):**
```json
{
  "service_niche": "Python Web Scraping & Lead Generation",
  "primary_skill": "Python, Playwright, Scrapy",
  "experience_level": "Expert",
  "target_turnaround": "24 Hours"
}
```
* **Response Body (JSON):**
```json
{
  "success": true,
  "data": {
    "id": "gig_1788814500000",
    "title": "I will build python web scraping bot for lead generation",
    "category": "Programming & Tech",
    "sub_category": "Data Scraping & Extraction",
    "search_tags": [
      "python scraper",
      "lead gen",
      "web scraping",
      "playwright",
      "scrapy bot"
    ],
    "description": "## Professional Python Web Scraping...\n\n### What I Deliver:\n- Error-handled custom code\n- High-speed performance...",
    "packages": {
      "basic": {
        "name": "Basic Script",
        "title": "Single Page Scraper",
        "description": "Extract data from 1 simple static website into CSV or Excel.",
        "delivery_days": 1,
        "price_usd": 25.0,
        "revisions": 1
      },
      "standard": {
        "name": "Standard Automation",
        "title": "Dynamic Multi-Page Scraper",
        "description": "Dynamic web scraper handling pagination, login, and anti-bot bypass.",
        "delivery_days": 2,
        "price_usd": 75.0,
        "revisions": 3
      },
      "premium": {
        "name": "Enterprise Pipeline",
        "title": "Full Automated Data Pipeline",
        "description": "Continuous scraping bot with proxy rotation, database storage, and cloud deployment.",
        "delivery_days": 4,
        "price_usd": 180.0,
        "revisions": 999
      }
    },
    "faqs": [
      {
        "question": "Can you handle sites with Cloudflare or CAPTCHA?",
        "answer": "Yes, I implement Playwright-stealth and automated captcha solvers."
      }
    ],
    "buyer_requirements": [
      "Target website URL",
      "List of exact fields/columns you need"
    ],
    "seo_score": 96.5,
    "createdAt": "2026-09-08T02:00:00.000Z"
  }
}
```

---

### 1.2 Get All Saved Gigs
* **Route:** `GET /api/v1/gigs`
* **Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [...]
}
```

---

### 1.3 Synthesize Buyer Brief Proposal
* **Route:** `POST /api/v1/briefs/propose`
* **Request Body (JSON):**
```json
{
  "brief_text": "Need a developer to scrape real estate listings from Redfin daily to CSV.",
  "buyer_budget": "$150",
  "urgency": "2 days",
  "user_skills": ["Python", "Playwright", "FastAPI"]
}
```
* **Response Body (JSON):**
```json
{
  "success": true,
  "data": {
    "id": "brief_1788814550000",
    "proposal_text": "I noticed you need to scrape real estate data from Zillow and export to CSV daily. Here is how I will do it:\n1. Use Playwright with rotating residential proxies...\n2. Clean and format the extracted data...\n3. Automate the scheduled daily export...\n\nLet me know what format you prefer and I can start today.",
    "suggested_bid_usd": 150.0,
    "recommended_delivery_days": 2,
    "key_selling_hook": "Anti-bot proxy rotation with guaranteed clean schema",
    "confidence_score": 0.95,
    "createdAt": "2026-09-08T02:00:00.000Z"
  }
}
```

---

### 1.4 Get All Generated Proposals
* **Route:** `GET /api/v1/briefs`
* **Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [...]
}
```

---

### 1.5 Analyze Niche Opportunity
* **Route:** `POST /api/v1/research/niche`
* **Request Body (JSON):**
```json
{
  "skill_keywords": ["Python scraper", "FastAPI bot"],
  "target_category": "Programming & Tech"
}
```
* **Response Body (JSON):**
```json
{
  "success": true,
  "data": {
    "target_keywords": [
      {
        "keyword": "Python scraper",
        "competition_level": "LOW",
        "avg_queue_count": 5,
        "opportunity_score": 92.0,
        "recommendation": "Target this keyword in the first 3 words of your gig title."
      }
    ],
    "pricing_benchmarks": {
      "avg_basic_price": 30.0,
      "avg_standard_price": 85.0,
      "avg_premium_price": 220.0,
      "recommended_entry_price": 25.0
    },
    "high_demand_gaps": [
      "Lack of fast 24-hour turnaround on basic scrapers"
    ],
    "strategic_advice": "Focus your gig title on solving anti-bot blocks...",
    "overall_niche_score": 89.5
  }
}
```
