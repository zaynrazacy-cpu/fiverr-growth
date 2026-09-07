import { Router } from "express";
import { apiController } from "../controllers/api.controller.js";

const router = Router();

// Gig Generator routes
router.post("/gigs/generate", (req, res) => apiController.generateGig(req, res));
router.get("/gigs", (req, res) => apiController.getGigs(req, res));

// Buyer Briefs routes
router.post("/briefs/propose", (req, res) => apiController.proposeBrief(req, res));
router.get("/briefs", (req, res) => apiController.getBriefs(req, res));

// Market Research routes
router.post("/research/niche", (req, res) => apiController.researchNiche(req, res));
router.get("/research/history", (req, res) => apiController.getResearchHistory(req, res));

export default router;
