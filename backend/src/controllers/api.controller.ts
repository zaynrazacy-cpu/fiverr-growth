import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { aiService } from "../services/ai.service.js";
import { liveResearchService } from "../services/liveResearch.service.js";
import { db } from "../db/store.js";
import { z } from "zod";

const GigSchema = z.object({
  service_niche: z.string().min(3),
  primary_skill: z.string().min(2),
  experience_level: z.string().optional(),
  target_turnaround: z.string().optional()
});

const BriefSchema = z.object({
  brief_text: z.string().min(10),
  buyer_budget: z.string().optional(),
  urgency: z.string().optional(),
  user_skills: z.array(z.string()).optional()
});

const ResearchSchema = z.object({
  skill_keywords: z.array(z.string()).optional(),
  niche: z.string().optional(),
  target_category: z.string().optional()
});

export class ApiController {
  public async generateGig(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = GigSchema.parse(req.body);
      const userId = req.user?.userId || (req.body as any).user_id;
      
      // If user has locked context, enrich the generation request!
      let userContext = null;
      if (userId) {
        userContext = db.getUserContext(userId);
      }

      // Fetch real live buyer intent keywords for this niche
      const liveKeywords = await liveResearchService.getLiveBuyerQueries(validated.service_niche);

      const generated = await aiService.generateGig({
        ...validated,
        primary_skill: userContext?.primarySkills?.join(", ") || validated.primary_skill,
        experience_level: userContext?.experienceYears || validated.experience_level,
        ...(liveKeywords.length > 0 ? { search_tags: liveKeywords.slice(0, 5) } : {})
      });

      // If live keywords found, ensure they are blended into the generated search tags
      if (liveKeywords.length > 0 && generated.search_tags) {
        const blended = Array.from(new Set([...liveKeywords.slice(0, 3), ...generated.search_tags])).slice(0, 5);
        generated.search_tags = blended;
      }

      const saved = db.saveGig({ ...validated, ...generated, userId: userId || "anonymous" });
      return res.status(200).json({ success: true, data: saved });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  public async getGigs(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const gigs = db.getGigs(userId);
    return res.status(200).json({ success: true, count: gigs.length, data: gigs });
  }

  public async proposeBrief(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = BriefSchema.parse(req.body);
      const userId = req.user?.userId || (req.body as any).user_id;

      let userContext = null;
      if (userId) {
        userContext = db.getUserContext(userId);
      }

      const enrichedSkills = validated.user_skills && validated.user_skills.length > 0
        ? validated.user_skills
        : (userContext?.primarySkills || ["Python", "FastAPI", "Web Scraping"]);

      const generated = await aiService.proposeBrief({
        ...validated,
        user_skills: enrichedSkills
      });

      const saved = db.saveBrief({ ...validated, ...generated, userId: userId || "anonymous" });
      return res.status(200).json({ success: true, data: saved });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  public async getBriefs(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const briefs = db.getBriefs(userId);
    return res.status(200).json({ success: true, count: briefs.length, data: briefs });
  }

  /**
   * Real Live Client Briefs Stream (from Jobicy + Remotive APIs)
   */
  public async getLiveBriefs(req: AuthenticatedRequest, res: Response) {
    try {
      const tag = (req.query.tag as string) || "developer";
      const limit = parseInt((req.query.limit as string) || "15", 10);
      const liveBriefs = await liveResearchService.getLiveClientBriefs(tag, limit);
      return res.status(200).json({
        success: true,
        count: liveBriefs.length,
        source: "Multi-Source Live Remote & Freelance Feeds (Jobicy + Remotive)",
        data: liveBriefs
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Real Live Market Intelligence Report
   */
  public async getMarketIntelligence(req: AuthenticatedRequest, res: Response) {
    try {
      const niche = (req.query.niche as string) || "AI & Full-Stack Web Development";
      const intelligence = await liveResearchService.getLiveMarketIntelligence(niche);
      return res.status(200).json({
        success: true,
        data: intelligence
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async researchNiche(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = ResearchSchema.parse(req.body);
      const userId = req.user?.userId;
      const targetNiche = validated.niche || (validated.skill_keywords ? validated.skill_keywords.join(" ") : "Web Development");

      // Pull real live market intelligence
      const liveData = await liveResearchService.getLiveMarketIntelligence(targetNiche);

      const generated = await aiService.researchNiche({
        skill_keywords: validated.skill_keywords || [targetNiche],
        target_category: validated.target_category || "Programming & Tech"
      });

      // Merge real live metrics into AI research output
      const merged = {
        ...generated,
        real_time_signals: {
          buyer_queries: liveData.buyer_search_keywords,
          active_market_jobs: liveData.active_jobs_count,
          github_tools: liveData.github_ecosystem_tools,
          salary_distribution: liveData.salary_range,
          opportunity_score: liveData.opportunity_score,
          last_synced: liveData.last_updated
        }
      };

      const saved = db.saveResearch({ ...validated, ...merged, userId: userId || "anonymous" });
      return res.status(200).json({ success: true, data: saved });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  public async getResearchHistory(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const history = db.getResearchHistory(userId);
    return res.status(200).json({ success: true, count: history.length, data: history });
  }
}

export const apiController = new ApiController();
