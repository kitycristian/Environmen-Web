import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientPortalUsers } from "./client-portal-users";

export const clientReports = pgTable("client_reports", {
  id: serial("id").primaryKey(),
  clientPortalUserId: integer("client_portal_user_id").notNull().references(() => clientPortalUsers.id),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  tipoEstudio: text("tipo_estudio"),
  fechaEstudio: text("fecha_estudio"),
  pdfData: text("pdf_data").notNull(),
  pdfNombre: text("pdf_nombre").notNull().default("informe.pdf"),
  notificacionEnviada: boolean("notificacion_enviada").notNull().default(false),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
});

export const insertClientReportSchema = createInsertSchema(clientReports).omit({ id: true, creadoEn: true });
export type InsertClientReport = z.infer<typeof insertClientReportSchema>;
export type ClientReport = typeof clientReports.$inferSelect;
