from typing import List, Optional
from pydantic import BaseModel, Field

class PackageTier(BaseModel):
    name: str = Field(..., description="Package tier name e.g. Basic, Standard, Premium")
    title: str = Field(..., description="Catchy deliverable title")
    description: str = Field(..., description="Clear deliverable explanation")
    delivery_days: int = Field(..., description="Turnaround in days")
    price_usd: float = Field(..., description="Package price in USD")
    revisions: int = Field(..., description="Number of revisions included")

class GigPackages(BaseModel):
    basic: PackageTier
    standard: PackageTier
    premium: PackageTier

class FAQItem(BaseModel):
    question: str
    answer: str

class GigGenerationRequest(BaseModel):
    service_niche: str = Field(..., example="Python Web Scraping & Automation")
    primary_skill: str = Field(..., example="FastAPI, BeautifulSoup, Playwright")
    experience_level: Optional[str] = Field("Expert", example="Intermediate / Expert")
    target_turnaround: Optional[str] = Field("24 Hours", example="24 Hours")

class GigPackage(BaseModel):
    title: str = Field(..., description="Fiverr optimized title starting with 'I will'")
    category: str
    sub_category: str
    search_tags: List[str] = Field(..., description="5 high-volume search tags max 20 chars each")
    description: str = Field(..., description="Full persuasive Markdown formatted description")
    packages: GigPackages
    faqs: List[FAQItem]
    buyer_requirements: List[str]
    seo_score: float = Field(..., description="Calculated Fiverr SEO ranking score out of 100")
