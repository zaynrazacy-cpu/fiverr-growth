export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "FiverrGrowth AI Gateway API",
    version: "1.2.0",
    description: "Autonomous Growth, Conversational Onboarding Agent, Profile Context Grounding & Gig Opportunity Platform for Fiverr Freelancers"
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Gateway"
    }
  ],
  paths: {
    "/api/v1/auth/register": {
      post: {
        summary: "Register new seller account with assigned persistent User ID",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string", example: "Zayn Web Studio" },
                  email: { type: "string", example: "zayn@example.com" },
                  password: { type: "string", example: "securepassword123" },
                  fiverr_profile_url: { type: "string", example: "https://fiverr.com/zayn_dev" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "User registered with JWT session token and assigned User ID" },
          "400": { description: "Validation error or existing user" }
        }
      }
    },
    "/api/v1/auth/login": {
      post: {
        summary: "Sign in with email and password",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "zayn@example.com" },
                  password: { type: "string", example: "securepassword123" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Login successful, returns JWT token and profile" }
        }
      }
    },
    "/api/v1/strategist/interview": {
      post: {
        summary: "Conversational turn with Growth Strategist diagnostic agent",
        tags: ["Growth Strategist"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  user_id: { type: "string", example: "usr_abc123" },
                  message: { type: "string", example: "I build React, Next.js and Python AI chatbots. Here is my profile: https://fiverr.com/zayn" },
                  history: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        role: { type: "string", example: "user" },
                        content: { type: "string", example: "Hello" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Agent strategic guidance and live profile signals extracted" }
        }
      }
    },
    "/api/v1/strategist/synthesize": {
      post: {
        summary: "Synthesize full market strategy blueprint and lock context to User ID in DB",
        tags: ["Growth Strategist"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["user_id", "profile_data"],
                properties: {
                  user_id: { type: "string", example: "usr_abc123" },
                  profile_data: {
                    type: "object",
                    properties: {
                      name: { type: "string", example: "Zayn" },
                      fiverr_profile_url: { type: "string", example: "https://fiverr.com/zayn" },
                      skills: { type: "array", items: { type: "string" }, example: ["React", "Python", "AI Chatbots"] },
                      intended_gigs: { type: "array", items: { type: "string" }, example: ["AI Chatbots", "Interactive 3D Web"] }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Market strategy blueprint generated and locked to User ID" }
        }
      }
    },
    "/api/v1/strategist/context/{userId}": {
      get: {
        summary: "Retrieve persistent locked profile context and market strategy for user",
        tags: ["Growth Strategist"],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "User context and active market strategy" }
        }
      }
    },
    "/api/v1/gigs/generate": {
      post: {
        summary: "Generate an end-to-end SEO optimized Fiverr Gig (Context-Grounded if user_id provided)",
        tags: ["Gig Generator"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["service_niche", "primary_skill"],
                properties: {
                  user_id: { type: "string", example: "usr_abc123" },
                  service_niche: { type: "string", example: "Custom AI Chatbot with LangChain & Next.js" },
                  primary_skill: { type: "string", example: "Python, FastAPI, Next.js, LangChain" },
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
        summary: "Synthesize winning proposal from a Fiverr Buyer Brief (Tailored to user context)",
        tags: ["Buyer Briefs"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["brief_text"],
                properties: {
                  user_id: { type: "string", example: "usr_abc123" },
                  brief_text: { type: "string", example: "Need a developer to build customer support AI bot for Shopify." },
                  buyer_budget: { type: "string", example: "$350" },
                  urgency: { type: "string", example: "3 days" },
                  user_skills: {
                    type: "array",
                    items: { type: "string" },
                    example: ["Python", "FastAPI", "React", "OpenAI"]
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
                required: ["niche"],
                properties: {
                  niche: { type: "string", example: "AI Chatbot Integration" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Opportunity score, competition density and keywords" }
        }
      }
    },
    "/api/v1/market/intelligence": {
      get: {
        summary: "Stream of trending buyer requests and keyword breakouts",
        tags: ["Market Research"],
        responses: {
          "200": { description: "Market intelligence snapshot" }
        }
      }
    }
  }
};
