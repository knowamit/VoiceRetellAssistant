import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original schema kept for users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Call records for the Retell AI integration
export const callRecords = pgTable("call_records", {
  id: serial("id").primaryKey(),
  callId: text("call_id").notNull().unique(),
  agentId: text("agent_id").notNull(),
  agentName: text("agent_name").notNull().default("Voice Agent"),
  status: text("status").notNull().default("created"),
  duration: text("duration").notNull().default("0:00"),
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  timestamp: text("timestamp").notNull(), // Formatted date for display
});

export const insertCallRecordSchema = createInsertSchema(callRecords).omit({
  id: true,
});

export type InsertCallRecord = z.infer<typeof insertCallRecordSchema>;
export type CallRecord = typeof callRecords.$inferSelect;

// API configuration
export const apiConfigs = pgTable("api_configs", {
  id: serial("id").primaryKey(),
  agentId: text("agent_id").notNull(),
  apiKey: text("api_key").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertApiConfigSchema = createInsertSchema(apiConfigs).omit({
  id: true,
  createdAt: true,
});

export type InsertApiConfig = z.infer<typeof insertApiConfigSchema>;
export type ApiConfig = typeof apiConfigs.$inferSelect;
