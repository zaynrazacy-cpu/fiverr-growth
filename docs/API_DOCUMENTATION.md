# FiverrGrowth AI: Complete API Documentation & System Manual

Welcome to the official API specification and system manual for **FiverrGrowth AI**. This document provides an exhaustive, production-grade guide covering:
1. **Real-time Logging & Observability Architecture** (ANSI terminal logs + disk logging)
2. **Every API Endpoint Specification** (Request/Response schemas, headers, status codes, internal flow)
3. **Live External Data Feeds & Real Research Pipeline** (Google Suggest, Remotive, Jobicy, GitHub API)
4. **Resilient AI Microservice & Self-Healing Architecture**
5. **Automated 15/15 Verification Suite Results**
6. **Interactive Swagger / OpenAPI UI**

Interactive Swagger UI is hosted at:  
👉 **`http://localhost:5000/api/docs`**

---

## 1. System Architecture & Observability

```
                      +------------------------------------------+
                      |         React 19 Frontend Client         |
                      |  (Tailwind v4, shadcn/ui, Three.js, GSAP)|
                      +--------------------+---------------------+
                                           | HTTP / REST (JWT Auth)
                                           v
+---------------------------------------------------------------------------------+
|                       Node.js + Express API Gateway                             |
|                           (Port: 5000 /api/v1)                                  |
|                                                                                 |
|  [HTTP Middleware Logger] --------> Logs to console & backend/logs/activity.log  |
|                                                                                 |
|  Controllers:                                                                   |
|   ├── Auth Controller       (Register, Login, /me Profile)                      |
|   ├── Strategist Controller (Onboarding Interview, Synthesis, Locked Context)   |
|   ├── Gigs Controller       (Context-Grounded 5-Tag SEO Gig Generation)         |
|   ├── Briefs Controller     (Live Remote Feeds & Pitch Generator)               |
|   └── Market Controller     (Google Suggest Queries, GitHub Repos, Saturation)  |
+-------------------+-----------------------------+-------------------------------+
                    |                             |
     Internal Calls | (JSON DB)                   | Microservice REST
                    v                             v
   +--------------------------------+   +------------------------------------+
   |   Persistent JSON Store        |   | Python FastAPI AI Orchestration    |
   |     (backend/data/store.json)  |   |        (Port: 8000)                |
   |  - Users & Credentials (bcrypt)|   |  ├── BriefMatcherAgent             |
   |  - Locked User Contexts        |   |  ├── GigSynthesizerAgent           |
   |  - Saved Gigs & Proposals      |   |  └── LLM Router (Groq/Gemini)      |
   |  - Market Research History     |   |  * Self-Healing Node.js Fallback   |
   +--------------------------------+   +------------------------------------+
                    |
                    v Live Multi-Source Research Engine
   +-------------------------------------------------------------------------+
   | - Google Suggest API (High-Intent Real Buyer Search Autocomplete)        |
   | - Remotive API & Jobicy API (Active Real-Time Remote Client Briefs)     |
   | - GitHub Search API (Trending Developer Tools, Libraries & Star Counts) |
   +-------------------------------------------------------------------------+
```

---

## 2. Real-Time Logging & Observability Engine

All incoming HTTP traffic, internal service orchestrations, external API network calls, and database operations are captured by the unified logger (`backend/src/utils/logger.ts`).

### 2.1 Log File Location
* **Disk Path:** `backend/logs/activity.log`
* **Console:** Full 256-color ANSI output formatted for developer terminals.

### 2.2 How to Watch Logs Live in Real-Time
Run the following command in any terminal while interacting with the platform:

**PowerShell (Windows):**
```powershell
Get-Content -Wait -Tail 50 backend/logs/activity.log
```

**Bash / Git Bash / macOS / Linux:**
```bash
tail -f backend/logs/activity.log
```

### 2.3 Log Tag Structure
Each log entry includes an ISO timestamp, a subsystem category tag, and operational details:
* `[HTTP]`: Method, route path, HTTP status code, duration in milliseconds, and request body preview (passwords automatically masked as `******`).
* `[AUTH]`: Registration events, password hashing, JWT issue, user credential verification.
* `[STRATEGIST]`: Diagnostic chat interview turns, context locking to user profile, market strategy generation.
* `[LIVE-RESEARCH]`: External calls to Google Suggest, Jobicy API, Remotive API, and GitHub Search API.
* `[AI-AGENT]`: Python FastAPI microservice invocations, prompt formatting, model routing, and self-healing fallback triggers.
* `[MARKETINTELLIGENCE]`: Real-time market metrics computation, opportunity score calculations, rate benchmarks.
* `[WARN]` / `[ERROR]`: Network timeouts, fallback engagements, or unhandled exceptions.

---

## 3. Comprehensive API Endpoints Specification

---

### Endpoint 1: System Health Check
* **Method & Path:** `GET /health`
* **Authentication:** None (Public)
* **Description:** Returns the live operational status of the server, uptime, memory consumption, and active subsystem indicators.
* **Headers:** `Accept: application/json`

#### Response Example (200 OK):
```json
{
  "status": "healthy",
  "service": "fiverr-growth-copilot-api",
  "version": "1.0.0",
  "timestamp": "2026-09-08T08:36:40.000Z",
  "subsystems": {
    "database": "online",
    "python_ai_bridge": "online_or_fallback_ready",
    "live_research_engine": "online"
  }
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:40] [HTTP] GET    /health                        200 (7ms)
  ```

---

### Endpoint 2: Register New Seller Account
* **Method & Path:** `POST /api/v1/auth/register`
* **Authentication:** None (Public)
* **Description:** Registers a new seller account. Validates email uniqueness, securely hashes the password using `bcrypt` (10 rounds), generates a signed JWT token (7-day validity), and records their Fiverr profile URL.
* **Headers:** `Content-Type: application/json`

#### Request Body Schema:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | string (min 3) | Yes | Seller display handle |
| `email` | string (email) | Yes | Unique login email |
| `password` | string (min 6) | Yes | Plaintext password to hash |
| `fiverr_profile_url` | string (URL) | No | Optional Fiverr profile URL |

#### Request Example:
```json
{
  "username": "zayn_studio",
  "email": "zayn@example.com",
  "password": "SuperSecretPassword123!",
  "fiverr_profile_url": "https://fiverr.com/zayn_dev"
}
```

#### Response Example (201 Created):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_1788856600657_va8pb",
    "username": "zayn_studio",
    "email": "zayn@example.com",
    "fiverr_profile_url": "https://fiverr.com/zayn_dev",
    "created_at": "2026-09-08T08:36:40.657Z"
  },
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_1788856600657_va8pb",
      "username": "zayn_studio",
      "email": "zayn@example.com",
      "fiverr_profile_url": "https://fiverr.com/zayn_dev",
      "created_at": "2026-09-08T08:36:40.657Z"
    }
  }
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:40] [AUTH] REGISTER -> New user registered successfully: [usr_1788856600657_va8pb] zayn_studio (zayn@example.com)
  [2026-09-08 08:36:40] [HTTP] POST   /api/v1/auth/register          201 (198ms) - {"username":"zayn_studio","email":"zayn@example.com"...}
  ```

---

### Endpoint 3: User Login
* **Method & Path:** `POST /api/v1/auth/login`
* **Authentication:** None (Public)
* **Description:** Verifies user credentials against the persistent store using `bcrypt.compare`. On success, issues a signed JWT token.
* **Headers:** `Content-Type: application/json`

#### Request Body Schema:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | string | Optional* | User login email (*either email or username required) |
| `username` | string | Optional* | User login username |
| `emailOrUsername` | string | Optional* | Unified login identifier |
| `password` | string | Yes | Plaintext password |

#### Request Example:
```json
{
  "email": "zayn@example.com",
  "password": "SuperSecretPassword123!"
}
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_1788856600657_va8pb",
    "username": "zayn_studio",
    "email": "zayn@example.com",
    "fiverr_profile_url": "https://fiverr.com/zayn_dev",
    "created_at": "2026-09-08T08:36:40.657Z"
  },
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_1788856600657_va8pb",
      "username": "zayn_studio",
      "email": "zayn@example.com",
      "fiverr_profile_url": "https://fiverr.com/zayn_dev",
      "created_at": "2026-09-08T08:36:40.657Z"
    }
  }
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:40] [AUTH] LOGIN -> User authenticated: [usr_1788856600657_va8pb] zayn_studio
  [2026-09-08 08:36:40] [HTTP] POST   /api/v1/auth/login             200 (181ms) - {"email":"zayn@example.com","password":"******"}
  ```

---

### Endpoint 4: Get Authenticated User Profile
* **Method & Path:** `GET /api/v1/auth/me`
* **Authentication:** Required (`Authorization: Bearer <token>`)
* **Description:** Decodes the JWT token from the Authorization header and returns the authenticated seller's profile and locked context status.

#### Response Example (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "usr_1788856600657_va8pb",
    "username": "zayn_studio",
    "email": "zayn@example.com",
    "fiverr_profile_url": "https://fiverr.com/zayn_dev",
    "created_at": "2026-09-08T08:36:40.657Z"
  }
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:40] [HTTP] GET    /api/v1/auth/me                200 (4ms)
  ```

---

### Endpoint 5: Growth Strategist Diagnostic Interview Turn
* **Method & Path:** `POST /api/v1/strategist/interview` (also aliases `POST /api/v1/onboarding/message`)
* **Authentication:** Optional
* **Description:** Conducts a conversational diagnostic interview. The AI agent asks the seller about their background, extracts tech skills and target niches, challenges saturated service ideas (e.g. generic WordPress sites), and suggests high-ticket, underserved angles.
* **Headers:** `Content-Type: application/json`

#### Request Example:
```json
{
  "message": "I am a full-stack engineer building Next.js apps and Python chatbots. My Fiverr handle is https://fiverr.com/users/dev_zaynee",
  "history": [
    { "role": "agent", "content": "Welcome! Who are you and what services do you want to build on Fiverr?" }
  ]
}
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "data": {
    "reply": "Excellent foundation. While generic web development is crowded on Fiverr, combining Next.js with Python AI chatbots offers high average order values ($150-$500). Let's review what specific tools you work with (e.g. LangChain, OpenAI, FastAPI) so we can craft your unfair advantage.",
    "extracted_data": {
      "name": "Zayn",
      "fiverr_url": "https://fiverr.com/users/dev_zaynee",
      "skills": "Next.js, Python, Chatbots",
      "intended_gigs": "Next.js web apps, Python AI chatbots"
    }
  }
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:40] [STRATEGIST] INTERVIEW_TURN -> Processing interview turn (Messages: 2)
  [2026-09-08 08:36:40] [HTTP] POST   /api/v1/strategist/interview   200 (29ms)
  ```

---

### Endpoint 6: Synthesize & Lock Market Strategy Blueprint
* **Method & Path:** `POST /api/v1/strategist/synthesize` (also aliases `POST /api/v1/onboarding/synthesize-strategy`)
* **Authentication:** Optional (accepts `user_id` or uses authenticated session)
* **Description:** Synthesizes a market strategy roadmap including target niches, high-demand gig recommendations, pricing tiers, and competitive USPs. **Permanently locks** this blueprint to the user's ID in `backend/data/store.json` so all downstream gig generation and proposal crafting tools leverage this context automatically.
* **Headers:** `Content-Type: application/json`

#### Request Example:
```json
{
  "user_id": "usr_1788856600657_va8pb",
  "fullName": "Zayn Raza",
  "fiverrUrl": "https://fiverr.com/users/dev_zaynee",
  "experience": "5+ years full stack engineering",
  "skills": ["Next.js", "React", "Python", "FastAPI", "AI Chatbot", "LangChain"],
  "intendedGigs": ["Full Stack Next.js SaaS", "Custom AI Chatbot with Knowledge Base"]
}
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "data": {
    "target_niches": [
      "AI Chatbot & Automation",
      "Full-Stack Web App Development"
    ],
    "recommended_gigs": [
      {
        "title": "I will build a custom AI chatbot with Next.js, FastAPI and LangChain",
        "niche": "AI Chatbot & Automation",
        "demand_score": 96,
        "avg_ticket_price": "$250 - $600",
        "differentiation_angle": "RAG-powered with custom business knowledge base integration"
      },
      {
        "title": "I will develop a production Next.js 15 web application with modern UI",
        "niche": "Full-Stack Web App Development",
        "demand_score": 92,
        "avg_ticket_price": "$300 - $800",
        "differentiation_angle": "Ultra-fast SSR with Tailwind, shadcn/ui and PostgreSQL backend"
      }
    ],
    "profile_positioning": {
      "recommended_title": "Full-Stack Web & AI Automation Engineer",
      "usp": "Enterprise-grade architecture with 24-hr turnaround.",
      "target_audience": "SMBs and Startups looking for AI-powered web solutions"
    },
    "market_analysis": {
      "demand_level": "High Demand (94/100)",
      "competition_density": "Low Saturation in custom AI agents",
      "pricing_strategy": "Value-based pricing targeting $200+ minimum orders"
    },
    "actionable_roadmap": [
      "Launch primary AI chatbot gig using provided SEO tags",
      "Apply to buyer briefs with tailored RAG demo portfolio links",
      "Maintain 1-hour response time to trigger Fiverr algorithm promotion"
    ],
    "anti_patterns_to_avoid": [
      "Do NOT create generic 'I will build WordPress site' gigs",
      "Avoid $5-$10 race-to-the-bottom pricing"
    ]
  }
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:40] [STRATEGIST] SYNTHESIZE -> Generating market strategy blueprint for user [usr_1788856600657_va8pb] Zayn Raza
  [2026-09-08 08:36:40] [STRATEGIST] CONTEXT_LOCKED -> Locked context & market roadmap to User ID [usr_1788856600657_va8pb]
  [2026-09-08 08:36:40] [HTTP] POST   /api/v1/strategist/synthesize  200 (18ms)
  ```

---

### Endpoint 7: Retrieve Locked User Blueprint Context
* **Method & Path:** `GET /api/v1/strategist/context/:userId` (also aliases `GET /api/v1/user/context`)
* **Authentication:** Optional
* **Description:** Retrieves the active user's persistent profile, skills, verified Fiverr URL, and synthesized market strategy roadmap from the database.

#### Response Example (200 OK):
```json
{
  "success": true,
  "context": {
    "userId": "usr_1788856600657_va8pb",
    "fullName": "Zayn Raza",
    "fiverrUrl": "https://fiverr.com/users/dev_zaynee",
    "skills": ["Next.js", "React", "Python", "FastAPI", "AI Chatbot", "LangChain"],
    "strategyBlueprint": {
      "target_niches": ["AI Chatbot & Automation", "Full-Stack Web App Development"],
      "recommended_gigs": [ ... ],
      "profile_positioning": { ... }
    },
    "lockedAt": "2026-09-08T08:36:40.000Z"
  }
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:40] [HTTP] GET    /api/v1/strategist/context/usr_1788856600657_va8pb 200 (2ms)
  ```

---

### Endpoint 8: Context-Grounded 5-Tag SEO Gig Generation
* **Method & Path:** `POST /api/v1/gigs/generate`
* **Authentication:** Optional
* **Description:** Generates a comprehensive, Fiverr-compliant SEO Gig package. Automatically queries **Google Suggest API** for real buyer search terms in real-time, weaves in the user's locked technical background, enforces exactly 5 high-converting search tags, produces 3-tier pricing (Basic, Standard, Premium), 1200-character description with markdown formatting, and 3 FAQs. Automatically saves to the database.
* **Headers:** `Content-Type: application/json`

#### Request Example:
```json
{
  "user_id": "usr_1788856600657_va8pb",
  "service_niche": "Production Next.js & AI Chatbot Development",
  "primary_skill": "Next.js, Python, FastAPI, LangChain",
  "experience_level": "Expert",
  "target_turnaround": "24 Hours"
}
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "gig_1788856601234_abc",
    "title": "I will build production next.js and ai chatbot web application",
    "category": "Programming & Tech -> Web Applications",
    "search_tags": ["ai chatbot", "next js", "fastapi", "web application", "python automation"],
    "description": "Looking for a high-converting web app or custom AI chatbot? I specialize in building enterprise-grade Next.js and Python FastAPI solutions...\n\nWhy choose me:\n- 100% clean, modular code\n- Custom RAG knowledge base integration\n- 24-hour rapid delivery available",
    "packages": {
      "basic": {
        "name": "Starter AI Setup",
        "description": "Single-page responsive Next.js frontend with basic chatbot integration",
        "price_usd": 50,
        "delivery_days": 2,
        "revisions": 2
      },
      "standard": {
        "name": "Standard AI Application",
        "description": "Complete full-stack Next.js app with FastAPI backend and vector database",
        "price_usd": 150,
        "delivery_days": 3,
        "revisions": 3
      },
      "premium": {
        "name": "Enterprise AI SaaS",
        "description": "Production-ready web application with auth, Stripe, custom LLM agents & 24/7 support",
        "price_usd": 350,
        "delivery_days": 5,
        "revisions": 5
      }
    },
    "faqs": [
      {
        "question": "Can you connect the AI chatbot to my custom private company files?",
        "answer": "Yes! I implement Retrieval-Augmented Generation (RAG) using vector databases so your chatbot answers questions accurately from your documents."
      }
    ],
    "seo_score": 96.5,
    "user_id": "usr_1788856600657_va8pb",
    "created_at": "2026-09-08T08:36:41.000Z"
  }
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:41] [LIVE-RESEARCH] GoogleSuggest -> Harvested 11 live buyer queries for "Production Next.js & AI Chatbot Development"
  [2026-09-08 08:36:41] [AI-AGENT] GigSynthesizer -> Initiating gig generation for niche "Production Next.js & AI Chatbot Development"
  [2026-09-08 08:36:41] [HTTP] POST   /api/v1/gigs/generate          200 (554ms)
  ```

---

### Endpoint 9: List Saved Gigs
* **Method & Path:** `GET /api/v1/gigs`
* **Authentication:** Optional (filters by `user_id` query param or returns stored gigs)
* **Description:** Retrieves all generated gigs stored in the database.

#### Response Example (200 OK):
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "gig_1788856601234_abc",
      "title": "I will build production next.js and ai chatbot web application",
      "search_tags": ["ai chatbot", "next js", "fastapi", "web application", "python automation"],
      "packages": { ... },
      "seo_score": 96.5,
      "created_at": "2026-09-08T08:36:41.000Z"
    }
  ]
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:41] [HTTP] GET    /api/v1/gigs                   200 (4ms)
  ```

---

### Endpoint 10: Multi-Source Real Live Client Briefs Stream
* **Method & Path:** `GET /api/v1/briefs/live`
* **Authentication:** None (Public)
* **Description:** Connects directly to external remote job and client brief feeds (Jobicy API and Remotive API). Extracts real hiring opportunities with client budgets, company names, URLs, and skill tags, filtering by developer niches.
* **Query Parameters:**
  * `tag` (string, optional, default: `"developer"`): Technology or niche filter (e.g. `react`, `python`, `dev`).
  * `limit` (number, optional, default: `10`): Maximum results to return.

#### Response Example (200 OK):
```json
{
  "success": true,
  "source": "live_multi_feed (Jobicy + Remotive)",
  "total": 14,
  "data": [
    {
      "id": "remotive_123456",
      "title": "Full Stack Engineer - AI & React",
      "company": "NextGen Technologies",
      "budget": "$120,000 - $150,000 / Freelance Equivalent $60-$80/hr",
      "description": "Looking for an engineer experienced in Next.js and Python backends to build our conversational AI dashboard...",
      "skills": ["react", "nextjs", "python", "ai"],
      "published_at": "2026-09-08T06:00:00.000Z",
      "source_url": "https://remotive.com/remote-jobs/software-dev/..."
    }
  ]
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:42] [LIVE-RESEARCH] JobicyAPI -> Extracted 6 active jobs for tag "dev"
  [2026-09-08 08:36:42] [LIVE-RESEARCH] RemotiveAPI -> Extracted 17 active client opportunities
  [2026-09-08 08:36:42] [LIVE-RESEARCH] BriefsAggregate -> Returning 14 unified real-time client opportunities
  [2026-09-08 08:36:42] [HTTP] GET    /api/v1/briefs/live?tag=developer&limit=6 200 (1271ms)
  ```

---

### Endpoint 11: Context-Grounded Proposal Synthesis
* **Method & Path:** `POST /api/v1/briefs/propose`
* **Authentication:** Optional
* **Description:** Crafts a tailored, high-converting buyer pitch in response to any client brief. Automatically adheres to proven freelance rules: **no generic greetings**, immediate demonstration of technical understanding in sentence 1, a concise 3-step action roadmap, recommended delivery days, and suggested bid price based on market rates. If `user_id` is supplied, it personalizes the proposal with the seller's locked tech stack.
* **Headers:** `Content-Type: application/json`

#### Request Example:
```json
{
  "user_id": "usr_1788856600657_va8pb",
  "brief_text": "Need a developer to build an automated AI customer chatbot and integrate it into our Next.js web portal.",
  "buyer_budget": "$350",
  "urgency": "3 days"
}
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "prop_1788856602345_def",
    "proposal_text": "I noticed you need an automated AI customer chatbot integrated into your Next.js web portal. Here is my exact implementation plan:\n\n1. Connect OpenAI or Anthropic API via a streaming FastAPI backend with vector embeddings.\n2. Build responsive chat widget components using Next.js and Tailwind with real-time markdown rendering.\n3. Integrate rate limiting, session persistence, and custom fallback prompts.\n\nI have completed similar Next.js + AI integrations. Let me know your preferred vector DB (e.g. Pinecone/Supabase) and we can start immediately.",
    "suggested_bid_usd": 350,
    "recommended_delivery_days": 3,
    "key_selling_hook": "Production streaming architecture with zero latency degradation",
    "confidence_score": 0.96,
    "brief_id": "brief_custom_001",
    "user_id": "usr_1788856600657_va8pb",
    "created_at": "2026-09-08T08:36:42.000Z"
  }
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:42] [AI-AGENT] BriefMatcher -> Generating tailored proposal for brief: "Need a developer to build an automated AI cus..."
  [2026-09-08 08:36:42] [HTTP] POST   /api/v1/briefs/propose         200 (32ms)
  ```

---

### Endpoint 12: List Saved Proposals
* **Method & Path:** `GET /api/v1/briefs`
* **Authentication:** Optional
* **Description:** Returns all saved proposals and bids created by the user.

#### Response Example (200 OK):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "prop_1788856602345_def",
      "proposal_text": "I noticed you need an automated AI customer chatbot...",
      "suggested_bid_usd": 350,
      "recommended_delivery_days": 3,
      "created_at": "2026-09-08T08:36:42.000Z"
    }
  ]
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:42] [HTTP] GET    /api/v1/briefs                 200 (4ms)
  ```

---

### Endpoint 13: Live Multi-Source Market Intelligence
* **Method & Path:** `GET /api/v1/market/intelligence`
* **Authentication:** None (Public)
* **Description:** Harvests real-time market data across 4 independent sources:
  1. **Google Suggest API:** Real buyer searches and intent autocomplete queries.
  2. **Jobicy & Remotive APIs:** Real active hiring postings and client opportunities.
  3. **GitHub Search API:** High-star open-source developer tools, SDKs, and templates in this niche.
  4. **Dynamic Rates Engine:** Average hourly/project rates and market health score (0-100).
* **Query Parameters:**
  * `niche` (string, optional, default: `"web development"`): Target service keyword.

#### Response Example (200 OK):
```json
{
  "success": true,
  "niche": "ai chatbot",
  "data": {
    "opportunity_score": 99,
    "demand_level": "High Demand",
    "competition_level": "Low Saturation in custom AI agents",
    "live_buyer_queries": [
      "ai chatbot for website",
      "ai chatbot python",
      "ai chatbot open source",
      "ai chatbot builder",
      "ai chatbot integration react"
    ],
    "open_client_opportunities": 10,
    "pricing_benchmarks": {
      "entry_usd": 50,
      "median_usd": 250,
      "high_ticket_usd": 750,
      "estimated_hourly": "$45 - $95 / hr"
    },
    "trending_open_source_tools": [
      {
        "name": "langchain-ai/langchain",
        "stars": 98400,
        "description": "Building applications with LLMs through composability",
        "url": "https://github.com/langchain-ai/langchain"
      }
    ],
    "recommended_angles": [
      "Lead with custom knowledge-base (RAG) capabilities",
      "Provide plug-and-play embed script for Shopify/WordPress",
      "Emphasize zero data privacy leakage with local models"
    ]
  }
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:43] [MARKETINTELLIGENCE] Compiling multi-source real data report for "ai chatbot"...
  [2026-09-08 08:36:43] [LIVE-RESEARCH] GoogleSuggest -> Harvested 11 live buyer queries for "ai chatbot"
  [2026-09-08 08:36:43] [LIVE-RESEARCH] GitHubAPI -> Retrieved 6 open-source repositories matching "ai chatbot"
  [2026-09-08 08:36:43] [LIVE-RESEARCH] BriefsAggregate -> Returning 18 unified real-time client opportunities
  [2026-09-08 08:36:43] [MARKETINTELLIGENCE] Finished market report for "ai chatbot": Score 99/100
  [2026-09-08 08:36:43] [HTTP] GET    /api/v1/market/intelligence?niche=ai+chatbot 200 (925ms)
  ```

---

### Endpoint 14: Deep Niche Gap & Opportunity Analysis
* **Method & Path:** `POST /api/v1/research/niche`
* **Authentication:** Optional
* **Description:** Conducts deep competitor gap analysis and market sizing for any niche or skill combo. Saves the report to research history in the database.
* **Headers:** `Content-Type: application/json`

#### Request Example:
```json
{
  "niche": "AI Chatbot Automation",
  "skill_keywords": ["AI Chatbot", "FastAPI", "Next.js", "LangChain"]
}
```

#### Response Example (200 OK):
```json
{
  "success": true,
  "data": {
    "niche": "AI Chatbot Automation",
    "search_volume_score": 95,
    "competition_density": "Medium",
    "pricing_recommendation": "$150 - $500",
    "underserved_angles": [
      "Voice-enabled AI customer support",
      "Multi-tenant SaaS chatbot infrastructure",
      "WhatsApp business API + LLM integration"
    ],
    "recommended_search_tags": [
      "ai chatbot",
      "fastapi",
      "langchain",
      "python ai",
      "nextjs bot"
    ],
    "opportunity_score": 92.5
  }
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:44] [AI-AGENT] MarketSpy -> Analyzing market dynamics for: AI Chatbot, FastAPI, Next.js, LangChain
  [2026-09-08 08:36:44] [HTTP] POST   /api/v1/research/niche         200 (633ms)
  ```

---

### Endpoint 15: Retrieve Historical Niche Research
* **Method & Path:** `GET /api/v1/research/history`
* **Authentication:** Optional
* **Description:** Retrieves all previously run niche market intelligence scans and competitor reports from persistent storage.

#### Response Example (200 OK):
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "niche": "AI Chatbot Automation",
      "search_volume_score": 95,
      "opportunity_score": 92.5,
      "scanned_at": "2026-09-08T08:36:44.000Z"
    }
  ]
}
```
* **Log Sample:**
  ```text
  [2026-09-08 08:36:44] [HTTP] GET    /api/v1/research/history       200 (3ms)
  ```

---

## 4. End-to-End Test Execution Results

All 15 endpoints were verified via automated end-to-end integration tests (`backend/scripts/verify-all-apis.ts`):

| # | HTTP Method & Route | Status Code | Latency | Verification Details | Test Result |
| :-: | :--- | :-: | :-: | :--- | :-: |
| 1 | `GET /health` | `200 OK` | 50ms | System Health & Subsystem status check | ✅ PASS |
| 2 | `POST /api/v1/auth/register` | `201 Created` | 236ms | Register seller with bcrypt password & Fiverr URL | ✅ PASS |
| 3 | `POST /api/v1/auth/login` | `200 OK` | 191ms | Verify credentials and issue signed JWT token | ✅ PASS |
| 4 | `GET /api/v1/auth/me` | `200 OK` | 11ms | Authenticated profile retrieval via Bearer JWT | ✅ PASS |
| 5 | `POST /api/v1/strategist/interview` | `200 OK` | 40ms | Conversational diagnostic onboarding turn | ✅ PASS |
| 6 | `POST /api/v1/strategist/synthesize` | `200 OK` | 28ms | Synthesize roadmap & permanently lock context in DB | ✅ PASS |
| 7 | `GET /api/v1/strategist/context/:userId` | `200 OK` | 13ms | Fetch locked seller context and blueprint from DB | ✅ PASS |
| 8 | `POST /api/v1/gigs/generate` | `200 OK` | 571ms | Context-grounded 5-tag SEO gig + 3 tiers | ✅ PASS |
| 9 | `GET /api/v1/gigs` | `200 OK` | 30ms | Query user's stored gigs from database | ✅ PASS |
| 10 | `GET /api/v1/briefs/live?tag=developer` | `200 OK` | 1309ms | Multi-source live client briefs (Jobicy + Remotive) | ✅ PASS |
| 11 | `POST /api/v1/briefs/propose` | `200 OK` | 53ms | Context-tailored 3-step winning buyer proposal | ✅ PASS |
| 12 | `GET /api/v1/briefs` | `200 OK` | 21ms | Query saved client proposals from database | ✅ PASS |
| 13 | `GET /api/v1/market/intelligence?niche=ai+chatbot` | `200 OK` | 940ms | Real Google Suggest terms, GitHub tools & live rates | ✅ PASS |
| 14 | `POST /api/v1/research/niche` | `200 OK` | 650ms | Competitor gap analysis & search volume score | ✅ PASS |
| 15 | `GET /api/v1/research/history` | `200 OK` | 17ms | Query historical market analysis reports | ✅ PASS |

**Total Endpoints Tested:** 15  
**Passed:** 15  
**Failed:** 0  
**Overall Success Rate:** **100%**

---

## 5. Running the Tests Locally

To re-run any test suite at any time:

1. **Verify All 15 API Endpoints:**
   ```powershell
   cd backend
   npx tsx scripts/verify-all-apis.ts
   ```

2. **Run Backend Vitest Integration Suite:**
   ```powershell
   cd backend
   npm test
   ```

3. **Run Python AI Core Agents Test Suite:**
   ```powershell
   cd ai_orchestration
   .venv\Scripts\python -m pytest tests/
   ```

4. **Verify React Frontend TypeScript Compilation & Build:**
   ```powershell
   cd frontend
   npm run build
   ```
