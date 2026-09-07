from app.core.llm_router import llm_router
from app.schemas.gig import GigGenerationRequest, GigPackage, GigPackages, PackageTier, FAQItem

class GigSynthesizerAgent:
    """
    Synthesizes algorithmically optimized, high-converting Fiverr Gigs.
    Adheres strictly to Fiverr SEO guidelines:
    - Title formula: 'I will [high volume search keyword] with [speed/quality hook]'
    - 5 prioritized search tags under 20 chars
    - 1,200 char markdown description with pain points, deliverables, proof, and CTA
    - 3-tier pricing strategy
    - 5+ preemptive FAQs
    """

    SYSTEM_PROMPT = """You are an elite Fiverr Top-Rated Seller and SEO strategist who has generated over $500,000 in freelance revenue.
Your job is to craft an exceptional, high-ranking Fiverr Gig that converts visitors into high-paying orders.
Rules:
1. Title MUST start with 'I will' and include the primary search keyword in the first 4 words. Max 80 characters.
2. Search tags: Exactly 5 unique tags. Max 20 characters per tag. All lowercase, alphanumeric.
3. Description: Markdown formatted, including bold headings, bullet points, 'Why Choose Me', and a strong Call to Action.
4. Pricing: Realistic, competitive 3-tier structure (Basic, Standard, Premium).
5. Output MUST conform strictly to the required JSON schema."""

    async def synthesize(self, req: GigGenerationRequest) -> GigPackage:
        prompt = f"""Generate an end-to-end Fiverr Gig for the following parameters:
- Service Niche: {req.service_niche}
- Primary Skills / Tools: {req.primary_skill}
- Experience Level: {req.experience_level}
- Target Turnaround: {req.target_turnaround}

Return a valid JSON object matching this exact structure:
{{
  "title": "I will develop custom python web scraping script and data extraction bot",
  "category": "Programming & Tech",
  "sub_category": "Data Scraping & Extraction",
  "search_tags": ["python scraper", "data mining", "web scraping", "beautifulsoup", "automation bot"],
  "description": "## Welcome to your automated data solution...\\n\\n### What you get:\\n- Custom scrapers\\n- CSV/JSON export",
  "packages": {{
    "basic": {{
      "name": "Basic Script",
      "title": "Single Page Scraper",
      "description": "Extract data from 1 simple static website into CSV or Excel.",
      "delivery_days": 1,
      "price_usd": 25.0,
      "revisions": 1
    }},
    "standard": {{
      "name": "Standard Automation",
      "title": "Dynamic Multi-Page Scraper",
      "description": "Dynamic web scraper handling pagination, login, and anti-bot bypass.",
      "delivery_days": 2,
      "price_usd": 75.0,
      "revisions": 3
    }},
    "premium": {{
      "name": "Enterprise Pipeline",
      "title": "Full Automated Data Pipeline",
      "description": "Continuous scraping bot with proxy rotation, database storage, and cloud deployment.",
      "delivery_days": 4,
      "price_usd": 180.0,
      "revisions": 999
    }}
  }},
  "faqs": [
    {{
      "question": "Can you handle sites with Cloudflare or CAPTCHA?",
      "answer": "Yes, I implement Playwright-stealth and automated captcha solvers."
    }}
  ],
  "buyer_requirements": [
    "Target website URL",
    "List of exact fields/columns you need",
    "Desired output format (CSV, Excel, JSON, Database)"
  ],
  "seo_score": 96.5
}}"""

        data = await llm_router.generate_json(prompt=prompt, system_prompt=self.SYSTEM_PROMPT)
        return GigPackage(**data)

gig_synthesizer_agent = GigSynthesizerAgent()
