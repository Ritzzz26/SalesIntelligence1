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

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Lead management
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: number): Promise<Lead | undefined>;
  updateLead(id: number, data: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;
  getAllLeads(): Promise<Lead[]>;
  getLeadsByAssignedUser(userId: number): Promise<Lead[]>;
  getLeadsBySource(source: string): Promise<Lead[]>;
  getLeadsByStatus(status: string): Promise<Lead[]>;

  // Deal management
  createDeal(deal: InsertDeal): Promise<Deal>;
  getDeal(id: number): Promise<Deal | undefined>;
  updateDeal(id: number, data: Partial<InsertDeal>): Promise<Deal | undefined>;
  deleteDeal(id: number): Promise<boolean>;
  getAllDeals(): Promise<Deal[]>;
  getDealsByStage(stage: string): Promise<Deal[]>;
  getDealsByAssignedUser(userId: number): Promise<Deal[]>;
  getDealsByLeadId(leadId: number): Promise<Deal[]>;

  // Activity tracking
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivitiesByDeal(dealId: number): Promise<Activity[]>;
  getActivitiesByLead(leadId: number): Promise<Activity[]>;
  getActivitiesByUser(userId: number): Promise<Activity[]>;
  getAllActivities(): Promise<Activity[]>;

  // Analytics
  createAnalyticsEntry(entry: InsertAnalytics): Promise<Analytics>;
  getAnalyticsByType(metricType: string): Promise<Analytics[]>;
  getAnalyticsByPeriod(period: string): Promise<Analytics[]>;
  getAllAnalytics(): Promise<Analytics[]>;

  // Forecasting
  createForecast(forecast: InsertForecast): Promise<Forecast>;
  getForecastsByType(forecastType: string): Promise<Forecast[]>;
  getAllForecasts(): Promise<Forecast[]>;

  // Social Media Lead Capture
  createSocialMediaPlatform(platform: InsertSocialMediaPlatform): Promise<SocialMediaPlatform>;
  getSocialMediaPlatform(id: number): Promise<SocialMediaPlatform | undefined>;
  getAllSocialMediaPlatforms(): Promise<SocialMediaPlatform[]>;
  updateSocialMediaPlatform(id: number, data: Partial<InsertSocialMediaPlatform>): Promise<SocialMediaPlatform | undefined>;
  deleteSocialMediaPlatform(id: number): Promise<boolean>;
  
  createSocialMediaLead(lead: InsertSocialMediaLead): Promise<SocialMediaLead>;
  getSocialMediaLead(id: number): Promise<SocialMediaLead | undefined>;
  getAllSocialMediaLeads(): Promise<SocialMediaLead[]>;
  getSocialMediaLeadsByPlatform(platformId: number): Promise<SocialMediaLead[]>;
  getSocialMediaLeadsByStatus(status: string): Promise<SocialMediaLead[]>;
  updateSocialMediaLead(id: number, data: Partial<InsertSocialMediaLead>): Promise<SocialMediaLead | undefined>;
  deleteSocialMediaLead(id: number): Promise<boolean>;
  convertSocialMediaLeadToLead(id: number, leadData: InsertLead): Promise<{socialMediaLead: SocialMediaLead, lead: Lead}>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private deals: Map<number, Deal>;
  private activities: Map<number, Activity>;
  private analytics: Map<number, Analytics>;
  private forecasts: Map<number, Forecast>;
  private socialMediaPlatforms: Map<number, SocialMediaPlatform>;
  private socialMediaLeads: Map<number, SocialMediaLead>;
  
  private userIdCounter: number;
  private leadIdCounter: number;
  private dealIdCounter: number;
  private activityIdCounter: number;
  private analyticsIdCounter: number;
  private forecastIdCounter: number;
  private socialMediaPlatformIdCounter: number;
  private socialMediaLeadIdCounter: number;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.deals = new Map();
    this.activities = new Map();
    this.analytics = new Map();
    this.forecasts = new Map();
    this.socialMediaPlatforms = new Map();
    this.socialMediaLeads = new Map();
    
    this.userIdCounter = 1;
    this.leadIdCounter = 1;
    this.dealIdCounter = 1;
    this.activityIdCounter = 1;
    this.analyticsIdCounter = 1;
    this.forecastIdCounter = 1;
    this.socialMediaPlatformIdCounter = 1;
    this.socialMediaLeadIdCounter = 1;
    
    // Add demo users
    this.createUser({
      username: "john.doe",
      password: "password",
      fullName: "John Doe",
      role: "Sales Rep",
      avatar: "JD"
    });
    
    this.createUser({
      username: "alice.smith",
      password: "password",
      fullName: "Alice Smith",
      role: "Sales Manager",
      avatar: "AS"
    });
    
    this.createUser({
      username: "tom.jackson",
      password: "password",
      fullName: "Tom Jackson",
      role: "Sales Rep",
      avatar: "TJ"
    });
    
    this.createUser({
      username: "kate.lee",
      password: "password",
      fullName: "Kate Lee",
      role: "Sales Rep",
      avatar: "KL"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Lead methods
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.leadIdCounter++;
    const now = new Date();
    const lead: Lead = { 
      ...insertLead, 
      id, 
      createdAt: now, 
      lastContactedAt: null 
    };
    this.leads.set(id, lead);
    return lead;
  }
  
  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }
  
  async updateLead(id: number, data: Partial<InsertLead>): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    
    const updatedLead = { ...lead, ...data };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }
  
  async deleteLead(id: number): Promise<boolean> {
    return this.leads.delete(id);
  }
  
  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }
  
  async getLeadsByAssignedUser(userId: number): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(
      (lead) => lead.assignedUserId === userId
    );
  }
  
  async getLeadsBySource(source: string): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(
      (lead) => lead.source === source
    );
  }
  
  async getLeadsByStatus(status: string): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(
      (lead) => lead.status === status
    );
  }

  // Deal methods
  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const id = this.dealIdCounter++;
    const now = new Date();
    const deal: Deal = { 
      ...insertDeal, 
      id, 
      createdAt: now, 
      lastUpdatedAt: now 
    };
    this.deals.set(id, deal);
    return deal;
  }
  
  async getDeal(id: number): Promise<Deal | undefined> {
    return this.deals.get(id);
  }
  
  async updateDeal(id: number, data: Partial<InsertDeal>): Promise<Deal | undefined> {
    const deal = this.deals.get(id);
    if (!deal) return undefined;
    
    const now = new Date();
    const updatedDeal = { ...deal, ...data, lastUpdatedAt: now };
    this.deals.set(id, updatedDeal);
    return updatedDeal;
  }
  
  async deleteDeal(id: number): Promise<boolean> {
    return this.deals.delete(id);
  }
  
  async getAllDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values());
  }
  
  async getDealsByStage(stage: string): Promise<Deal[]> {
    return Array.from(this.deals.values()).filter(
      (deal) => deal.stage === stage
    );
  }
  
  async getDealsByAssignedUser(userId: number): Promise<Deal[]> {
    return Array.from(this.deals.values()).filter(
      (deal) => deal.assignedUserId === userId
    );
  }
  
  async getDealsByLeadId(leadId: number): Promise<Deal[]> {
    return Array.from(this.deals.values()).filter(
      (deal) => deal.leadId === leadId
    );
  }

  // Activity methods
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const now = new Date();
    const activity: Activity = { 
      ...insertActivity, 
      id, 
      createdAt: now 
    };
    this.activities.set(id, activity);
    return activity;
  }
  
  async getActivitiesByDeal(dealId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.dealId === dealId
    );
  }
  
  async getActivitiesByLead(leadId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.leadId === leadId
    );
  }
  
  async getActivitiesByUser(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.userId === userId
    );
  }
  
  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  // Analytics methods
  async createAnalyticsEntry(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = this.analyticsIdCounter++;
    const now = new Date();
    const analytics: Analytics = { 
      ...insertAnalytics, 
      id, 
      createdAt: now 
    };
    this.analytics.set(id, analytics);
    return analytics;
  }
  
  async getAnalyticsByType(metricType: string): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(
      (analytics) => analytics.metricType === metricType
    );
  }
  
  async getAnalyticsByPeriod(period: string): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(
      (analytics) => analytics.period === period
    );
  }
  
  async getAllAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values());
  }

  // Forecasting methods
  async createForecast(insertForecast: InsertForecast): Promise<Forecast> {
    const id = this.forecastIdCounter++;
    const now = new Date();
    const forecast: Forecast = { 
      ...insertForecast, 
      id, 
      createdAt: now 
    };
    this.forecasts.set(id, forecast);
    return forecast;
  }
  
  async getForecastsByType(forecastType: string): Promise<Forecast[]> {
    return Array.from(this.forecasts.values()).filter(
      (forecast) => forecast.forecastType === forecastType
    );
  }
  
  async getAllForecasts(): Promise<Forecast[]> {
    return Array.from(this.forecasts.values());
  }

  // Social Media Platform methods
  async createSocialMediaPlatform(insertPlatform: InsertSocialMediaPlatform): Promise<SocialMediaPlatform> {
    const id = this.socialMediaPlatformIdCounter++;
    const now = new Date();
    const platform: SocialMediaPlatform = {
      ...insertPlatform,
      id,
      lastSyncedAt: null,
      createdAt: now,
      updatedAt: now
    };
    this.socialMediaPlatforms.set(id, platform);
    return platform;
  }

  async getSocialMediaPlatform(id: number): Promise<SocialMediaPlatform | undefined> {
    return this.socialMediaPlatforms.get(id);
  }

  async getAllSocialMediaPlatforms(): Promise<SocialMediaPlatform[]> {
    return Array.from(this.socialMediaPlatforms.values());
  }

  async updateSocialMediaPlatform(id: number, data: Partial<InsertSocialMediaPlatform>): Promise<SocialMediaPlatform | undefined> {
    const platform = this.socialMediaPlatforms.get(id);
    if (!platform) return undefined;

    const now = new Date();
    const updatedPlatform = { ...platform, ...data, updatedAt: now };
    this.socialMediaPlatforms.set(id, updatedPlatform);
    return updatedPlatform;
  }

  async deleteSocialMediaPlatform(id: number): Promise<boolean> {
    return this.socialMediaPlatforms.delete(id);
  }

  // Social Media Lead methods
  async createSocialMediaLead(insertLead: InsertSocialMediaLead): Promise<SocialMediaLead> {
    const id = this.socialMediaLeadIdCounter++;
    const now = new Date();
    const lead: SocialMediaLead = {
      ...insertLead,
      id,
      convertedToLeadId: null,
      createdAt: now,
      updatedAt: now
    };
    this.socialMediaLeads.set(id, lead);
    return lead;
  }

  async getSocialMediaLead(id: number): Promise<SocialMediaLead | undefined> {
    return this.socialMediaLeads.get(id);
  }

  async getAllSocialMediaLeads(): Promise<SocialMediaLead[]> {
    return Array.from(this.socialMediaLeads.values());
  }

  async getSocialMediaLeadsByPlatform(platformId: number): Promise<SocialMediaLead[]> {
    return Array.from(this.socialMediaLeads.values()).filter(
      (lead) => lead.platformId === platformId
    );
  }

  async getSocialMediaLeadsByStatus(status: string): Promise<SocialMediaLead[]> {
    return Array.from(this.socialMediaLeads.values()).filter(
      (lead) => lead.status === status
    );
  }

  async updateSocialMediaLead(id: number, data: Partial<InsertSocialMediaLead>): Promise<SocialMediaLead | undefined> {
    const lead = this.socialMediaLeads.get(id);
    if (!lead) return undefined;

    const now = new Date();
    const updatedLead = { ...lead, ...data, updatedAt: now };
    this.socialMediaLeads.set(id, updatedLead);
    return updatedLead;
  }

  async deleteSocialMediaLead(id: number): Promise<boolean> {
    return this.socialMediaLeads.delete(id);
  }

  async convertSocialMediaLeadToLead(id: number, leadData: InsertLead): Promise<{socialMediaLead: SocialMediaLead, lead: Lead}> {
    // Create a new lead
    const lead = await this.createLead(leadData);

    // Update the social media lead to mark it as converted
    const socialMediaLead = await this.getSocialMediaLead(id);
    if (!socialMediaLead) {
      throw new Error(`Social media lead with ID ${id} not found`);
    }

    const updatedSocialMediaLead = await this.updateSocialMediaLead(id, {
      status: 'converted',
      convertedToLeadId: lead.id
    } as Partial<InsertSocialMediaLead>);

    if (!updatedSocialMediaLead) {
      throw new Error(`Failed to update social media lead with ID ${id}`);
    }

    return { socialMediaLead: updatedSocialMediaLead, lead };
  }
}

// Switch from MemStorage to DatabaseStorage
import { DatabaseStorage, initializeDemoData } from './database-storage';
export const storage = new DatabaseStorage();

// Initialize database with demo data
initializeDemoData().catch(error => {
  console.error('Error initializing demo data:', error);
});

// The following in-memory demo data initialization is no longer used
// because we now use the database storage
/* Old implementation that is no longer used:
async function initializeDemoData() {
  const users = await storage.getAllUsers();
  
  // Create demo leads if none exist
  const leads = await storage.getAllLeads();
  if (leads.length === 0) {
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
        assignedUserId: users[0].id,
        notes: "Interested in our enterprise solution"
      },
      {
        name: "Michael Brown",
        company: "Acme Corp",
        email: "mbrown@acme.com",
        phone: "555-987-6543",
        status: "Contacted",
        source: "Social Media",
        score: 64,
        assignedUserId: users[1].id,
        notes: "Follow up next week"
      },
      {
        name: "Jennifer Davis",
        company: "Global Enterprises",
        email: "jdavis@global.com",
        phone: "555-567-8901",
        status: "New",
        source: "Referral",
        score: 75,
        assignedUserId: users[2].id,
        notes: "Referred by existing customer"
      },
      {
        name: "Robert Wilson",
        company: "Sunrise Media",
        email: "rwilson@sunrise.com",
        phone: "555-234-5678",
        status: "Qualified",
        source: "Website",
        score: 88,
        assignedUserId: users[3].id,
        notes: "Ready for product demo"
      },
      {
        name: "Lisa Martin",
        company: "XYZ Inc",
        email: "lmartin@xyz.com",
        phone: "555-876-5432",
        status: "Contacted",
        source: "Outbound",
        score: 55,
        assignedUserId: users[0].id,
        notes: "Initial contact made"
      }
    ];
    
    // Add more random leads to get a total of 20
    const companies = ["Innovex", "DataStream", "MediaTech", "BrightPath", "NexTier", "OmniSoft", "PrimeSolutions", "VertexSystems", "CloudWave", "DigitalEdge", "VisionForge", "PeakTech", "AlphaInnovate", "CoreSystems"];
    const names = ["David Smith", "Amanda Jones", "Chris Wilson", "Melissa Brown", "Jason Miller", "Stephanie Davis", "Ryan Thomas", "Jessica Clark", "Kevin Moore", "Natalie White", "Brandon Harris", "Rachel Martinez", "Daniel Taylor", "Laura Robinson"];
    
    for (let i = 0; i < 15; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const source = leadSources[Math.floor(Math.random() * leadSources.length)];
      const status = leadStatuses[Math.floor(Math.random() * leadStatuses.length)];
      const assignedUserId = users[Math.floor(Math.random() * users.length)].id;
      const score = Math.floor(Math.random() * 50) + 50;
      
      demoLeads.push({
        name,
        company,
        email: `${name.toLowerCase().replace(" ", ".")}@${company.toLowerCase().replace(" ", "")}.com`,
        phone: `555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        status,
        source,
        score,
        assignedUserId,
        notes: "Potential opportunity"
      });
    }
    
    for (const lead of demoLeads) {
      await storage.createLead(lead);
    }
  }
  
  // Create demo deals if none exist
  const deals = await storage.getAllDeals();
  if (deals.length === 0) {
    const dealStages = ['Qualified Lead', 'Product Demo', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    
    const demoDeals = [
      {
        name: "TechCorp Software License",
        value: 24000,
        stage: "Qualified Lead",
        probability: 80,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        assignedUserId: users[0].id,
        leadId: 1,
        notes: "Initial meeting scheduled"
      },
      {
        name: "Acme Corp Consultation",
        value: 8500,
        stage: "Qualified Lead",
        probability: 40,
        expectedCloseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        assignedUserId: users[1].id,
        leadId: 2,
        notes: "Budget concerns"
      },
      {
        name: "Global Enterprises SaaS",
        value: 56000,
        stage: "Product Demo",
        probability: 65,
        expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        assignedUserId: users[2].id,
        leadId: 3,
        notes: "Demo scheduled for next week"
      },
      {
        name: "Sunrise Media Marketing",
        value: 12800,
        stage: "Proposal",
        probability: 72,
        expectedCloseDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        assignedUserId: users[3].id,
        leadId: 4,
        notes: "Proposal sent, awaiting feedback"
      },
      {
        name: "XYZ Corp Enterprise Deal",
        value: 78000,
        stage: "Negotiation",
        probability: 55,
        expectedCloseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        assignedUserId: users[1].id,
        leadId: 5,
        notes: "Contract under review"
      },
      {
        name: "Innovex Platform Upgrade",
        value: 42000,
        stage: "Closed Won",
        probability: 100,
        expectedCloseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        assignedUserId: users[0].id,
        leadId: 1,
        notes: "Contract signed"
      }
    ];
    
    // Add more random deals to get a total of 15
    for (let i = 0; i < 9; i++) {
      const existingLeads = await storage.getAllLeads();
      const randomLead = existingLeads[Math.floor(Math.random() * existingLeads.length)];
      const stage = dealStages[Math.floor(Math.random() * dealStages.length)];
      const value = Math.floor(Math.random() * 70000) + 5000;
      const probability = stage === 'Closed Won' ? 100 : stage === 'Closed Lost' ? 0 : Math.floor(Math.random() * 60) + 30;
      const daysToClose = Math.floor(Math.random() * 60) + 5;
      const assignedUserId = users[Math.floor(Math.random() * users.length)].id;
      
      demoDeals.push({
        name: `${randomLead.company} ${['Software', 'Consulting', 'Integration', 'Support', 'Training'][Math.floor(Math.random() * 5)]}`,
        value,
        stage,
        probability,
        expectedCloseDate: new Date(Date.now() + daysToClose * 24 * 60 * 60 * 1000),
        assignedUserId,
        leadId: randomLead.id,
        notes: "In progress"
      });
    }
    
    for (const deal of demoDeals) {
      await storage.createDeal(deal);
    }
  }
  
  // Create demo analytics if none exist
  const analytics = await storage.getAllAnalytics();
  if (analytics.length === 0) {
    const periodStart = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const periodEnd = new Date();
    
    // Revenue data
    await storage.createAnalyticsEntry({
      metricType: "revenue",
      metricValue: 428560,
      period: "quarter",
      periodStart,
      periodEnd,
      metadata: {
        previousPeriodValue: 362800,
        percentChange: 18.2
      }
    });
    
    // Deals won data
    await storage.createAnalyticsEntry({
      metricType: "deals_won",
      metricValue: 42,
      period: "quarter",
      periodStart,
      periodEnd,
      metadata: {
        previousPeriodValue: 39,
        percentChange: 7.4
      }
    });
    
    // New leads data
    await storage.createAnalyticsEntry({
      metricType: "new_leads",
      metricValue: 186,
      period: "quarter",
      periodStart,
      periodEnd,
      metadata: {
        previousPeriodValue: 193,
        percentChange: -3.8
      }
    });
    
    // Conversion rate data
    await storage.createAnalyticsEntry({
      metricType: "conversion_rate",
      metricValue: 24.8,
      period: "quarter",
      periodStart,
      periodEnd,
      metadata: {
        previousPeriodValue: 24.2,
        percentChange: 2.1
      }
    });
    
    // Lead source breakdown
    await storage.createAnalyticsEntry({
      metricType: "lead_sources",
      metricValue: 0, // Not applicable for this type
      period: "quarter",
      periodStart,
      periodEnd,
      metadata: {
        website: 42,
        socialMedia: 28,
        referral: 18,
        outbound: 12
      }
    });
    
    // Revenue trend data (monthly for the last 9 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const currentRevenue = [28000, 32000, 36000, 42000, 35000, 46000, 52000, 58000, 62000];
    const previousRevenue = [22000, 25000, 30000, 32000, 28000, 34000, 38000, 42000, 45000];
    
    await storage.createAnalyticsEntry({
      metricType: "revenue_trend",
      metricValue: 0, // Not applicable for this type
      period: "year",
      periodStart: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000),
      periodEnd,
      metadata: {
        months,
        currentPeriod: currentRevenue,
        previousPeriod: previousRevenue
      }
    });
    
    // Team performance data
    await storage.createAnalyticsEntry({
      metricType: "team_performance",
      metricValue: 0, // Not applicable for this type
      period: "quarter",
      periodStart,
      periodEnd,
      metadata: {
        teamMembers: [
          {
            userId: users[0].id,
            name: users[0].fullName,
            avatar: users[0].avatar,
            revenue: 142500,
            target: 127000,
            percentOfTarget: 112,
            deals: 6
          },
          {
            userId: users[1].id,
            name: users[1].fullName,
            avatar: users[1].avatar,
            revenue: 124800,
            target: 120000,
            percentOfTarget: 104,
            deals: 8
          },
          {
            userId: users[2].id,
            name: users[2].fullName,
            avatar: users[2].avatar,
            revenue: 98200,
            target: 107000,
            percentOfTarget: 92,
            deals: 5
          },
          {
            userId: users[3].id,
            name: users[3].fullName,
            avatar: users[3].avatar,
            revenue: 63060,
            target: 81000,
            percentOfTarget: 78,
            deals: 3
          }
        ]
      }
    });
    
    // Customer sentiment data
    await storage.createAnalyticsEntry({
      metricType: "customer_sentiment",
      metricValue: 76, // NPS score
      period: "quarter",
      periodStart,
      periodEnd,
      metadata: {
        promoters: 62,
        neutral: 28,
        detractors: 10,
        positiveThemes: ["Customer support", "Ease of use", "Reliability", "Integration"],
        improvementAreas: ["Pricing", "Mobile app", "Feature requests"]
      }
    });
  }
  
  // Create demo forecasts if none exist
  const forecasts = await storage.getAllForecasts();
  if (forecasts.length === 0) {
    const currentQuarterStart = new Date();
    currentQuarterStart.setMonth(Math.floor(currentQuarterStart.getMonth() / 3) * 3, 1);
    currentQuarterStart.setHours(0, 0, 0, 0);
    
    const currentQuarterEnd = new Date(currentQuarterStart);
    currentQuarterEnd.setMonth(currentQuarterEnd.getMonth() + 3, 0);
    currentQuarterEnd.setHours(23, 59, 59, 999);
    
    // Quarter forecast
    await storage.createForecast({
      forecastType: "revenue",
      forecastValue: 500000,
      confidence: 0.92,
      periodStart: currentQuarterStart,
      periodEnd: currentQuarterEnd,
      metadata: {
        currentProgress: 390000,
        percentAchieved: 78,
        predictions: [
          {
            type: "deal",
            description: "High chance of closing Tech Solutions deal",
            value: 45000,
            probability: 0.89
          },
          {
            type: "risk",
            description: "Enterprise deal needs attention",
            value: 78000,
            detail: "No activity for 14 days"
          },
          {
            type: "insight",
            description: "Q3 forecast on track to exceed by 8%",
            detail: "Based on current pipeline velocity"
          }
        ]
      }
    });
    
    // Monthly forecasts for next 3 months
    const nextMonthStart = new Date();
    nextMonthStart.setDate(1);
    nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
    nextMonthStart.setHours(0, 0, 0, 0);
    
    const nextMonthEnd = new Date(nextMonthStart);
    nextMonthEnd.setMonth(nextMonthEnd.getMonth() + 1, 0);
    nextMonthEnd.setHours(23, 59, 59, 999);
    
    await storage.createForecast({
      forecastType: "revenue",
      forecastValue: 65000,
      confidence: 0.85,
      periodStart: nextMonthStart,
      periodEnd: nextMonthEnd,
      metadata: {
        deals: 4,
        avgDealSize: 16250
      }
    });
    
    const month2Start = new Date(nextMonthStart);
    month2Start.setMonth(month2Start.getMonth() + 1);
    
    const month2End = new Date(month2Start);
    month2End.setMonth(month2End.getMonth() + 1, 0);
    month2End.setHours(23, 59, 59, 999);
    
    await storage.createForecast({
      forecastType: "revenue",
      forecastValue: 72000,
      confidence: 0.80,
      periodStart: month2Start,
      periodEnd: month2End,
      metadata: {
        deals: 5,
        avgDealSize: 14400
      }
    });
    
    const month3Start = new Date(month2Start);
    month3Start.setMonth(month3Start.getMonth() + 1);
    
    const month3End = new Date(month3Start);
    month3End.setMonth(month3End.getMonth() + 1, 0);
    month3End.setHours(23, 59, 59, 999);
    
    await storage.createForecast({
      forecastType: "revenue",
      forecastValue: 78000,
      confidence: 0.75,
      periodStart: month3Start,
      periodEnd: month3End,
      metadata: {
        deals: 6,
        avgDealSize: 13000
      }
    });
  }
}

// Old initializeDemoData function is no longer used
// initializeDemoData();
*/
