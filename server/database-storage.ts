import { 
  users, type User, type InsertUser, 
  leads, type Lead, type InsertLead,
  deals, type Deal, type InsertDeal,
  activities, type Activity, type InsertActivity,
  analytics, type Analytics, type InsertAnalytics,
  forecasts, type Forecast, type InsertForecast,
  socialMediaPlatforms, type SocialMediaPlatform, type InsertSocialMediaPlatform,
  socialMediaLeads, type SocialMediaLead, type InsertSocialMediaLead
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Lead methods
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const now = new Date();
    const leadWithTimestamp = {
      ...insertLead,
      createdAt: now,
      lastContactedAt: null
    };
    const [lead] = await db.insert(leads).values(leadWithTimestamp).returning();
    return lead;
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async updateLead(id: number, data: Partial<InsertLead>): Promise<Lead | undefined> {
    const [updatedLead] = await db
      .update(leads)
      .set(data)
      .where(eq(leads.id, id))
      .returning();
    return updatedLead || undefined;
  }

  async deleteLead(id: number): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id)).returning();
    return result.length > 0;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async getLeadsByAssignedUser(userId: number): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.assignedUserId, userId));
  }

  async getLeadsBySource(source: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.source, source));
  }

  async getLeadsByStatus(status: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.status, status));
  }

  // Deal methods
  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const now = new Date();
    const dealWithTimestamp = {
      ...insertDeal,
      createdAt: now,
      lastUpdatedAt: now
    };
    const [deal] = await db.insert(deals).values(dealWithTimestamp).returning();
    return deal;
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    const [deal] = await db.select().from(deals).where(eq(deals.id, id));
    return deal || undefined;
  }

  async updateDeal(id: number, data: Partial<InsertDeal>): Promise<Deal | undefined> {
    const now = new Date();
    const updatedData = {
      ...data,
      lastUpdatedAt: now
    };
    const [updatedDeal] = await db
      .update(deals)
      .set(updatedData)
      .where(eq(deals.id, id))
      .returning();
    return updatedDeal || undefined;
  }

  async deleteDeal(id: number): Promise<boolean> {
    const result = await db.delete(deals).where(eq(deals.id, id)).returning();
    return result.length > 0;
  }

  async getAllDeals(): Promise<Deal[]> {
    return await db.select().from(deals);
  }

  async getDealsByStage(stage: string): Promise<Deal[]> {
    return await db.select().from(deals).where(eq(deals.stage, stage));
  }

  async getDealsByAssignedUser(userId: number): Promise<Deal[]> {
    return await db.select().from(deals).where(eq(deals.assignedUserId, userId));
  }

  async getDealsByLeadId(leadId: number): Promise<Deal[]> {
    return await db.select().from(deals).where(eq(deals.leadId, leadId));
  }

  // Activity methods
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const now = new Date();
    const activityWithTimestamp = {
      ...insertActivity,
      createdAt: now
    };
    const [activity] = await db.insert(activities).values(activityWithTimestamp).returning();
    return activity;
  }

  async getActivitiesByDeal(dealId: number): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.dealId, dealId));
  }

  async getActivitiesByLead(leadId: number): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.leadId, leadId));
  }

  async getActivitiesByUser(userId: number): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId));
  }

  async getAllActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  // Analytics methods
  async createAnalyticsEntry(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const now = new Date();
    const analyticsWithTimestamp = {
      ...insertAnalytics,
      createdAt: now
    };
    const [analyticsEntry] = await db.insert(analytics).values(analyticsWithTimestamp).returning();
    return analyticsEntry;
  }

  async getAnalyticsByType(metricType: string): Promise<Analytics[]> {
    return await db
      .select()
      .from(analytics)
      .where(eq(analytics.metricType, metricType));
  }

  async getAnalyticsByPeriod(period: string): Promise<Analytics[]> {
    return await db
      .select()
      .from(analytics)
      .where(eq(analytics.period, period));
  }

  async getAllAnalytics(): Promise<Analytics[]> {
    return await db.select().from(analytics);
  }

  // Forecasting methods
  async createForecast(insertForecast: InsertForecast): Promise<Forecast> {
    const now = new Date();
    const forecastWithTimestamp = {
      ...insertForecast,
      createdAt: now
    };
    const [forecast] = await db.insert(forecasts).values(forecastWithTimestamp).returning();
    return forecast;
  }

  async getForecastsByType(forecastType: string): Promise<Forecast[]> {
    return await db
      .select()
      .from(forecasts)
      .where(eq(forecasts.forecastType, forecastType));
  }

  async getAllForecasts(): Promise<Forecast[]> {
    return await db.select().from(forecasts);
  }

  // Social Media Platform methods
  async createSocialMediaPlatform(insertPlatform: InsertSocialMediaPlatform): Promise<SocialMediaPlatform> {
    const now = new Date();
    const platformWithTimestamp = {
      ...insertPlatform,
      createdAt: now,
      updatedAt: now,
      lastSyncedAt: null
    };
    const [platform] = await db.insert(socialMediaPlatforms).values(platformWithTimestamp).returning();
    return platform;
  }

  async getSocialMediaPlatform(id: number): Promise<SocialMediaPlatform | undefined> {
    const [platform] = await db.select().from(socialMediaPlatforms).where(eq(socialMediaPlatforms.id, id));
    return platform || undefined;
  }

  async getAllSocialMediaPlatforms(): Promise<SocialMediaPlatform[]> {
    return await db.select().from(socialMediaPlatforms);
  }

  async updateSocialMediaPlatform(id: number, data: Partial<InsertSocialMediaPlatform>): Promise<SocialMediaPlatform | undefined> {
    const now = new Date();
    const updatedData = {
      ...data,
      updatedAt: now
    };
    const [updatedPlatform] = await db
      .update(socialMediaPlatforms)
      .set(updatedData)
      .where(eq(socialMediaPlatforms.id, id))
      .returning();
    return updatedPlatform || undefined;
  }

  async deleteSocialMediaPlatform(id: number): Promise<boolean> {
    const result = await db.delete(socialMediaPlatforms).where(eq(socialMediaPlatforms.id, id)).returning();
    return result.length > 0;
  }

  // Social Media Lead methods
  async createSocialMediaLead(insertLead: InsertSocialMediaLead): Promise<SocialMediaLead> {
    const now = new Date();
    const leadWithTimestamp = {
      ...insertLead,
      createdAt: now,
      updatedAt: now,
      convertedToLeadId: null
    };
    const [lead] = await db.insert(socialMediaLeads).values(leadWithTimestamp).returning();
    return lead;
  }

  async getSocialMediaLead(id: number): Promise<SocialMediaLead | undefined> {
    const [lead] = await db.select().from(socialMediaLeads).where(eq(socialMediaLeads.id, id));
    return lead || undefined;
  }

  async getAllSocialMediaLeads(): Promise<SocialMediaLead[]> {
    return await db.select().from(socialMediaLeads);
  }

  async getSocialMediaLeadsByPlatform(platformId: number): Promise<SocialMediaLead[]> {
    return await db.select().from(socialMediaLeads).where(eq(socialMediaLeads.platformId, platformId));
  }

  async getSocialMediaLeadsByStatus(status: string): Promise<SocialMediaLead[]> {
    return await db.select().from(socialMediaLeads).where(eq(socialMediaLeads.status, status));
  }

  async updateSocialMediaLead(id: number, data: Partial<InsertSocialMediaLead>): Promise<SocialMediaLead | undefined> {
    const now = new Date();
    const updatedData = {
      ...data,
      updatedAt: now
    };
    const [updatedLead] = await db
      .update(socialMediaLeads)
      .set(updatedData)
      .where(eq(socialMediaLeads.id, id))
      .returning();
    return updatedLead || undefined;
  }

  async deleteSocialMediaLead(id: number): Promise<boolean> {
    const result = await db.delete(socialMediaLeads).where(eq(socialMediaLeads.id, id)).returning();
    return result.length > 0;
  }

  async convertSocialMediaLeadToLead(id: number, leadData: InsertLead): Promise<{socialMediaLead: SocialMediaLead, lead: Lead}> {
    // Create a new lead
    const lead = await this.createLead(leadData);

    // Update the social media lead to mark it as converted
    const now = new Date();
    const [updatedSocialMediaLead] = await db
      .update(socialMediaLeads)
      .set({
        status: 'converted',
        convertedToLeadId: lead.id,
        updatedAt: now
      })
      .where(eq(socialMediaLeads.id, id))
      .returning();

    if (!updatedSocialMediaLead) {
      throw new Error(`Failed to update social media lead with ID ${id}`);
    }

    return { socialMediaLead: updatedSocialMediaLead, lead };
  }
}

// Function to initialize the database with demo data
export async function initializeDemoData() {
  // Check if users already exist
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log('Database already contains data, skipping initialization');
    return;
  }
  
  console.log('Initializing database with demo data...');
  
  // Demo users
  const demoUsers = [
    { username: "john.doe", password: "password", fullName: "John Doe", role: "Sales Rep", avatar: "JD" },
    { username: "alice.smith", password: "password", fullName: "Alice Smith", role: "Sales Manager", avatar: "AS" },
    { username: "tom.jackson", password: "password", fullName: "Tom Jackson", role: "Sales Rep", avatar: "TJ" },
    { username: "kate.lee", password: "password", fullName: "Kate Lee", role: "Sales Rep", avatar: "KL" }
  ];
  
  const insertedUsers = await db.insert(users).values(demoUsers).returning();
  
  // Demo leads
  const leadSources = ['Website', 'Social Media', 'Referral', 'Outbound'];
  const leadStatuses = ['New', 'Contacted', 'Qualified', 'Unqualified'];
  
  const demoLeads = [
    {
      name: "Sarah Johnson",
      company: "TechCorp",
      email: "sjohnson@techcorp.com",
      phone: "555-123-4567",
      status: "Qualified",
      source: "Website",
      score: 82,
      assignedUserId: insertedUsers[0].id,
      notes: "Interested in our enterprise solution",
      createdAt: new Date(),
      lastContactedAt: null
    },
    {
      name: "Michael Brown",
      company: "Acme Corp",
      email: "mbrown@acme.com",
      phone: "555-987-6543",
      status: "Contacted",
      source: "Social Media",
      score: 64,
      assignedUserId: insertedUsers[1].id,
      notes: "Follow up next week",
      createdAt: new Date(),
      lastContactedAt: null
    },
    {
      name: "Jennifer Davis",
      company: "Global Enterprises",
      email: "jdavis@global.com",
      phone: "555-567-8901",
      status: "New",
      source: "Referral",
      score: 75,
      assignedUserId: insertedUsers[2].id,
      notes: "Referred by existing customer",
      createdAt: new Date(),
      lastContactedAt: null
    }
  ];
  
  const insertedLeads = await db.insert(leads).values(demoLeads).returning();

  // Demo deals
  const dealStages = ['Qualified Lead', 'Product Demo', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  
  const demoDeals = [
    {
      name: "TechCorp Software License",
      value: 24000,
      stage: "Qualified Lead",
      probability: 80,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      assignedUserId: insertedUsers[0].id,
      leadId: insertedLeads[0].id,
      notes: "Initial meeting scheduled",
      createdAt: new Date(),
      lastUpdatedAt: new Date()
    },
    {
      name: "Acme Corp Consultation",
      value: 8500,
      stage: "Proposal",
      probability: 40,
      expectedCloseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      assignedUserId: insertedUsers[1].id,
      leadId: insertedLeads[1].id,
      notes: "Budget concerns",
      createdAt: new Date(),
      lastUpdatedAt: new Date()
    },
    {
      name: "Global Enterprises SaaS",
      value: 56000,
      stage: "Product Demo",
      probability: 65,
      expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      assignedUserId: insertedUsers[2].id,
      leadId: insertedLeads[2].id,
      notes: "Demo scheduled for next week",
      createdAt: new Date(),
      lastUpdatedAt: new Date()
    }
  ];
  
  const insertedDeals = await db.insert(deals).values(demoDeals).returning();

  // Demo activities
  const demoActivities = [
    {
      type: "Call",
      description: "Initial discovery call",
      leadId: insertedLeads[0].id,
      dealId: null,
      userId: insertedUsers[0].id,
      createdAt: new Date()
    },
    {
      type: "Email",
      description: "Sent proposal document",
      leadId: null,
      dealId: insertedDeals[1].id,
      userId: insertedUsers[1].id,
      createdAt: new Date()
    },
    {
      type: "Meeting",
      description: "Product demo",
      leadId: null,
      dealId: insertedDeals[2].id,
      userId: insertedUsers[2].id,
      createdAt: new Date()
    }
  ];
  
  await db.insert(activities).values(demoActivities);

  // Demo analytics
  const demoAnalytics = [
    {
      metricType: "revenue",
      metricValue: 42500,
      period: "monthly",
      periodStart: new Date("2023-01-01"),
      periodEnd: new Date("2023-01-31"),
      metadata: { breakdown: { product: 30000, services: 12500 } },
      createdAt: new Date()
    },
    {
      metricType: "leads",
      metricValue: 24,
      period: "monthly",
      periodStart: new Date("2023-01-01"),
      periodEnd: new Date("2023-01-31"),
      metadata: { bySource: { website: 12, referral: 8, social: 4 } },
      createdAt: new Date()
    }
  ];
  
  await db.insert(analytics).values(demoAnalytics);

  // Demo forecasts
  const demoForecasts = [
    {
      forecastType: "revenue",
      forecastValue: 150000,
      period: "quarterly",
      periodStart: new Date("2023-01-01"),
      periodEnd: new Date("2023-03-31"),
      confidence: 0.8,
      metadata: {
        byMonth: [45000, 48000, 57000],
        deals: 12
      },
      createdAt: new Date()
    },
    {
      forecastType: "deals",
      forecastValue: 15,
      period: "monthly",
      periodStart: new Date("2023-02-01"),
      periodEnd: new Date("2023-02-28"),
      confidence: 0.7,
      metadata: {
        byStage: {
          "Qualified Lead": 5,
          "Product Demo": 4,
          "Proposal": 3,
          "Negotiation": 3
        }
      },
      createdAt: new Date()
    }
  ];
  
  await db.insert(forecasts).values(demoForecasts);
  
  // Demo social media platforms
  const demoSocialMediaPlatforms = [
    {
      name: "Twitter",
      icon: "twitter",
      apiKey: "demo_twitter_api_key",
      apiSecret: "demo_twitter_api_secret",
      accessToken: "demo_twitter_access_token",
      enabled: true,
      lastSyncedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      apiKey: "demo_linkedin_api_key",
      apiSecret: "demo_linkedin_api_secret",
      accessToken: "demo_linkedin_access_token",
      enabled: true,
      lastSyncedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Facebook",
      icon: "facebook",
      apiKey: "demo_facebook_api_key",
      apiSecret: "demo_facebook_api_secret",
      accessToken: "demo_facebook_access_token",
      enabled: false,
      lastSyncedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  const insertedPlatforms = await db.insert(socialMediaPlatforms).values(demoSocialMediaPlatforms).returning();
  
  // Demo social media leads
  const demoSocialMediaLeads = [
    {
      platformId: insertedPlatforms[0].id, // Twitter
      username: "tech_enthusiast",
      name: "Alex Tech",
      profileUrl: "https://twitter.com/tech_enthusiast",
      message: "Looking for a new CRM solution for our growing tech startup. Any recommendations?",
      sentiment: "positive",
      interactionType: "mention",
      originalPostUrl: "https://twitter.com/tech_enthusiast/status/12345678901234",
      status: "new",
      assignedUserId: insertedUsers[0].id,
      metadata: JSON.stringify({
        followers: 3500,
        following: 850,
        location: "San Francisco, CA",
        bio: "Tech startup founder | Product enthusiast | Always looking for innovative solutions"
      }),
      interactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      convertedToLeadId: null
    },
    {
      platformId: insertedPlatforms[1].id, // LinkedIn
      username: "sarah.marketing",
      name: "Sarah Peterson",
      profileUrl: "https://linkedin.com/in/sarah-marketing",
      message: "Our company is expanding our sales team and looking for software to help manage our growing pipeline. Would love to connect!",
      sentiment: "positive",
      interactionType: "direct_message",
      originalPostUrl: null,
      status: "contacted",
      assignedUserId: insertedUsers[1].id,
      metadata: JSON.stringify({
        title: "Marketing Director at GrowthCorp",
        connections: 1500,
        industry: "Marketing and Advertising",
        company_size: "51-200 employees"
      }),
      interactionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      convertedToLeadId: null
    },
    {
      platformId: insertedPlatforms[0].id, // Twitter
      username: "sales_guru",
      name: "Michael Sales",
      profileUrl: "https://twitter.com/sales_guru",
      message: "Frustrated with our current CRM. Too complicated and expensive for what we need. Any alternatives?",
      sentiment: "negative",
      interactionType: "comment",
      originalPostUrl: "https://twitter.com/tech_news/status/98765432109876",
      status: "new",
      assignedUserId: insertedUsers[2].id,
      metadata: JSON.stringify({
        followers: 2100,
        following: 540,
        location: "Chicago, IL",
        bio: "Sales professional | B2B specialist | Always on the lookout for better tools"
      }),
      interactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      convertedToLeadId: null
    }
  ];
  
  await db.insert(socialMediaLeads).values(demoSocialMediaLeads);
  
  console.log('Demo data initialization complete');
}