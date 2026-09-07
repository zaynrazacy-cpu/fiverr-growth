from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.schemas.gig import GigGenerationRequest, GigPackage
from app.schemas.brief import BriefAnalyzeRequest, ProposalResponse
from app.schemas.research import NicheResearchRequest, NicheResearchResponse
from app.agents.gig_synthesizer import gig_synthesizer_agent
from app.agents.brief_matcher import brief_matcher_agent
from app.agents.market_spy import market_spy_agent

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous AI Orchestration Core for FiverrGrowth Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ai_orchestration",
        "version": settings.VERSION,
        "providers_configured": {
            "groq": bool(settings.GROQ_API_KEY),
            "gemini": bool(settings.GEMINI_API_KEY),
            "cerebras": bool(settings.CEREBRAS_API_KEY)
        }
    }

@app.post("/api/ai/gigs/generate", response_model=GigPackage)
async def generate_gig(req: GigGenerationRequest):
    try:
        return await gig_synthesizer_agent.synthesize(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/briefs/propose", response_model=ProposalResponse)
async def propose_brief(req: BriefAnalyzeRequest):
    try:
        return await brief_matcher_agent.generate_proposal(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/research/niche", response_model=NicheResearchResponse)
async def research_niche(req: NicheResearchRequest):
    try:
        return await market_spy_agent.analyze_niche(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
