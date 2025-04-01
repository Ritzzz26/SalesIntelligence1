import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
  avatar: true,
});

// Lead schema
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status").notNull().default("new"),
  source: text("source").notNull(),
  score: integer("score"),
  assignedUserId: integer("assigned_user_id").references(() => users.id),
  lastContactedAt: timestamp("last_contacted_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  name: true,
  company: true,
  email: true,
  phone: true,
  status: true,
  source: true,
  score: true,
  assignedUserId: true,
  notes: true,
});

// Deal schema
export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: real("value").notNull(),
  stage: text("stage").notNull(),
  probability: integer("probability").notNull(),
  expectedCloseDate: timestamp("expected_close_date"),
  assignedUserId: integer("assigned_user_id").references(() => users.id),
  leadId: integer("lead_id").references(() => leads.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  lastUpdatedAt: timestamp("last_updated_at"),
});

export const insertDealSchema = createInsertSchema(deals).pick({
  name: true,
  value: true,
  stage: true,
  probability: true,
  expectedCloseDate: true,
  assignedUserId: true,
  leadId: true,
  notes: true,
});

// Activity schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  dealId: integer("deal_id").references(() => deals.id),
  leadId: integer("lead_id").references(() => leads.id),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  description: true,
  dealId: true,
  leadId: true,
  userId: true,
});

// Analytics schema
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  metricType: text("metric_type").notNull(),
  metricValue: real("metric_value").notNull(),
  period: text("period").notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  metricType: true,
  metricValue: true,
  period: true,
  periodStart: true,
  periodEnd: true,
  metadata: true,
});

// Forecast schema
export const forecasts = pgTable("forecasts", {
  id: serial("id").primaryKey(),
  forecastType: text("forecast_type").notNull(),
  forecastValue: real("forecast_value").notNull(),
  confidence: real("confidence").notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertForecastSchema = createInsertSchema(forecasts).pick({
  forecastType: true,
  forecastValue: true,
  confidence: true,
  periodStart: true,
  periodEnd: true,
  metadata: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

export type Forecast = typeof forecasts.$inferSelect;
export type InsertForecast = z.infer<typeof insertForecastSchema>;

// Competitive Intelligence
export const competitors = pgTable("competitors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  website: text("website"),
  notes: text("notes"),
  strengthsWeaknesses: text("strengths_weaknesses"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const competitorProducts = pgTable("competitor_products", {
  id: serial("id").primaryKey(),
  competitorId: integer("competitor_id").references(() => competitors.id).notNull(),
  name: text("name").notNull(),
  pricing: text("pricing"),
  features: text("features"),
  strengths: text("strengths"),
  weaknesses: text("weaknesses"),
  releaseDate: timestamp("release_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const competitiveMoves = pgTable("competitive_moves", {
  id: serial("id").primaryKey(),
  competitorId: integer("competitor_id").references(() => competitors.id).notNull(),
  moveType: text("move_type").notNull(), // e.g., "Product Launch", "Price Change", "Marketing Campaign"
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  impact: text("impact"), // e.g., "High", "Medium", "Low"
  responseNeeded: boolean("response_needed").default(false),
  response: text("response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCompetitorSchema = createInsertSchema(competitors).pick({
  name: true,
  industry: true,
  website: true,
  notes: true,
  strengthsWeaknesses: true,
});

export const insertCompetitorProductSchema = createInsertSchema(competitorProducts).pick({
  competitorId: true,
  name: true,
  pricing: true,
  features: true,
  strengths: true,
  weaknesses: true,
  releaseDate: true,
});

export const insertCompetitiveMoveSchema = createInsertSchema(competitiveMoves).pick({
  competitorId: true,
  moveType: true,
  description: true,
  date: true,
  impact: true,
  responseNeeded: true,
  response: true,
});

export type Competitor = typeof competitors.$inferSelect;
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;

export type CompetitorProduct = typeof competitorProducts.$inferSelect;
export type InsertCompetitorProduct = z.infer<typeof insertCompetitorProductSchema>;

export type CompetitiveMove = typeof competitiveMoves.$inferSelect;
export type InsertCompetitiveMove = z.infer<typeof insertCompetitiveMoveSchema>;

// Social Media Lead Capture
export const socialMediaPlatforms = pgTable("social_media_platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon"),
  apiKey: text("api_key"),
  apiSecret: text("api_secret"),
  accessToken: text("access_token"),
  enabled: boolean("enabled").default(true),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socialMediaLeads = pgTable("social_media_leads", {
  id: serial("id").primaryKey(),
  platformId: integer("platform_id").references(() => socialMediaPlatforms.id).notNull(),
  name: text("name"),
  username: text("username").notNull(),
  profileUrl: text("profile_url"),
  message: text("message"),
  sentiment: text("sentiment"),
  interactionType: text("interaction_type").notNull(), // e.g., "mention", "direct_message", "comment", "like"
  originalPostUrl: text("original_post_url"),
  status: text("status").default("new").notNull(), // e.g., "new", "contacted", "converted", "rejected"
  convertedToLeadId: integer("converted_to_lead_id").references(() => leads.id),
  assignedUserId: integer("assigned_user_id").references(() => users.id),
  metadata: text("metadata"), // JSON string with platform-specific metadata
  interactionDate: timestamp("interaction_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSocialMediaPlatformSchema = createInsertSchema(socialMediaPlatforms).pick({
  name: true,
  icon: true,
  apiKey: true,
  apiSecret: true,
  accessToken: true,
  enabled: true,
});

export const insertSocialMediaLeadSchema = createInsertSchema(socialMediaLeads).pick({
  platformId: true,
  name: true,
  username: true,
  profileUrl: true,
  message: true,
  sentiment: true,
  interactionType: true,
  originalPostUrl: true,
  status: true,
  assignedUserId: true,
  metadata: true,
  interactionDate: true,
});

export type SocialMediaPlatform = typeof socialMediaPlatforms.$inferSelect;
export type InsertSocialMediaPlatform = z.infer<typeof insertSocialMediaPlatformSchema>;

export type SocialMediaLead = typeof socialMediaLeads.$inferSelect;
export type InsertSocialMediaLead = z.infer<typeof insertSocialMediaLeadSchema>;
