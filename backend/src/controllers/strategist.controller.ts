import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { strategistService } from "../services/strategist.service.js";
import { db } from "../db/store.js";
import { z } from "zod";

const MessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string()
  })),
  collectedData: z.record(z.any()).optional().default({})
});

const SynthesizeSchema = z.object({
  fullName: z.string().min(2),
  fiverrUrl: z.string().optional().default(""),
  experienceYears: z.string().optional().default("3+ years"),
  primarySkills: z.array(z.string()).min(1),
  secondarySkills: z.array(z.string()).optional().default([]),
  targetNiches: z.array(z.string()).min(1)
});

export class StrategistController {
  public async handleInterviewTurn(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = MessageSchema.parse(req.body);
      const result = await strategistService.interviewTurn(validated.messages, validated.collectedData);
      return res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  public async synthesizeStrategy(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId || "anonymous_user";
      const validated = SynthesizeSchema.parse(req.body);
      const result = await strategistService.synthesizeMarketStrategy(userId, validated);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  public async getContext(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, error: "Authentication required." });
      }
      const context = db.getUserContext(userId);
      return res.status(200).json({ success: true, data: context });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async updateContext(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, error: "Authentication required." });
      }
      const updated = db.saveUserContext(userId, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}

export const strategistController = new StrategistController();
