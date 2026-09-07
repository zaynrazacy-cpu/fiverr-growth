from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class NicheResearchRequest(BaseModel):
    skill_keywords: List[str] = Field(..., example=["Python automation", "AI bot", "Web scraping"])
    target_category: Optional[str] = Field("Programming & Tech", example="Programming & Tech")

class KeywordMetric(BaseModel):
    keyword: str
    competition_level: str = Field(..., example="LOW / MEDIUM / HIGH")
    avg_queue_count: int = Field(..., example=4)
    opportunity_score: float = Field(..., example=88.5)
    recommendation: str

class PricingBenchmark(BaseModel):
    avg_basic_price: float
    avg_standard_price: float
    avg_premium_price: float
    recommended_entry_price: float

class NicheResearchResponse(BaseModel):
    target_keywords: List[KeywordMetric]
    pricing_benchmarks: PricingBenchmark
    high_demand_gaps: List[str]
    strategic_advice: str
    overall_niche_score: float
