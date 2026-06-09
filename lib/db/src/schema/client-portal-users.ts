import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const clientPortalUsers = pgTable("client_portal_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  nombre: text("nombre").notNull(),
  empresa: text("empresa"),
  password: text("password").notNull(),
  activo: boolean("activo").notNull().default(true),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
});

export const insertClientPortalUserSchema = createInsertSchema(clientPortalUsers).omit({ id: true, creadoEn: true });
export type InsertClientPortalUser = z.infer<typeof insertClientPortalUserSchema>;
export type ClientPortalUser = typeof clientPortalUsers.$inferSelect;
