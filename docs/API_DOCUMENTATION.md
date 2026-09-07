# FiverrGrowth AI: Complete API Documentation & Swagger Guide

Interactive Swagger UI is live at:
👉 **`http://localhost:5000/api/docs`**

---

## 1. Authentication Endpoints

### 1.1 User Registration
* **Route:** `POST /api/v1/auth/register`
* **Description:** Creates a persistent seller account, hashes the password via bcrypt, assigns a unique `user_id`, and returns a JWT token.
* **Request Body (JSON):**
```json
{
  "username": "Zayn Web & AI Studio",
  "email": "zayn@example.com",
  "password": "strongPassword123",
  "fiverr_profile_url": "https://fiverr.com/zayn_dev"
}
```
* **Response Body (JSON):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_1788814500123_abc",
      "username": "Zayn Web & AI Studio",
      "email": "zayn@example.com",
      "fiverr_profile_url": "https://fiverr.com/zayn_dev",
      "created_at": "2026-09-08T02:30:00.000Z"
    }
  }
}
```

### 1.2 User Login
* **Route:** `POST /api/v1/auth/login`
* **Description:** Verifies credentials, generates a new JWT token, and returns user profile.
* **Request Body (JSON):**
```json
{
  "email": "zayn@example.com",
  "password": "strongPassword123"
}
```

---

## 2. Growth Strategist & Diagnostic Agent Endpoints

### 2.1 Conversational Onboarding Turn
* **Route:** `POST /api/v1/strategist/interview`
* **Description:** Conducts an intelligent diagnostic conversation with the Growth Strategist agent, collecting background details, tech stack, and goals while challenging saturated ideas and proposing high-margin angles.
* **Request Body (JSON):**
```json
{
  "user_id": "usr_1788814500123_abc",
  "message": "I specialize in Next.js, Python FastAPI, and custom LLM chatbots. My Fiverr handle is https://fiverr.com/zayn_dev",
  "history": [
    { "role": "agent", "content": "Welcome! Who are you and what do you do?" },
    { "role": "user", "content": "I am a full stack developer..." }
  ]
}
```
* **Response Body (JSON):**
```json
{
  "success": true,
  "data": {
    "reply": "Excellent foundation. While generic web development is crowded on Fiverr, combining Next.js with Python AI chatbots offers high average order values ($150-$500). Let's review...",
    "extracted_data": {
      "name": "Zayn",
      "fiverr_url": "https://fiverr.com/zayn_dev",
      "skills": "Next.js, Python, FastAPI, LLM Chatbots",
      "intended_gigs": "Custom LLM Chatbots, Full-Stack Next.js Web Apps"
    }
  }
}
```

### 2.2 Synthesize & Lock Market Strategy Blueprint
* **Route:** `POST /api/v1/strategist/synthesize`
* **Description:** Generates a comprehensive market competitiveness report and locks the profile and strategy to the `user_id` in the database.
* **Request Body (JSON):**
```json
{
  "user_id": "usr_1788814500123_abc",
  "profile_data": {
    "name": "Zayn Web & AI Studio",
    "fiverr_profile_url": "https://fiverr.com/zayn_dev",
    "skills": ["Next.js", "React", "Python", "FastAPI", "AI Chatbots"],
    "intended_gigs": ["Full-Stack Next.js Web Apps", "Custom Business AI Chatbots"],
    "experience_level": "Expert / Full-Stack"
  }
}
```
* **Response Body (JSON):**
```json
{
  "success": true,
  "data": {
    "target_niches": ["Custom Enterprise AI Chatbots", "High-Performance Next.js Web Apps"],
    "recommended_gigs": [
      {
        "title": "I will build a custom AI chatbot with LangChain, Next.js and FastAPI",
        "niche": "AI Chatbot & Automation",
        "demand_score": 96,
        "avg_ticket_price": "$250 - $600",
        "differentiation_angle": "RAG-powered with custom business knowledge base integration"
      }
    ],
    "profile_positioning": {
      "recommended_title": "Full-Stack Web & AI Automation Engineer",
      "usp": "Enterprise-grade architecture with 24-hr turnaround.",
      "target_audience": "SMBs and Agencies looking for AI-powered web solutions"
    },
    "market_analysis": {
      "demand_level": "High Demand (94/100)",
      "competition_density": "Low Saturation in custom AI agents",
      "pricing_strategy": "Value-based pricing targeting $200+ minimum orders"
    },
    "actionable_roadmap": [
      "Launch primary AI chatbot gig using provided SEO keywords",
      "Apply to buyer briefs with tailored RAG demo portfolio links"
    ],
    "anti_patterns_to_avoid": [
      "Do NOT create generic 'I will build WordPress site' gigs",
      "Avoid $5-$10 race-to-the-bottom pricing"
    ]
  }
}
```

### 2.3 Get Locked User Context
* **Route:** `GET /api/v1/strategist/context/:userId`
* **Description:** Retrieves the active user's locked profile and market strategy from the database.

---

## 3. Gig Generation & Buyer Briefs

### 3.1 Context-Grounded Gig Generation
* **Route:** `POST /api/v1/gigs/generate`
* **Description:** Synthesizes an end-to-end Fiverr Gig. If `user_id` is supplied, it automatically incorporates the seller's locked tech stack, USP, and market angle.
* **Request Body:**
```json
{
  "user_id": "usr_1788814500123_abc",
  "service_niche": "Custom AI Chatbot with Next.js & FastAPI",
  "primary_skill": "Next.js, Python, LangChain, FastAPI",
  "experience_level": "Expert",
  "target_turnaround": "24 Hours"
}
```

### 3.2 Context-Grounded Buyer Brief Pitch
* **Route:** `POST /api/v1/briefs/propose`
* **Description:** Synthesizes a high-converting buyer pitch. If `user_id` is provided, automatically references the seller's verified portfolio and background.

---

## 4. Market Research & Intelligence

* **Route:** `POST /api/v1/research/niche` - Evaluates search volume, competition level, and opportunity score for any freelance keyword.
* **Route:** `GET /api/v1/market/intelligence` - Real-time stream of high-demand buyer categories and emerging opportunities.
