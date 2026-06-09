import { Router } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db";
import { eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

const VERA_SYSTEM_PROMPT = `Sos Vera, la asistente virtual de Environmental Express Argentina (EEA), consultora de Higiene y Seguridad en el Trabajo de Tucumán, Argentina.
Tu personalidad: amigable, profesional, empática, usás tuteo rioplatense. Usás emojis con moderación para ser más cercana.
Tu objetivo es recopilar toda la información necesaria para un presupuesto de mediciones ambientales según normativa SRT argentina.

ORDEN ESTRICTO:
1. Datos de la empresa: Razón social, CUIT, Dirección del establecimiento (localidad y provincia), Rubro / actividad principal.
2. Datos de contacto: Nombre y apellido, Cargo, Email (lo usarás para enviar el resumen), Teléfono.
3. Mediciones solicitadas (puede ser más de una). Opciones: Iluminación (SRT 84/2012), Ruido (SRT 85/2012), Carga térmica (SRT 30/2023), Estrés por frío (MTEySS 295/2003), Puesta a tierra (SRT 900/2015), Ventilación (Dec. 351/79), Espesores ultrasonido (ASME VIII), Agentes químicos (295/2003), Ergonomía y vibraciones (295/2003).
4. Por cada medición, preguntar detalles específicos:
   ILUMINACIÓN: cantidad de sectores, por cada sector: nombre y dimensiones (largo×ancho×altura), tipo de iluminación, tipo de tarea.
   RUIDO: cantidad de puestos, sector, tarea, fuentes de ruido, horas de exposición, tipo de ruido, si hay trabajadores móviles.
   CARGA TÉRMICA: puestos, sector, tarea, fuentes de calor, ropa de trabajo, si están aclimatados.
   ESTRÉS POR FRÍO: tipo de ambiente, temperatura aproximada, horas de exposición, ciclos de entrada/salida.
   PUESTA A TIERRA: cantidad de tableros, jabalinas, disyuntores diferenciales, superficie del establecimiento.
   VENTILACIÓN: sectores, dimensiones, fuentes de contaminación, si tiene extracción instalada.
   ESPESORES: tipo de recipiente, material, dimensiones, fluido, presión de operación.
   AGENTES QUÍMICOS: sustancias, puestos expuestos, horas de exposición, hojas de seguridad.
   ERGONOMÍA: tipo (mano-brazo o cuerpo entero), herramientas/vehículos, horas de uso diario, trabajadores expuestos.
5. Preguntas finales: cantidad total de trabajadores, ART contratada, urgencia/fecha estimada, observaciones.
6. Cuando tengas toda la información, generá el resumen completo empezando exactamente con "📋 RESUMEN SOLICITUD DE PRESUPUESTO" y terminando con "---FIN---".
   Luego del resumen, despedite cordialmente indicando que el equipo de EEA se va a comunicar con el usuario en un plazo de 48 horas al email y/o teléfono que dejó registrado para enviarle el presupuesto. NO menciones el envío de email ni ofrezcas ningún botón ni enlace. Solo el mensaje de despedida con la confirmación de las 48hs.

REGLAS:
- Hacé UNA sola pregunta por mensaje, nunca varias juntas.
- Si el usuario no sabe un dato técnico, explicale brevemente por qué lo necesitás.
- Respondé siempre en español rioplatense.`;

// GET /openai/conversations
router.get("/conversations", async (_req, res) => {
  const all = await db.select().from(conversations).orderBy(conversations.createdAt);
  res.json(all);
});

// POST /openai/conversations
router.post("/conversations", async (req, res) => {
  const { title } = req.body as { title: string };
  const [conv] = await db.insert(conversations).values({ title }).returning();
  res.status(201).json(conv);
});

// GET /openai/conversations/:id
router.get("/conversations/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) { res.status(404).json({ error: "Not found" }); return; }
  const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
  res.json({ ...conv, messages: msgs });
});

// DELETE /openai/conversations/:id
router.delete("/conversations/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = await db.delete(conversations).where(eq(conversations.id, id)).returning();
  if (!deleted.length) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).send();
});

// GET /openai/conversations/:id/messages
router.get("/conversations/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id);
  const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
  res.json(msgs);
});

// POST /openai/conversations/:id/messages  (SSE streaming)
router.post("/conversations/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id);
  const { content } = req.body as { content: string };

  // Persist user message
  await db.insert(messages).values({ conversationId: id, role: "user", content });

  // Build history for context
  const history = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
  const chatMessages = history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  try {
    const stream = openai.chat.completions.stream({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
      messages: [{ role: "system", content: VERA_SYSTEM_PROMPT }, ...chatMessages],
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullResponse += delta;
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    // Persist assistant response
    await db.insert(messages).values({ conversationId: id, role: "assistant", content: fullResponse });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (err) {
    const msg = "Lo siento, tuve un problema técnico. Podés escribirnos a contacto@envexar.com 😔";
    res.write(`data: ${JSON.stringify({ content: msg, done: true })}\n\n`);
  }

  res.end();
});

export default router;
