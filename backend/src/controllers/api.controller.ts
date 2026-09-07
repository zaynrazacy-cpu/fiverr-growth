import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { aiService } from "../services/ai.service.js";
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
  skill_keywords: z.array(z.string()).min(1),
  target_category: z.string().optional()
});

export class ApiController {
  public async generateGig(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = GigSchema.parse(req.body);
      const userId = req.user?.userId;
      
      // If user has locked context, enrich the generation request!
      let userContext = null;
      if (userId) {
        userContext = db.getUserContext(userId);
      }

      const generated = await aiService.generateGig({
        ...validated,
        ...(userContext ? {
          experience_level: userContext.experienceYears || validated.experience_level,
          primary_skill: userContext.primarySkills?.join(", ") || validated.primary_skill
        } : {})
      });

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
      const userId = req.user?.userId;

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

  public async researchNiche(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = ResearchSchema.parse(req.body);
      const userId = req.user?.userId;
      const generated = await aiService.researchNiche(validated);
      const saved = db.saveResearch({ ...validated, ...generated, userId: userId || "anonymous" });
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
