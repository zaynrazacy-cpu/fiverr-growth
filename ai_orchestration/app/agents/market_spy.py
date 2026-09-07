from app.core.llm_router import llm_router
from app.schemas.research import NicheResearchRequest, NicheResearchResponse

class MarketSpyAgent:
    """
    Performs competitive market intelligence and opportunity scoring for Fiverr niches.
    Calculates competition pressure, pricing tiers, and underserved gaps.
    """

    SYSTEM_PROMPT = """You are an algorithmic market intelligence analyst specializing in the Fiverr freelance marketplace.
Analyze the requested skills/keywords to uncover high-margin, low-competition sub-niches.
Output must be strictly valid JSON."""

    async def analyze_niche(self, req: NicheResearchRequest) -> NicheResearchResponse:
        keywords_str = ", ".join(req.skill_keywords)
        prompt = f"""Analyze market opportunity for these Fiverr keywords:
Target Keywords: {keywords_str}
Category: {req.target_category}

Provide a deep market analysis in valid JSON format:
{{
  "target_keywords": [
    {{
      "keyword": "{req.skill_keywords[0] if req.skill_keywords else 'python bot'}",
      "competition_level": "LOW",
      "avg_queue_count": 5,
      "opportunity_score": 92.0,
      "recommendation": "Target this keyword in the first 3 words of your gig title."
    }}
  ],
  "pricing_benchmarks": {{
    "avg_basic_price": 30.0,
    "avg_standard_price": 85.0,
    "avg_premium_price": 220.0,
    "recommended_entry_price": 25.0
  }},
  "high_demand_gaps": [
    "Most sellers do not offer automated cloud hosting for scripts",
    "Lack of fast 24-hour turnaround on basic scrapers"
  ],
  "strategic_advice": "Focus your gig title on solving anti-bot blocks (Cloudflare, Datadome), as 70% of clients are frustrated by junior scrapers failing on complex sites.",
  "overall_niche_score": 89.5
}}"""

        data = await llm_router.generate_json(prompt=prompt, system_prompt=self.SYSTEM_PROMPT)
        return NicheResearchResponse(**data)

market_spy_agent = MarketSpyAgent()
