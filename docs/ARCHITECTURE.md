# FiverrGrowth AI: Architecture & Engineering Blueprint

---

## 1. System Overview

**FiverrGrowth AI** is an autonomous growth copilot designed to empower freelance developers and agencies on Fiverr. It automates niche market research, gig SEO synthesis, Buyer Brief proposal crafting, and response optimization.

```
                    +------------------------------------------+
                    |           React 19 Frontend Client       |
                    |  - Three.js 3D Holographic Hero Canvas   |
                    |  - GSAP Staggered Micro-Interactions     |
                    |  - Glassmorphic Dashboard & Tabs         |
                    +------------------------------------------+
                                          |
                                          | REST API Requests (/api/v1)
                                          v
                    +------------------------------------------+
                    |          Node.js Express Gateway         |
                    |  - Swagger / OpenAPI 3.0 (/api/docs)     |
                    |  - Zod Request Validation Middleware     |
                    |  - Persistent JSON File Store (DB)       |
                    |  - Resilience Fallback Engine            |
                    +------------------------------------------+
                                          |
                                          | Async RPC / REST
                                          v
                    +------------------------------------------+
                    |       Python AI Orchestration Engine     |
                    |  - FastAPI Microservice (:8000)          |
                    |  - Multi-Model Router                    |
                    |    * Groq LPU (Qwen 3.8 / Llama 3.3)     |
                    |    * Google Gemini 2.5 Flash             |
                    |  - Pydantic v2 Schema Enforcement        |
                    +------------------------------------------+
```

---

## 2. Component Specifications

### 2.1 Frontend Layer (`frontend/`)
* **Framework:** React 19 with Vite 8 and TypeScript.
* **Styling:** Tailwind CSS v4 with glassmorphism utilities (`glass-panel`, `glass-card`, `glass-input`).
* **3D Visuals:** Three.js (`@react-three/fiber`, `@react-three/drei`) rendering an interactive glowing icosahedron with distorted wireframe shaders and ambient floating energy particles.
* **Micro-Animations:** GSAP (GreenSock) for smooth transitions between module tabs and card elevation reveals.
* **Icons:** Lucide-React.

### 2.2 Backend Gateway (`backend/`)
* **Framework:** Express with Node.js and TypeScript (`tsx` runtime).
* **API Documentation:** Interactive Swagger UI mounted at `http://localhost:5000/api/docs`.
* **Database & Persistence:** `Store` engine persisting generated gigs, briefs, and niche research history to `backend/data/store.json`.
* **Self-Healing Fallback:** If the Python microservice is offline or restarting, the Node.js backend seamlessly executes local fallback generation so the user experience is never interrupted.

### 2.3 AI Orchestration Core (`ai_orchestration/`)
* **Framework:** FastAPI with Python 3.11+.
* **Brain Engine:**
  * **Groq LPU:** Sub-second inference for proposal generation and quick text analysis.
  * **Google Gemini 2.5 Flash:** Native JSON generation for 5-stage gig packages with strict schema compliance.
* **Agents:**
  * `GigSynthesizerAgent`: Generates titles, tags, 3-tier pricing tables, markdown descriptions, and FAQs.
  * `BriefMatcherAgent`: Transforms client job briefs into winning personalized custom proposals.
  * `MarketSpyAgent`: Calculates competition pressure, pricing tiers, and underserved gaps.

---

## 3. Compliance & Anti-Ban Architecture
Fiverr strictly monitors automated browser submissions. FiverrGrowth AI is engineered as a **Human-in-the-Loop Copilot**:
1. The AI performs 100% of the cognitive labor (researching, writing, calculating prices, and drafting proposals).
2. The user executes the submission via 1-click clipboard copy.
3. This guarantees **zero risk of account shadowbans or CAPTCHA penalties**.
