import { Router, type Request, type Response, type NextFunction } from "express";
import { createHash, randomBytes } from "crypto";
import { db } from "@workspace/db";
import { clientPortalUsers, clientReports } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

const hashPassword = (password: string) =>
  createHash("sha256").update(password + "eea-portal-2024").digest("hex");

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
};

const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const token = process.env["PORTAL_ADMIN_TOKEN"];
  if (!token) {
    res.status(503).json({ message: "PORTAL_ADMIN_TOKEN no configurado" });
    return;
  }
  const auth = req.headers["authorization"];
  if (auth !== `Bearer ${token}`) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  next();
};

router.get("/portal-users", requireAdmin, async (_req, res) => {
  const users = await db
    .select({
      id: clientPortalUsers.id,
      email: clientPortalUsers.email,
      nombre: clientPortalUsers.nombre,
      empresa: clientPortalUsers.empresa,
      activo: clientPortalUsers.activo,
      creadoEn: clientPortalUsers.creadoEn,
    })
    .from(clientPortalUsers)
    .orderBy(desc(clientPortalUsers.creadoEn));
  res.json(users);
});

router.post("/portal-users", requireAdmin, async (req, res) => {
  const { email, nombre, empresa } = req.body as {
    email?: string;
    nombre?: string;
    empresa?: string;
  };
  if (!email || !nombre) {
    res.status(400).json({ message: "Email y nombre requeridos" });
    return;
  }
  const password = generatePassword();
  const [user] = await db
    .insert(clientPortalUsers)
    .values({
      email: email.toLowerCase(),
      nombre,
      empresa,
      password: hashPassword(password),
    })
    .returning();

  if (process.env["SMTP_HOST"]) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: process.env["SMTP_HOST"],
        port: parseInt(process.env["SMTP_PORT"] ?? "587"),
        auth: { user: process.env["SMTP_USER"], pass: process.env["SMTP_PASS"] },
      });
      await transporter.sendMail({
        from: `"Environmental Express Argentina" <${process.env["SMTP_USER"]}>`,
        to: email,
        subject: "Acceso a tu portal de informes — EEA",
        html: `
<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto">
  <div style="background:#0D2F5E;padding:24px;text-align:center;border-radius:8px 8px 0 0">
    <h2 style="color:#fff;margin:0;font-size:18px">Environmental Express Argentina</h2>
    <p style="color:#7EC8A0;margin:6px 0 0;font-size:13px">Portal de Informes</p>
  </div>
  <div style="background:#f8fafc;padding:28px;border:1px solid #e2e8f0;border-radius:0 0 8px 8px">
    <p style="color:#1e293b;font-size:14px">Hola <strong>${nombre}</strong>,</p>
    <p style="color:#374151;font-size:13.5px;line-height:1.7">
      Tu informe de Higiene y Seguridad está disponible en el portal de EEA.
      Usá las siguientes credenciales para acceder:
    </p>
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin:20px 0">
      <div style="margin-bottom:10px">
        <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Email</span>
        <p style="color:#1e293b;font-size:14px;font-weight:600;margin:2px 0">${email}</p>
      </div>
      <div>
        <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Contraseña</span>
        <p style="color:#1e293b;font-size:18px;font-weight:800;letter-spacing:2px;margin:2px 0;font-family:monospace">${password}</p>
      </div>
    </div>
    <div style="text-align:center;margin:24px 0">
      <a href="https://envexar.com/portal"
        style="background:#166534;color:#fff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block">
        Acceder al portal →
      </a>
    </div>
  </div>
</div>`,
      });
    } catch (_e) {
    }
  }

  res.json({ ok: true, id: user.id, passwordGenerada: password });
});

router.post("/portal-users/:userId/reports", requireAdmin, async (req, res) => {  // eslint-disable-line
  const { titulo, descripcion, tipoEstudio, fechaEstudio, pdfBase64, pdfNombre } = req.body as {
    titulo?: string;
    descripcion?: string;
    tipoEstudio?: string;
    fechaEstudio?: string;
    pdfBase64?: string;
    pdfNombre?: string;
  };
  if (!titulo || !pdfBase64) {
    res.status(400).json({ message: "Título y PDF requeridos" });
    return;
  }

  const userId = parseInt(String(req.params.userId));
  const [report] = await db
    .insert(clientReports)
    .values({
      clientPortalUserId: userId,
      titulo,
      descripcion,
      tipoEstudio,
      fechaEstudio,
      pdfData: pdfBase64,
      pdfNombre: pdfNombre ?? "informe.pdf",
    })
    .returning();

  const [user] = await db
    .select()
    .from(clientPortalUsers)
    .where(eq(clientPortalUsers.id, userId));

  if (process.env["SMTP_HOST"] && user) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: process.env["SMTP_HOST"],
        port: parseInt(process.env["SMTP_PORT"] ?? "587"),
        auth: { user: process.env["SMTP_USER"], pass: process.env["SMTP_PASS"] },
      });
      await transporter.sendMail({
        from: `"Environmental Express Argentina" <${process.env["SMTP_USER"]}>`,
        to: user.email,
        subject: `📄 Tu informe está listo — ${titulo}`,
        html: `
<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto">
  <div style="background:#0D2F5E;padding:24px;text-align:center;border-radius:8px 8px 0 0">
    <h2 style="color:#fff;margin:0;font-size:18px">Environmental Express Argentina</h2>
    <p style="color:#7EC8A0;margin:6px 0 0;font-size:13px">Portal de Informes</p>
  </div>
  <div style="background:#f8fafc;padding:28px;border:1px solid #e2e8f0;border-radius:0 0 8px 8px">
    <p style="color:#1e293b;font-size:14px">Hola <strong>${user.nombre}</strong>,</p>
    <p style="color:#374151;font-size:13.5px;line-height:1.7">Tu informe de Higiene y Seguridad está listo para consultar:</p>
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin:20px 0;border-left:4px solid #166534">
      <p style="color:#1e293b;font-size:15px;font-weight:700;margin:0 0 4px">📄 ${titulo}</p>
      ${tipoEstudio ? `<p style="color:#166534;font-size:12px;font-weight:600;margin:0 0 4px">${tipoEstudio}</p>` : ""}
      ${fechaEstudio ? `<p style="color:#64748b;font-size:12px;margin:0">Fecha del estudio: ${fechaEstudio}</p>` : ""}
      ${descripcion ? `<p style="color:#374151;font-size:12.5px;margin:8px 0 0">${descripcion}</p>` : ""}
    </div>
    <div style="text-align:center;margin:24px 0">
      <a href="https://envexar.com/portal"
        style="background:#166534;color:#fff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block">
        Ver mi informe →
      </a>
    </div>
  </div>
</div>`,
      });
      await db
        .update(clientReports)
        .set({ notificacionEnviada: true })
        .where(eq(clientReports.id, report.id));
    } catch (_e) {
    }
  }

  res.json({ ok: true, id: report.id });
});

router.get("/portal-users/:userId/reports", requireAdmin, async (req, res) => {
  const userId = parseInt(String(req.params.userId));
  const reports = await db
    .select()
    .from(clientReports)
    .where(eq(clientReports.clientPortalUserId, userId))
    .orderBy(desc(clientReports.creadoEn));
  res.json(
    reports.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      descripcion: r.descripcion,
      tipoEstudio: r.tipoEstudio,
      fechaEstudio: r.fechaEstudio,
      pdfNombre: r.pdfNombre,
      notificacionEnviada: r.notificacionEnviada,
      creadoEn: r.creadoEn,
    })),
  );
});

router.get("/portal-reports-all", requireAdmin, async (_req, res) => {
  const reports = await db
    .select({
      id: clientReports.id,
      titulo: clientReports.titulo,
      tipoEstudio: clientReports.tipoEstudio,
      fechaEstudio: clientReports.fechaEstudio,
      notificacionEnviada: clientReports.notificacionEnviada,
      creadoEn: clientReports.creadoEn,
      userId: clientReports.clientPortalUserId,
      userNombre: clientPortalUsers.nombre,
      userEmpresa: clientPortalUsers.empresa,
    })
    .from(clientReports)
    .leftJoin(clientPortalUsers, eq(clientReports.clientPortalUserId, clientPortalUsers.id))
    .orderBy(desc(clientReports.creadoEn));
  res.json(reports);
});

router.delete("/portal-users/:id", requireAdmin, async (req, res) => {
  await db
    .update(clientPortalUsers)
    .set({ activo: false })
    .where(eq(clientPortalUsers.id, parseInt(String(req.params.id))));
  res.json({ ok: true });
});

export default router;
