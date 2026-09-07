export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "FiverrGrowth AI Gateway API",
    version: "1.0.0",
    description: "Autonomous Growth, Gig SEO & Opportunity Platform for Fiverr Freelancers"
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Gateway"
    }
  ],
  paths: {
    "/api/v1/gigs/generate": {
      post: {
        summary: "Generate an end-to-end SEO optimized Fiverr Gig",
        tags: ["Gig Generator"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["service_niche", "primary_skill"],
                properties: {
                  service_niche: { type: "string", example: "Python Web Scraping & Lead Generation" },
                  primary_skill: { type: "string", example: "Python, Playwright, Scrapy" },
                  experience_level: { type: "string", example: "Expert" },
                  target_turnaround: { type: "string", example: "24 Hours" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Successfully synthesized Fiverr gig package"
          }
        }
      }
    },
    "/api/v1/gigs": {
      get: {
        summary: "List all saved gigs",
        tags: ["Gig Generator"],
        responses: {
          "200": { description: "Array of saved gigs" }
        }
      }
    },
    "/api/v1/briefs/propose": {
      post: {
        summary: "Synthesize winning proposal from a Fiverr Buyer Brief",
        tags: ["Buyer Briefs"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["brief_text"],
                properties: {
                  brief_text: { type: "string", example: "Need a developer to scrape real estate listings from Redfin daily to CSV." },
                  buyer_budget: { type: "string", example: "$150" },
                  urgency: { type: "string", example: "2 days" },
                  user_skills: {
                    type: "array",
                    items: { type: "string" },
                    example: ["Python", "Playwright", "FastAPI"]
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Custom tailored proposal pitch" }
        }
      }
    },
    "/api/v1/briefs": {
      get: {
        summary: "List all generated proposals",
        tags: ["Buyer Briefs"],
        responses: {
          "200": { description: "Array of generated proposals" }
        }
      }
    },
    "/api/v1/research/niche": {
      post: {
        summary: "Perform market research and calculate opportunity scores",
        tags: ["Market Research"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["skill_keywords"],
                properties: {
                  skill_keywords: {
                    type: "array",
                    items: { type: "string" },
                    example: ["Python web scraping", "FastAPI bot"]
                  },
                  target_category: { type: "string", example: "Programming & Tech" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Market research analysis and keyword metrics" }
        }
      }
    }
  }
};
