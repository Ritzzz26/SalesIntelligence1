import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertLeadSchema, 
  insertDealSchema,
  insertSocialMediaPlatformSchema,
  insertSocialMediaLeadSchema,
  socialMediaPlatforms,
  socialMediaLeads
} from "@shared/schema";
import { generateForecast } from "./openai";
import { db } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - all prefixed with /api
  
  // Dashboard stats and analytics
  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      // Get KPI metrics
      const kpiMetrics = await storage.getAllAnalytics();
      const revenue = kpiMetrics.find(metric => metric.metricType === "revenue");
      const dealsWon = kpiMetrics.find(metric => metric.metricType === "deals_won");
      const newLeads = kpiMetrics.find(metric => metric.metricType === "new_leads");
      const conversionRate = kpiMetrics.find(metric => metric.metricType === "conversion_rate");
      
      // Get revenue trend data
      const revenueTrend = kpiMetrics.find(metric => metric.metricType === "revenue_trend");
      
      // Get lead source data
      const leadSources = kpiMetrics.find(metric => metric.metricType === "lead_sources");
      
      // Get team performance data
      const teamPerformance = kpiMetrics.find(metric => metric.metricType === "team_performance");
      
      // Get customer sentiment data
      const customerSentiment = kpiMetrics.find(metric => metric.metricType === "customer_sentiment");
      
      return res.json({
        kpi: {
          revenue,
          dealsWon,
          newLeads,
          conversionRate
        },
        revenueTrend,
        leadSources,
        teamPerformance,
        customerSentiment
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch dashboard analytics" });
    }
  });
  
  // Forecasting data and AI insights
  app.get("/api/forecasting", async (req, res) => {
    try {
      const forecasts = await storage.getAllForecasts();
      const currentQuarterForecast = forecasts.find(f => 
        f.forecastType === "revenue" && f.metadata?.predictions
      );
      
      const monthlyForecasts = forecasts.filter(f => 
        f.forecastType === "revenue" && f.metadata?.deals
      );
      
      return res.json({
        currentQuarter: currentQuarterForecast,
        monthly: monthlyForecasts
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch forecasting data" });
    }
  });
  
  // AI prediction endpoint
  app.post("/api/forecasting/predict", async (req, res) => {
    try {
      const { dealId, customInput } = req.body;
      
      let deal;
      if (dealId) {
        deal = await storage.getDeal(dealId);
        if (!deal) {
          return res.status(404).json({ error: "Deal not found" });
        }
      }
      
      const forecast = await generateForecast(deal, customInput);
      return res.json(forecast);
    } catch (error) {
      return res.status(500).json({ error: "Failed to generate forecast" });
    }
  });
  
  // Get all leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      return res.json(leads);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch leads" });
    }
  });
  
  // Get a specific lead
  app.get("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid lead ID" });
      }
      
      const lead = await storage.getLead(id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      return res.json(lead);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch lead" });
    }
  });
  
  // Create a new lead
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      
      // Create an activity for this new lead
      await storage.createActivity({
        type: "lead_created",
        description: `New lead created: ${lead.name} from ${lead.company}`,
        leadId: lead.id,
        userId: lead.assignedUserId || null
      });
      
      return res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Failed to create lead" });
    }
  });
  
  // Update a lead
  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid lead ID" });
      }
      
      const existingLead = await storage.getLead(id);
      if (!existingLead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      const validatedData = insertLeadSchema.partial().parse(req.body);
      const updatedLead = await storage.updateLead(id, validatedData);
      
      // Create an activity for this update
      if (validatedData.status && validatedData.status !== existingLead.status) {
        await storage.createActivity({
          type: "lead_status_changed",
          description: `Lead status changed from ${existingLead.status} to ${validatedData.status}`,
          leadId: id,
          userId: validatedData.assignedUserId || existingLead.assignedUserId || null
        });
      }
      
      return res.json(updatedLead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Failed to update lead" });
    }
  });
  
  // Delete a lead
  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid lead ID" });
      }
      
      const existingLead = await storage.getLead(id);
      if (!existingLead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      const deleted = await storage.deleteLead(id);
      if (!deleted) {
        return res.status(500).json({ error: "Failed to delete lead" });
      }
      
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete lead" });
    }
  });
  
  // Get all deals
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await storage.getAllDeals();
      return res.json(deals);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch deals" });
    }
  });
  
  // Get deals by stage
  app.get("/api/deals/stage/:stage", async (req, res) => {
    try {
      const { stage } = req.params;
      const deals = await storage.getDealsByStage(stage);
      return res.json(deals);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch deals by stage" });
    }
  });
  
  // Get a specific deal
  app.get("/api/deals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid deal ID" });
      }
      
      const deal = await storage.getDeal(id);
      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }
      
      return res.json(deal);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch deal" });
    }
  });
  
  // Create a new deal
  app.post("/api/deals", async (req, res) => {
    try {
      const validatedData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(validatedData);
      
      // Create an activity for this new deal
      await storage.createActivity({
        type: "deal_created",
        description: `New deal created: ${deal.name} (${deal.value})`,
        dealId: deal.id,
        leadId: deal.leadId || null,
        userId: deal.assignedUserId || null
      });
      
      return res.status(201).json(deal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Failed to create deal" });
    }
  });
  
  // Update a deal
  app.patch("/api/deals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid deal ID" });
      }
      
      const existingDeal = await storage.getDeal(id);
      if (!existingDeal) {
        return res.status(404).json({ error: "Deal not found" });
      }
      
      const validatedData = insertDealSchema.partial().parse(req.body);
      const updatedDeal = await storage.updateDeal(id, validatedData);
      
      // Create an activity for stage changes
      if (validatedData.stage && validatedData.stage !== existingDeal.stage) {
        await storage.createActivity({
          type: "deal_stage_changed",
          description: `Deal stage changed from ${existingDeal.stage} to ${validatedData.stage}`,
          dealId: id,
          leadId: existingDeal.leadId || null,
          userId: validatedData.assignedUserId || existingDeal.assignedUserId || null
        });
      }
      
      return res.json(updatedDeal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Failed to update deal" });
    }
  });
  
  // Delete a deal
  app.delete("/api/deals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid deal ID" });
      }
      
      const existingDeal = await storage.getDeal(id);
      if (!existingDeal) {
        return res.status(404).json({ error: "Deal not found" });
      }
      
      const deleted = await storage.deleteDeal(id);
      if (!deleted) {
        return res.status(500).json({ error: "Failed to delete deal" });
      }
      
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete deal" });
    }
  });
  
  // Get all users (sales reps)
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Don't send passwords to the client
      const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      
      return res.json(safeUsers);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Social Media Platform Routes
  
  // Get all social media platforms
  app.get("/api/social-media/platforms", async (req, res) => {
    try {
      const platforms = await storage.getAllSocialMediaPlatforms();
      return res.json(platforms);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch social media platforms" });
    }
  });
  
  // Get a specific social media platform
  app.get("/api/social-media/platforms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid platform ID" });
      }
      
      const platform = await storage.getSocialMediaPlatform(id);
      if (!platform) {
        return res.status(404).json({ error: "Platform not found" });
      }
      
      return res.json(platform);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch platform" });
    }
  });
  
  // Create a new social media platform
  app.post("/api/social-media/platforms", async (req, res) => {
    try {
      const validatedData = insertSocialMediaPlatformSchema.parse(req.body);
      const platform = await storage.createSocialMediaPlatform(validatedData);
      return res.status(201).json(platform);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Failed to create platform" });
    }
  });
  
  // Update a social media platform
  app.patch("/api/social-media/platforms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid platform ID" });
      }
      
      const existingPlatform = await storage.getSocialMediaPlatform(id);
      if (!existingPlatform) {
        return res.status(404).json({ error: "Platform not found" });
      }
      
      const validatedData = insertSocialMediaPlatformSchema.partial().parse(req.body);
      const updatedPlatform = await storage.updateSocialMediaPlatform(id, validatedData);
      
      return res.json(updatedPlatform);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Failed to update platform" });
    }
  });
  
  // Delete a social media platform
  app.delete("/api/social-media/platforms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid platform ID" });
      }
      
      const existingPlatform = await storage.getSocialMediaPlatform(id);
      if (!existingPlatform) {
        return res.status(404).json({ error: "Platform not found" });
      }
      
      const deleted = await storage.deleteSocialMediaPlatform(id);
      if (!deleted) {
        return res.status(500).json({ error: "Failed to delete platform" });
      }
      
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete platform" });
    }
  });
  
  // Social Media Lead Routes
  
  // Get all social media leads
  app.get("/api/social-media/leads", async (req, res) => {
    try {
      const leads = await storage.getAllSocialMediaLeads();
      return res.json(leads);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch social media leads" });
    }
  });
  
  // Get social media leads by platform
  app.get("/api/social-media/leads/platform/:platformId", async (req, res) => {
    try {
      const platformId = parseInt(req.params.platformId);
      if (isNaN(platformId)) {
        return res.status(400).json({ error: "Invalid platform ID" });
      }
      
      const leads = await storage.getSocialMediaLeadsByPlatform(platformId);
      return res.json(leads);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch social media leads by platform" });
    }
  });
  
  // Get social media leads by status
  app.get("/api/social-media/leads/status/:status", async (req, res) => {
    try {
      const { status } = req.params;
      const leads = await storage.getSocialMediaLeadsByStatus(status);
      return res.json(leads);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch social media leads by status" });
    }
  });
  
  // Get a specific social media lead
  app.get("/api/social-media/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid lead ID" });
      }
      
      const lead = await storage.getSocialMediaLead(id);
      if (!lead) {
        return res.status(404).json({ error: "Social media lead not found" });
      }
      
      return res.json(lead);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch social media lead" });
    }
  });
  
  // Create a new social media lead
  app.post("/api/social-media/leads", async (req, res) => {
    try {
      const validatedData = insertSocialMediaLeadSchema.parse(req.body);
      const lead = await storage.createSocialMediaLead(validatedData);
      return res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Failed to create social media lead" });
    }
  });
  
  // Update a social media lead
  app.patch("/api/social-media/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid lead ID" });
      }
      
      const existingLead = await storage.getSocialMediaLead(id);
      if (!existingLead) {
        return res.status(404).json({ error: "Social media lead not found" });
      }
      
      const validatedData = insertSocialMediaLeadSchema.partial().parse(req.body);
      const updatedLead = await storage.updateSocialMediaLead(id, validatedData);
      
      return res.json(updatedLead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Failed to update social media lead" });
    }
  });
  
  // Delete a social media lead
  app.delete("/api/social-media/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid lead ID" });
      }
      
      const existingLead = await storage.getSocialMediaLead(id);
      if (!existingLead) {
        return res.status(404).json({ error: "Social media lead not found" });
      }
      
      const deleted = await storage.deleteSocialMediaLead(id);
      if (!deleted) {
        return res.status(500).json({ error: "Failed to delete social media lead" });
      }
      
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete social media lead" });
    }
  });
  
  // Convert a social media lead to a regular lead
  app.post("/api/social-media/leads/:id/convert", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid lead ID" });
      }
      
      const existingLead = await storage.getSocialMediaLead(id);
      if (!existingLead) {
        return res.status(404).json({ error: "Social media lead not found" });
      }
      
      // Validate the lead data
      const validatedData = insertLeadSchema.parse(req.body);
      
      // Convert the social media lead to a regular lead
      const result = await storage.convertSocialMediaLeadToLead(id, validatedData);
      
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Failed to convert social media lead" });
    }
  });

  // Initialize demo data for social media if none exists
  try {
    // Check if we have any social media platforms
    const platformCountResult = await db.select({ count: socialMediaPlatforms.id });
    const platformCount = platformCountResult[0]?.count || 0;
    
    if (platformCount === 0) {
      console.log("Initializing demo social media platforms...");
      // Add demo platforms
      await db.insert(socialMediaPlatforms).values([
        {
          name: "Twitter",
          enabled: true,
          icon: "twitter",
          apiKey: null,
          apiSecret: null,
          accessToken: null,
          lastSyncedAt: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "LinkedIn",
          enabled: true,
          icon: "linkedin",
          apiKey: null,
          apiSecret: null,
          accessToken: null,
          lastSyncedAt: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Facebook",
          enabled: true,
          icon: "facebook",
          apiKey: null,
          apiSecret: null,
          accessToken: null,
          lastSyncedAt: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

      // Get platforms to use their IDs for leads
      const platforms = await db.select().from(socialMediaPlatforms);
      
      if (platforms.length > 0) {
        console.log("Initializing demo social media leads...");
        
        // Add demo leads for each platform
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const twitterPlatform = platforms.find(p => p.name === "Twitter");
        const linkedinPlatform = platforms.find(p => p.name === "LinkedIn");
        const facebookPlatform = platforms.find(p => p.name === "Facebook");
        
        // Generate leads for each platform
        if (twitterPlatform) {
          await db.insert(socialMediaLeads).values([
            {
              platformId: twitterPlatform.id,
              username: "tech_enthusiast",
              name: "Alex Johnson",
              status: "New",
              message: "Interested in your CRM solution. How does it compare to others?",
              interactionType: "Mention",
              interactionDate: yesterday,
              assignedUserId: null,
              metadata: JSON.stringify({tags: ["CRM", "Inquiry"]}),
              sentiment: "Positive",
              convertedToLeadId: null,
              originalPostUrl: "https://twitter.com/tech_enthusiast/status/123456789",
              createdAt: yesterday,
              updatedAt: now
            },
            {
              platformId: twitterPlatform.id,
              username: "sales_guru",
              name: "Jamie Smith",
              status: "In Progress",
              message: "Your forecasting feature looks amazing! Would love a demo.",
              interactionType: "Direct Message",
              interactionDate: now,
              assignedUserId: null,
              metadata: JSON.stringify({tags: ["Demo Request", "Forecasting"]}),
              sentiment: "Very Positive",
              convertedToLeadId: null,
              originalPostUrl: null,
              createdAt: now,
              updatedAt: now
            }
          ]);
        }
        
        if (linkedinPlatform) {
          await db.insert(socialMediaLeads).values([
            {
              platformId: linkedinPlatform.id,
              username: "sarah.parker",
              name: "Sarah Parker",
              status: "Qualified",
              message: "Our team is looking for a sales solution for our enterprise business. Can you provide info on your enterprise tier?",
              interactionType: "InMail",
              interactionDate: yesterday,
              assignedUserId: null,
              metadata: JSON.stringify({tags: ["Enterprise", "High Value"]}),
              sentiment: "Positive",
              convertedToLeadId: null,
              originalPostUrl: null,
              createdAt: yesterday,
              updatedAt: now
            }
          ]);
        }
        
        if (facebookPlatform) {
          await db.insert(socialMediaLeads).values([
            {
              platformId: facebookPlatform.id,
              username: "mike.roberts",
              name: "Mike Roberts",
              status: "New",
              message: "Does your platform integrate with Shopify?",
              interactionType: "Comment",
              interactionDate: now,
              assignedUserId: null,
              metadata: JSON.stringify({tags: ["Integration", "E-commerce"]}),
              sentiment: "Neutral",
              convertedToLeadId: null,
              originalPostUrl: "https://facebook.com/posts/54321",
              createdAt: now,
              updatedAt: now
            }
          ]);
        }
      }
    }
  } catch (error) {
    console.error("Failed to initialize social media demo data:", error);
  }

  const httpServer = createServer(app);
  return httpServer;
}
