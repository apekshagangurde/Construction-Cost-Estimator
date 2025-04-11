import { pgTable, text, serial, integer, numeric, json, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (kept from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  length: numeric("length").notNull(),
  width: numeric("width").notNull(),
  height: numeric("height").notNull(),
  foundation: text("foundation").notNull(),
  structure: text("structure").notNull(),
  exterior: text("exterior").notNull(),
  roofing: text("roofing").notNull(),
  laborRate: numeric("labor_rate").notNull(),
  laborHours: numeric("labor_hours").notNull(),
  additionalRequirements: text("additional_requirements"),
  totalCost: numeric("total_cost").notNull(),
  materialsCost: numeric("materials_cost").notNull(),
  laborCost: numeric("labor_cost").notNull(),
  equipmentCost: numeric("equipment_cost").notNull(),
  overheadCost: numeric("overhead_cost").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  costBreakdown: jsonb("cost_breakdown"),
  optimizations: jsonb("optimizations"),
});

export const projectSchema = createInsertSchema(projects)
  .omit({ id: true, createdAt: true });

export const insertProjectSchema = projectSchema.omit({
  totalCost: true,
  materialsCost: true,
  laborCost: true,
  equipmentCost: true,
  overheadCost: true,
  costBreakdown: true,
  optimizations: true,
});

// Material costs table
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  unit: text("unit").notNull(),
  costPerUnit: numeric("cost_per_unit").notNull(),
});

export const insertMaterialSchema = createInsertSchema(materials).omit({
  id: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Material = typeof materials.$inferSelect;

// Form schemas with validation
export const projectFormSchema = insertProjectSchema
  .extend({
    name: z.string().min(3, "Project name must be at least 3 characters"),
    length: z.coerce.number().positive("Length must be positive"),
    width: z.coerce.number().positive("Width must be positive"),
    height: z.coerce.number().positive("Height must be positive"),
    laborRate: z.coerce.number().positive("Labor rate must be positive"),
    laborHours: z.coerce.number().positive("Labor hours must be positive"),
  });

// Cost breakdown item structure
export type CostBreakdownItem = {
  category: string;
  item: string;
  quantity: number;
  unit: string;
  unitCost: number;
  total: number;
};

// Optimization suggestion structure
export type OptimizationSuggestion = {
  category: string;
  description: string;
  savings: number;
};

// Project with cost calculations
export type ProjectWithCalculations = Project & {
  squareFootage: number;
  costPerSquareFoot: number;
  costBreakdownItems: CostBreakdownItem[];
  optimizationSuggestions: OptimizationSuggestion[];
  potentialSavings: number;
  optimizedCost: number;
  savingsPercentage: number;
};
