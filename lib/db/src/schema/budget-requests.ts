import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const budgetRequests = pgTable("budget_requests", {
  id: serial("id").primaryKey(),
  origen: text("origen").notNull().default("web-form"),
  nombre: text("nombre"),
  empresa: text("empresa"),
  email: text("email"),
  telefono: text("telefono"),
  estudio: text("estudio"),
  mensaje: text("mensaje"),
  resumen: text("resumen"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBudgetRequestSchema = createInsertSchema(budgetRequests).omit({ id: true, createdAt: true });
export type InsertBudgetRequest = z.infer<typeof insertBudgetRequestSchema>;
export type BudgetRequest = typeof budgetRequests.$inferSelect;
