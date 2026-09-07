import asyncio
from app.schemas.brief import BriefAnalyzeRequest
from app.schemas.gig import GigGenerationRequest
from app.agents.brief_matcher import brief_matcher_agent
from app.agents.gig_synthesizer import gig_synthesizer_agent

def test_brief_matcher_live():
    async def _run():
        print("\n--- Testing BriefMatcherAgent (Live Generation) ---")
        req = BriefAnalyzeRequest(
            brief_text="Need a Python developer to scrape real estate data from Zillow and export to CSV daily.",
            buyer_budget="$150",
            urgency="2 days",
            user_skills=["Python", "Playwright", "FastAPI"]
        )
        proposal = await brief_matcher_agent.generate_proposal(req)
        
        print("\n[ACTUAL PROPOSAL GENERATED]:")
        print(proposal.proposal_text)
        print(f"\n[METRICS]: Bid: ${proposal.suggested_bid_usd} | Days: {proposal.recommended_delivery_days} | Hook: {proposal.key_selling_hook} | Confidence: {proposal.confidence_score}")
        
        assert proposal.proposal_text is not None
        assert len(proposal.proposal_text) > 40
        assert proposal.suggested_bid_usd > 0
        assert proposal.recommended_delivery_days >= 1
        assert proposal.confidence_score >= 0.5
        print(">>> SUCCESS: BriefMatcherAgent passed all contract assertions!")

    asyncio.run(_run())

def test_gig_synthesizer_live():
    async def _run():
        print("\n--- Testing GigSynthesizerAgent (Live Generation) ---")
        req = GigGenerationRequest(
            service_niche="Python Web Scraping & Lead Generation",
            primary_skill="Python, Playwright, Scrapy",
            experience_level="Expert"
        )
        gig = await gig_synthesizer_agent.synthesize(req)
        
        print("\n[ACTUAL GIG GENERATED]:")
        print(f"Title: {gig.title}")
        print(f"Category: {gig.category} -> {gig.sub_category}")
        print(f"Search Tags: {gig.search_tags}")
        print(f"Basic Package: ${gig.packages.basic.price_usd} ({gig.packages.basic.delivery_days} days)")
        print(f"Standard Package: ${gig.packages.standard.price_usd} ({gig.packages.standard.delivery_days} days)")
        print(f"Premium Package: ${gig.packages.premium.price_usd} ({gig.packages.premium.delivery_days} days)")
        print(f"SEO Score: {gig.seo_score}/100")
        print(f"FAQs Count: {len(gig.faqs)}")
        
        assert gig.title.lower().startswith("i will")
        assert len(gig.search_tags) == 5
        assert gig.packages.basic.price_usd > 0
        assert gig.packages.standard.price_usd >= gig.packages.basic.price_usd
        assert gig.packages.premium.price_usd >= gig.packages.standard.price_usd
        assert len(gig.faqs) >= 1
        assert gig.seo_score >= 75.0
        print(">>> SUCCESS: GigSynthesizerAgent passed all contract assertions!")

    asyncio.run(_run())
