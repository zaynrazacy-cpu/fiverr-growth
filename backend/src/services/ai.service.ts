import axios from "axios";
import { config } from "../config/index.js";

export class AIService {
  private pythonServiceUrl = config.AI_SERVICE_URL;

  public async generateGig(payload: {
    service_niche: string;
    primary_skill: string;
    experience_level?: string;
    target_turnaround?: string;
  }) {
    try {
      const response = await axios.post(`${this.pythonServiceUrl}/api/ai/gigs/generate`, payload, {
        timeout: 25000
      });
      return response.data;
    } catch (error: any) {
      console.warn("Python AI service unavailable or timed out, executing direct fallback...");
      return this.directFallbackGig(payload);
    }
  }

  public async proposeBrief(payload: {
    brief_text: string;
    buyer_budget?: string;
    urgency?: string;
    user_skills?: string[];
  }) {
    try {
      const response = await axios.post(`${this.pythonServiceUrl}/api/ai/briefs/propose`, payload, {
        timeout: 25000
      });
      return response.data;
    } catch (error: any) {
      console.warn("Python AI service unavailable, executing direct fallback...");
      return this.directFallbackBrief(payload);
    }
  }

  public async researchNiche(payload: {
    skill_keywords: string[];
    target_category?: string;
  }) {
    try {
      const response = await axios.post(`${this.pythonServiceUrl}/api/ai/research/niche`, payload, {
        timeout: 25000
      });
      return response.data;
    } catch (error: any) {
      console.warn("Python AI service unavailable, executing direct fallback...");
      return this.directFallbackResearch(payload);
    }
  }

  private directFallbackGig(payload: any) {
    const niche = payload.service_niche || "Python Automation";
    return {
      title: `I will develop high performance ${niche.toLowerCase()} scripts and bots`,
      category: "Programming & Tech",
      sub_category: "Data Scraping & Extraction",
      search_tags: ["python bot", "automation", "data scraping", "web scraper", "scripting"],
      description: `## Professional ${niche} Services\n\nLooking for reliable, scalable automation? I specialize in building custom scripts that handle complex tasks effortlessly.\n\n### What I Deliver:\n- Error-handled custom code\n- High-speed performance\n- Clean documentation & deployment\n\n**Contact me now to discuss your custom project requirements!**`,
      packages: {
        basic: {
          name: "Basic Setup",
          title: "Single Automation Script",
          description: "One clean task automation script with output formatting.",
          delivery_days: 1,
          price_usd: 30.0,
          revisions: 1
        },
        standard: {
          name: "Standard Package",
          title: "Multi-Step Automation & API",
          description: "Dynamic script with database/Google Sheets integration.",
          delivery_days: 2,
          price_usd: 85.0,
          revisions: 3
        },
        premium: {
          name: "Enterprise Solution",
          title: "Complete Automated System",
          description: "Full end-to-end automation with proxy handling, cloud deploy, and dashboard.",
          delivery_days: 4,
          price_usd: 200.0,
          revisions: 999
        }
      },
      faqs: [
        {
          question: "How do we get started?",
          answer: "Simply share your target specifications or website link and I will prepare a sample demo."
        }
      ],
      buyer_requirements: ["Target requirements document or URL", "Desired output format"],
      seo_score: 95.0
    };
  }

  private directFallbackBrief(payload: any) {
    return {
      proposal_text: `I reviewed your requirements: "${payload.brief_text.slice(0, 80)}...".\n\nHere is my 3-step action plan:\n1. Analyze and isolate target data endpoints / workflow logic.\n2. Develop a resilient script with built-in error handling and rate-limit safety.\n3. Format output cleanly to your exact specification.\n\nI can deliver an initial verified sample within 24 hours. Let me know if you'd like to review a quick demo!`,
      suggested_bid_usd: payload.buyer_budget ? parseFloat(payload.buyer_budget.replace(/[^0-9.]/g, "")) || 100 : 95.0,
      recommended_delivery_days: 2,
      key_selling_hook: "Fast 24-hour sample preview with error-handled code",
      confidence_score: 0.92
    };
  }

  private directFallbackResearch(payload: any) {
    const kw = payload.skill_keywords?.[0] || "Python automation";
    return {
      target_keywords: [
        {
          keyword: kw,
          competition_level: "LOW",
          avg_queue_count: 5,
          opportunity_score: 91.5,
          recommendation: "Use this keyword prominently in the first 4 words of your gig title."
        }
      ],
      pricing_benchmarks: {
        avg_basic_price: 25.0,
        avg_standard_price: 80.0,
        avg_premium_price: 195.0,
        recommended_entry_price: 30.0
      },
      high_demand_gaps: [
        "Fast 24-hour delivery on basic automation",
        "Clear documentation and video walkthroughs"
      ],
      strategic_advice: "Highlight reliability and anti-ban safeguards to beat lower-rated competitors.",
      overall_niche_score: 88.0
    };
  }
}

export const aiService = new AIService();
