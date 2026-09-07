from app.core.llm_router import llm_router
from app.schemas.brief import BriefAnalyzeRequest, ProposalResponse

class BriefMatcherAgent:
    """
    Transforms raw Fiverr Buyer Briefs into winning, customized proposals.
    Rules:
    - Never start with generic pleasantries ('Hello dear', 'I am expert').
    - Immediately address the specific technical challenge in sentence #1.
    - Provide a concise 3-step action plan.
    - Propose a strategic bid price and realistic delivery timeline.
    """

    SYSTEM_PROMPT = """You are a master freelance proposal strategist.
When responding to a client brief:
1. First line must prove you actually read their brief by referencing their exact problem or target.
2. Outline your technical approach in 3 concise bullet points.
3. Highlight a relevant past result or guarantee.
4. Conclude with a low-friction call to action (e.g. 'Let me know what format you prefer and I can start today').
5. Output must be strictly valid JSON matching the requested schema."""

    async def generate_proposal(self, req: BriefAnalyzeRequest) -> ProposalResponse:
        skills_str = ", ".join(req.user_skills) if req.user_skills else "Python, Automation, Web Scraping, API Integration"
        prompt = f"""Synthesize a winning proposal for this Fiverr Buyer Brief:
Client Brief: "{req.brief_text}"
Buyer Stated Budget: "{req.buyer_budget or 'Not specified'}"
Urgency: "{req.urgency or 'Standard'}"
Freelancer Core Skills: {skills_str}

Return a valid JSON object matching this schema:
{{
  "proposal_text": "I noticed you need to scrape dynamic pagination from Zillow without getting blocked... Here is how I will do it:\\n1. Use Playwright with rotating residential proxies...\\n2. Clean and format the data...\\n3. Automate scheduled daily export to Google Sheets.\\n\\nWhen would you like to review the initial test sample?",
  "suggested_bid_usd": 120.0,
  "recommended_delivery_days": 2,
  "key_selling_hook": "Anti-bot proxy rotation with guaranteed clean schema",
  "confidence_score": 0.94
}}"""

        data = await llm_router.generate_json(prompt=prompt, system_prompt=self.SYSTEM_PROMPT)
        return ProposalResponse(**data)

brief_matcher_agent = BriefMatcherAgent()
