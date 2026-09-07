import { Request, Response } from "express";
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
  public async generateGig(req: Request, res: Response) {
    try {
      const validated = GigSchema.parse(req.body);
      const generated = await aiService.generateGig(validated);
      const saved = db.saveGig({ ...validated, ...generated });
      return res.status(200).json({ success: true, data: saved });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  public async getGigs(req: Request, res: Response) {
    const gigs = db.getGigs();
    return res.status(200).json({ success: true, count: gigs.length, data: gigs });
  }

  public async proposeBrief(req: Request, res: Response) {
    try {
      const validated = BriefSchema.parse(req.body);
      const generated = await aiService.proposeBrief(validated);
      const saved = db.saveBrief({ ...validated, ...generated });
      return res.status(200).json({ success: true, data: saved });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  public async getBriefs(req: Request, res: Response) {
    const briefs = db.getBriefs();
    return res.status(200).json({ success: true, count: briefs.length, data: briefs });
  }

  public async researchNiche(req: Request, res: Response) {
    try {
      const validated = ResearchSchema.parse(req.body);
      const generated = await aiService.researchNiche(validated);
      const saved = db.saveResearch({ ...validated, ...generated });
      return res.status(200).json({ success: true, data: saved });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  public async getResearchHistory(req: Request, res: Response) {
    const history = db.getResearchHistory();
    return res.status(200).json({ success: true, count: history.length, data: history });
  }
}

export const apiController = new ApiController();
