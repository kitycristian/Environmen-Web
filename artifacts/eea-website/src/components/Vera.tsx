import { useState, useEffect, useRef, useCallback } from "react";

const ANTHROPIC_API_KEY = "TU_API_KEY_AQUI";

const SYSTEM_PROMPT = `Sos Vera, la asistente virtual de Environmental Express Argentina (EEA), consultora de Higiene y Seguridad en el Trabajo de Tucumán, Argentina.
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
6. Generar resumen completo y ofrecer envío por email a contacto@envexar.com.

REGLAS:
- Hacé UNA sola pregunta por mensaje, nunca varias juntas.
- Si el usuario no sabe un dato técnico, explicale brevemente por qué lo necesitás.
- Al final, mostrá el resumen completo con formato claro antes de enviar.
- Cuando ya tengas toda la info, generá el resumen con este formato exacto empezando con "📋 RESUMEN SOLICITUD DE PRESUPUESTO" y terminando con "---FIN---".`;

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
};

type Attachment = {
  id: string;
  name: string;
  file: File;
};

/* ─── SVG VERA AVATAR ─── */
const VeraAvatar = ({ size = 40, blink = false }: { size?: number; blink?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
    <circle cx="20" cy="20" r="20" fill="#166534"/>
    <line x1="20" y1="4" x2="20" y2="8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="20" cy="3.5" r="1.8" fill="#94a3b8"/>
    <rect x="9" y="9" width="22" height="18" rx="4" fill="#e2e8f0"/>
    <rect x="7" y="14" width="3" height="6" rx="1.5" fill="#cbd5e1"/>
    <rect x="30" y="14" width="3" height="6" rx="1.5" fill="#cbd5e1"/>
    <style>{`
      @keyframes blink { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.1)} }
    `}</style>
    <g style={{ transformOrigin: "14px 17px", animation: blink ? "blink 3.5s infinite" : "none" }}>
      <circle cx="14" cy="17" r="3" fill="#1e3a5f"/>
      <circle cx="15.2" cy="15.8" r="1" fill="white"/>
    </g>
    <g style={{ transformOrigin: "26px 17px", animation: blink ? "blink 3.5s 0.05s infinite" : "none" }}>
      <circle cx="26" cy="17" r="3" fill="#1e3a5f"/>
      <circle cx="27.2" cy="15.8" r="1" fill="white"/>
    </g>
    <path d="M14 23 Q20 27 26 23" stroke="#64748b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

/* ─── ROBOT BUBBLE FACE ─── */
const RobotFace = () => (
  <svg width="34" height="34" viewBox="0 0 40 40">
    <line x1="20" y1="2" x2="20" y2="7" stroke="#7ec8a0" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="20" cy="1.5" r="2" fill="#7ec8a0"/>
    <rect x="7" y="7" width="26" height="22" rx="5" fill="#d1e8ff"/>
    <rect x="5" y="12" width="3.5" height="7" rx="1.5" fill="#a8c8e8"/>
    <rect x="31.5" y="12" width="3.5" height="7" rx="1.5" fill="#a8c8e8"/>
    <style>{`
      @keyframes robotBlink { 0%,88%,100%{transform:scaleY(1)} 92%{transform:scaleY(0.05)} }
    `}</style>
    <g style={{ transformOrigin: "14px 17px", animation: "robotBlink 3s infinite" }}>
      <circle cx="14" cy="17" r="3.5" fill="#1e3a5f"/>
      <circle cx="15.5" cy="15.5" r="1.2" fill="white"/>
    </g>
    <g style={{ transformOrigin: "26px 17px", animation: "robotBlink 3s 0.06s infinite" }}>
      <circle cx="26" cy="17" r="3.5" fill="#1e3a5f"/>
      <circle cx="27.5" cy="15.5" r="1.2" fill="white"/>
    </g>
    <path d="M13 24 Q20 28.5 27 24" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  </svg>
);

/* ─── TYPING INDICATOR ─── */
const TypingDots = () => (
  <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
    <style>{`
      @keyframes dotBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
    `}</style>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{
        width: 7, height: 7, borderRadius: "50%", backgroundColor: "#94a3b8",
        animation: `dotBounce 1.2s ${i * 0.2}s infinite`,
      }}/>
    ))}
  </div>
);

/* ─── MAIN COMPONENT ─── */
export default function Vera() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quickOptions, setQuickOptions] = useState<string[]>(["¡Sí, empecemos!", "Tengo una consulta"]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [notification, setNotification] = useState(true);
  const [summaryText, setSummaryText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const conversationHistory = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    const id = Math.random().toString(36).slice(2);
    setMessages((prev) => [...prev, { id, role, content }]);
    return id;
  };

  const callAnthropic = async (userMessage: string): Promise<string> => {
    conversationHistory.current.push({ role: "user", content: userMessage });
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-opus-4-5",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: conversationHistory.current,
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const reply = data.content[0].text as string;
      conversationHistory.current.push({ role: "assistant", content: reply });
      return reply;
    } catch {
      return "Lo siento, tuve un problema técnico 😔 Podés escribirnos directamente a contacto@envexar.com y te respondemos a la brevedad.";
    }
  };

  const openChat = useCallback(() => {
    setIsOpen(true);
    setNotification(false);
    if (!hasOpened) {
      setHasOpened(true);
      setQuickOptions([]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const welcomeId = Math.random().toString(36).slice(2);
        setMessages([{
          id: welcomeId,
          role: "assistant",
          content: "¡Hola! Soy Vera 🤖 la asistente de Environmental Express Argentina.\nEstoy acá para ayudarte a armar tu solicitud de presupuesto de mediciones ambientales. ¿Empezamos?",
        }]);
        conversationHistory.current = [{
          role: "assistant",
          content: "¡Hola! Soy Vera 🤖 la asistente de Environmental Express Argentina.\nEstoy acá para ayudarte a armar tu solicitud de presupuesto de mediciones ambientales. ¿Empezamos?",
        }];
        setQuickOptions(["¡Sí, empecemos!", "Tengo una consulta"]);
      }, 1400);
    }
  }, [hasOpened]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() && attachments.length === 0) return;
    const msgText = attachments.length > 0
      ? `${text}${text ? "\n" : ""}📎 Archivos adjuntos: ${attachments.map((a) => a.name).join(", ")}`
      : text;
    addMessage("user", msgText);
    setInput("");
    setAttachments([]);
    setQuickOptions([]);
    setIsTyping(true);
    const reply = await callAnthropic(msgText);
    setIsTyping(false);
    addMessage("assistant", reply);

    if (reply.includes("📋 RESUMEN SOLICITUD DE PRESUPUESTO")) {
      setSummaryText(reply);
      setQuickOptions(["📧 Enviar solicitud por email"]);
    }
  }, [attachments]);

  const handleOption = (opt: string) => {
    if (opt === "📧 Enviar solicitud por email" && summaryText) {
      const body = summaryText.replace(/---FIN---/, "").trim();
      const razón = body.match(/Empresa[:\s]+([^\n]+)/)?.[1]?.trim() || "Consulta";
      const mailtoUrl = `mailto:contacto@envexar.com?subject=${encodeURIComponent(`Solicitud de presupuesto - ${razón}`)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl, "_blank");
      setQuickOptions([]);
      addMessage("assistant", "¡Listo! Se abrió tu cliente de email con toda la información 📨 ¿Necesitás algo más?");
      setQuickOptions(["Nueva consulta", "Cerrar chat"]);
    } else if (opt === "Cerrar chat") {
      setIsOpen(false);
    } else if (opt === "Nueva consulta") {
      setMessages([]);
      conversationHistory.current = [];
      setSummaryText("");
      setHasOpened(false);
      setQuickOptions(["¡Sí, empecemos!", "Tengo una consulta"]);
      openChat();
    } else {
      sendMessage(opt);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - attachments.length;
    files.slice(0, remaining).forEach((file) => {
      setAttachments((prev) => [...prev, { id: Math.random().toString(36).slice(2), name: file.name, file }]);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <style>{`
        @keyframes veraPulse {
          0%,100%{box-shadow:0 4px 20px rgba(30,58,95,0.35)}
          50%{box-shadow:0 4px 28px rgba(30,58,95,0.55),0 0 0 8px rgba(30,58,95,0.08)}
        }
        @keyframes veraSlideUp {
          from{opacity:0;transform:translateY(20px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes veraMsgIn {
          from{opacity:0;transform:translateY(8px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes veraDot {
          0%,80%,100%{opacity:0.3}
          40%{opacity:1}
        }
        @keyframes veraOnline {
          0%,100%{opacity:1}
          50%{opacity:0.35}
        }
        .vera-msg { animation: veraMsgIn 0.25s ease forwards; }
        .vera-chip:hover { background:#f0fdf4 !important; }
        .vera-chip-selected { background:#166534 !important; color:white !important; }
        .vera-send:hover { background:#14532d !important; }
        .vera-attach:hover { background:#f1f5f9 !important; }
        .vera-close:hover { background:rgba(255,255,255,0.12) !important; }
        .vera-bubble:hover { transform:scale(1.05); }
        .vera-remove:hover { background:rgba(0,0,0,0.12) !important; }
        @media(max-width:480px){
          .vera-panel { width:calc(100vw - 24px) !important; right:12px !important; }
        }
      `}</style>

      {/* ── FLOATING BUBBLE ── */}
      <button
        className="vera-bubble"
        onClick={openChat}
        style={{
          position: "fixed", bottom: 24, right: 24, width: 64, height: 64,
          borderRadius: "50%", backgroundColor: "#1e3a5f", border: "none",
          cursor: "pointer", zIndex: 9998,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "veraPulse 4s ease-in-out infinite",
          transition: "transform 0.2s",
          boxShadow: "0 4px 20px rgba(30,58,95,0.35)",
        }}
        aria-label="Abrir chat con Vera"
      >
        <RobotFace />
        {notification && (
          <div style={{
            position: "absolute", top: -4, right: -4,
            width: 20, height: 20, borderRadius: "50%",
            backgroundColor: "#ef4444", color: "white",
            fontSize: 11, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid white",
          }}>1</div>
        )}
      </button>

      {/* ── CHAT PANEL ── */}
      {isOpen && (
        <div
          className="vera-panel"
          style={{
            position: "fixed", bottom: 100, right: 24,
            width: 360, height: 520,
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            display: "flex", flexDirection: "column",
            zIndex: 9999, overflow: "hidden",
            animation: "veraSlideUp 0.3s ease",
            backgroundColor: "#f8fafc",
          }}
        >
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #0d2240 100%)",
            padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
          }}>
            <VeraAvatar size={42} blink />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Vera</span>
                <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#4ade80", animation: "veraOnline 2s infinite" }}/>
              </div>
              <div style={{ color: "#7ec8a0", fontSize: 11, fontWeight: 500 }}>Asistente de presupuestos · EEA</div>
            </div>
            <button
              className="vera-close"
              onClick={() => setIsOpen(false)}
              style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, padding: "4px 6px", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1, transition: "background 0.15s" }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg) => (
              <div key={msg.id} className="vera-msg" style={{ display: "flex", alignItems: "flex-start", gap: 8, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                {msg.role === "assistant" && <VeraAvatar size={28} />}
                <div style={{
                  maxWidth: "78%",
                  padding: "9px 12px",
                  borderRadius: msg.role === "assistant" ? "4px 14px 14px 14px" : "14px 14px 4px 14px",
                  backgroundColor: msg.role === "assistant" ? "white" : "#1e3a5f",
                  border: msg.role === "assistant" ? "1px solid #e2e8f0" : "none",
                  color: msg.role === "assistant" ? "#1e293b" : "white",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <VeraAvatar size={28} />
                <div style={{ padding: "9px 14px", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "4px 14px 14px 14px" }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          {/* Quick Options */}
          {quickOptions.length > 0 && (
            <div style={{ padding: "0 12px 8px", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
              {quickOptions.map((opt) => (
                <button
                  key={opt}
                  className="vera-chip"
                  onClick={() => handleOption(opt)}
                  style={{
                    border: "1.5px solid #166534", color: "#166534",
                    backgroundColor: "white", borderRadius: 20,
                    padding: "5px 12px", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div style={{ padding: "4px 12px 0", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
              {attachments.map((a) => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 4, backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "2px 8px 2px 10px", fontSize: 11, color: "#1e40af" }}>
                  📎 {a.name.length > 18 ? a.name.slice(0, 18) + "…" : a.name}
                  <button
                    className="vera-remove"
                    onClick={() => setAttachments((prev) => prev.filter((f) => f.id !== a.id))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 13, padding: "0 2px", borderRadius: 4, transition: "background 0.15s" }}
                  >×</button>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "8px 12px 12px", borderTop: "1px solid #e2e8f0", backgroundColor: "white", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <input
              ref={fileInputRef as React.RefObject<HTMLInputElement>}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              className="vera-attach"
              onClick={() => fileInputRef.current?.click()}
              disabled={attachments.length >= 3}
              style={{ background: "none", border: "none", cursor: attachments.length >= 3 ? "not-allowed" : "pointer", color: "#94a3b8", fontSize: 18, padding: "4px 6px", borderRadius: 6, transition: "background 0.15s", opacity: attachments.length >= 3 ? 0.4 : 1 }}
              title="Adjuntar archivo (máx. 3)"
            >
              <i className="ti ti-paperclip"/>
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Escribí tu mensaje..."
              style={{ flex: 1, border: "1.5px solid #e2e8f0", borderRadius: 20, padding: "8px 12px", fontSize: 13.5, outline: "none", fontFamily: "inherit", color: "#1e293b", backgroundColor: "#f8fafc" }}
            />
            <button
              className="vera-send"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() && attachments.length === 0}
              style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#166534", border: "none", cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s", opacity: !input.trim() && attachments.length === 0 ? 0.5 : 1 }}
            >
              <i className="ti ti-send" style={{ fontSize: 15 }}/>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
