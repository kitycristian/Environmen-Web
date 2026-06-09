import { Router } from "express";
import { db } from "@workspace/db";
import { budgetRequests } from "@workspace/db";

const router = Router();

router.post("/budget-requests", async (req, res) => {
  try {
    const { origen, nombre, empresa, email, telefono, estudio, mensaje, resumen } = req.body as {
      origen?: string; nombre?: string; empresa?: string; email?: string;
      telefono?: string; estudio?: string; mensaje?: string; resumen?: string;
    };

    const [record] = await db.insert(budgetRequests).values({
      origen: origen ?? "web-form",
      nombre: nombre ?? null,
      empresa: empresa ?? null,
      email: email ?? null,
      telefono: telefono ?? null,
      estudio: estudio ?? null,
      mensaje: mensaje ?? null,
      resumen: resumen ?? null,
    }).returning();

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
