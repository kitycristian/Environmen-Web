import { Router } from "express";
import { createHash } from "crypto";
import { db } from "@workspace/db";
import { clientPortalUsers, clientReports } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

const hashPassword = (password: string): string =>
  createHash("sha256").update(password + "eea-portal-2024").digest("hex");

router.post("/portal/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ message: "Email y contraseña requeridos" });
    return;
  }
  const [user] = await db
    .select()
    .from(clientPortalUsers)
    .where(eq(clientPortalUsers.email, email.toLowerCase()));

  if (!user || !user.activo) {
    res.status(401).json({ message: "Email o contraseña incorrectos" });
    return;
  }
  if (user.password !== hashPassword(password)) {
    res.status(401).json({ message: "Email o contraseña incorrectos" });
    return;
  }
  req.session.portalUserId = user.id;
  res.json({ ok: true, nombre: user.nombre, email: user.email });
});

router.post("/portal/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/portal/me", async (req, res) => {
  const uid = req.session.portalUserId;
  if (!uid) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }
  const [user] = await db
    .select()
    .from(clientPortalUsers)
    .where(eq(clientPortalUsers.id, uid));
  if (!user || !user.activo) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }
  res.json({ nombre: user.nombre, email: user.email });
});

router.get("/portal/reports", async (req, res) => {
  const uid = req.session.portalUserId;
  if (!uid) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }
  const reports = await db
    .select({
      id: clientReports.id,
      titulo: clientReports.titulo,
      descripcion: clientReports.descripcion,
      tipoEstudio: clientReports.tipoEstudio,
      fechaEstudio: clientReports.fechaEstudio,
      pdfNombre: clientReports.pdfNombre,
      creadoEn: clientReports.creadoEn,
    })
    .from(clientReports)
    .where(eq(clientReports.clientPortalUserId, uid))
    .orderBy(desc(clientReports.creadoEn));
  res.json(reports);
});

router.get("/portal/reports/:id/pdf", async (req, res) => {
  const uid = req.session.portalUserId;
  if (!uid) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }
  const [report] = await db
    .select()
    .from(clientReports)
    .where(
      and(
        eq(clientReports.id, parseInt(String(req.params.id))),
        eq(clientReports.clientPortalUserId, uid),
      ),
    );
  if (!report) {
    res.status(404).json({ message: "No encontrado" });
    return;
  }
  const buffer = Buffer.from(report.pdfData, "base64");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${report.pdfNombre}"`);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.send(buffer);
});

export default router;
