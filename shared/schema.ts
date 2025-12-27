import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  birthDate: text("birth_date").notNull(),
  birthTime: text("birth_time"),
  birthLocation: text("birth_location"),
  birthCity: text("birth_city"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  lifePath: integer("life_path").notNull(),
  lifePathLabel: text("life_path_label"),
  zodiacAnimal: text("zodiac_animal"),
  zodiacSign: text("zodiac_sign"),
  expressionNumber: integer("expression_number"),
  soulUrge: integer("soul_urge"),
  personality: integer("personality"),
  compatibilityPartner: text("compatibility_partner"),
  compatibilityScore: integer("compatibility_score"),
  reportData: text("report_data"), // New field to store full report JSON
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEvaluationSchema = createInsertSchema(evaluations).omit({
  id: true,
  createdAt: true,
});

export type InsertEvaluation = z.infer<typeof insertEvaluationSchema>;
export type Evaluation = typeof evaluations.$inferSelect;
