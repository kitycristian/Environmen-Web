import { Router } from "express";
import { db } from "@workspace/db";
import { budgetRequests } from "@workspace/db";

const router = Router();

router.post("/budget-requests", async (req, res) => {
  try {
    const body = req.body as Record<string, unknown>;

    // Accept both legacy field names (web form) and new structured names (Vera)
    const origen   = (body["origen"]   as string | undefined) ?? "web-form";
    const nombre   = (body["nombre"]   as string | undefined)
                  ?? (body["contactoNombre"] as string | undefined)
                  ?? null;
    const empresa  = (body["empresa"]  as string | undefined)
                  ?? (body["razonSocial"] as string | undefined)
                  ?? null;
    const email    = (body["email"]    as string | undefined)
                  ?? (body["contactoEmail"] as string | undefined)
                  ?? null;
    const telefono = (body["telefono"] as string | undefined)
                  ?? (body["contactoTelefono"] as string | undefined)
                  ?? null;
    const estudio  = (body["estudio"]  as string | undefined) ?? null;
    const mensaje  = (body["mensaje"]  as string | undefined)
                  ?? (body["observaciones"] as string | undefined)
                  ?? null;
    const resumen  = (body["resumen"]  as string | undefined) ?? null;

    const [record] = await db.insert(budgetRequests).values({
      origen,
      nombre,
      empresa,
      email,
      telefono,
      estudio,
      mensaje,
      resumen,
    }).returning();

    req.log.info({ id: record.id, origen }, "budget-request created");
    res.status(201).json({ ok: true, id: record.id });
  } catch (err) {
    req.log.error(err, "budget-requests POST failed");
    res.status(500).json({ ok: false, error: "Error interno" });
  }
});

router.get("/budget-requests", async (req, res) => {
  try {
    const all = await db.select().from(budgetRequests).orderBy(budgetRequests.createdAt);
    res.json(all);
  } catch (err) {
    req.log.error(err, "budget-requests GET failed");
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
