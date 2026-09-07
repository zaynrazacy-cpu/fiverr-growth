from typing import List, Optional
from pydantic import BaseModel, Field

class BriefAnalyzeRequest(BaseModel):
    brief_text: str = Field(..., description="The raw client Buyer Brief from Fiverr")
    buyer_budget: Optional[str] = Field(None, example="$100 - $250")
    urgency: Optional[str] = Field(None, example="Urgent (1-2 days)")
    user_skills: Optional[List[str]] = Field(default_factory=list, example=["Python", "FastAPI", "Web Scraping"])

class ProposalResponse(BaseModel):
    proposal_text: str = Field(..., description="High-converting custom pitch tailored to the brief")
    suggested_bid_usd: float = Field(..., description="Recommended pricing bid")
    recommended_delivery_days: int = Field(..., description="Optimal delivery speed to win the order")
    key_selling_hook: str = Field(..., description="The primary psychological hook used in the first 2 lines")
    confidence_score: float = Field(..., description="Match confidence score between 0.0 and 1.0")
