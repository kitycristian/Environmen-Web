import { useState, useEffect, useRef } from "react";

/* ─── LOGO ─── */
const LogoSVG = ({ size = 70 }: { size?: number }) => (
  <svg width="72" height="72" viewBox="0 0 110 110">
    <rect width="110" height="110" fill="#0D2F5E" rx="8"/>
    <text x="55" y="12" textAnchor="middle" fontFamily="Arial"
          fontSize="6.5" fill="#7EC8A0" fontWeight="700" letterSpacing="0.3">HIGIENE OCUPACIONAL</text>
    <text x="55" y="20" textAnchor="middle" fontFamily="Arial"
          fontSize="6.5" fill="#7EC8A0" fontWeight="700" letterSpacing="0.3">Y MEDIO AMBIENTE</text>
    <ellipse cx="55" cy="57" rx="34" ry="26" fill="none" stroke="#2E7D32" strokeWidth="2.5"/>
    <ellipse cx="55" cy="57" rx="34" ry="10" fill="none" stroke="#2E7D32" strokeWidth="1.8"/>
    <ellipse cx="55" cy="57" rx="13" ry="26" fill="none" stroke="#2E7D32" strokeWidth="1.8"/>
    <circle cx="55" cy="57" r="19" fill="#0D2F5E"/>
    <text x="55" y="64" textAnchor="middle" fontFamily="Arial Black"
          fontWeight="900" fontSize="18" fill="#ffffff" letterSpacing="1.5">EEA</text>
    <text x="55" y="91" textAnchor="middle" fontFamily="Arial"
          fontSize="6.5" fill="#ffffff" fontWeight="700" letterSpacing="0.4">ENVIRONMENTAL EXPRESS</text>
    <text x="55" y="100" textAnchor="middle" fontFamily="Arial"
          fontSize="6.5" fill="#ffffff" fontWeight="700" letterSpacing="0.4">ARGENTINA</text>
    <circle cx="96" cy="96" r="10" fill="#2E7D32"/>
    <text x="96" y="101" textAnchor="middle" fontFamily="Arial"
          fontSize="12" fill="#fff" fontWeight="900">✓</text>
  </svg>
);

/* ─── DATA ─── */
const slides = [
  {
    img: "/slides/slide1.jpg",
    title: "Environmental Express Argentina",
    sub: "Mediciones ambientales y protocolos SRT para su empresa",
    btn: "Solicitar presupuesto",
  },
  {
    img: "/slides/slide2.jpg",
    title: "Más de 30 tipos de estudios certificados",
    sub: "Protocolos oficiales SRT, MTEySS y ASME para todos los agentes de riesgo",
    btn: "Ver servicios",
  },
  {
    img: "/slides/slide3.jpg",
    title: "Instrumentos calibrados con trazabilidad al INTI",
    sub: "Resultados confiables para presentar ante ART e inspecciones",
    btn: "Conocernos",
  },
];

const quickCards = [
  { icon: "ti-microscope", title: "Solicitar estudio", desc: "Cotizá tu medición sin cargo" },
  { icon: "ti-file-text", title: "Ver normativa", desc: "Resoluciones SRT vigentes" },
  { icon: "ti-phone-call", title: "Contacto directo", desc: "Respondemos en menos de 24hs" },
];

const services = [
  { icon: "ti-sun", name: "Iluminación laboral", norm: "Resol. SRT 84/2012", desc: "Niveles de iluminancia en puestos de trabajo" },
  { icon: "ti-volume", name: "Ruido y dosimetrías", norm: "Resol. SRT 85/2012", desc: "Exposición ocupacional al ruido" },
  { icon: "ti-temperature", name: "Carga térmica", norm: "Resol. SRT 30/2023", desc: "Estrés por calor en ambientes laborales" },
  { icon: "ti-snowflake", name: "Estrés por frío", norm: "MTEySS 295/2003", desc: "Exposición a ambientes refrigerados" },
  { icon: "ti-bolt", name: "Puesta a tierra", norm: "Resol. SRT 900/2015", desc: "Continuidad eléctrica y disyuntores" },
  { icon: "ti-wind", name: "Ventilación y aspiración", norm: "Decreto 351/79", desc: "Caudales, velocidades y calidad de aire" },
  { icon: "ti-atom", name: "Agentes químicos", norm: "MTEySS 295/2003", desc: "COVs, plomo, BTEX e hidrocarburos" },
  { icon: "ti-ruler-measure", name: "Espesores por ultrasonido", norm: "ASME Section VIII", desc: "Detección de corrosión en recipientes" },
  { icon: "ti-activity", name: "Ergonomía y vibraciones", norm: "MTEySS 295/2003", desc: "Mano-brazo y cuerpo entero" },
];

const stats = [
  { value: "+30", label: "Tipos de estudios" },
  { value: "100%", label: "Normativa SRT" },
  { value: "100%", label: "Informes certificados" },
];

const whyItems = [
  { icon: "ti-certificate", text: "Instrumentos calibrados con trazabilidad al INTI" },
  { icon: "ti-file-check", text: "Informes SRT listos para ART e inspecciones laborales" },
  { icon: "ti-map-pin", text: "Cobertura en todo el territorio nacional" },
  { icon: "ti-clock", text: "Entrega de informes en 48-72 horas hábiles" },
];

const studyOptions = [
  "Iluminación SRT 84/2012",
  "Ruido SRT 85/2012",
  "Carga térmica SRT 30/2023",
  "Estrés por frío",
  "Puesta a tierra",
  "Espesores ultrasonido",
  "Agentes químicos",
  "Varios/consultar",
];

const serviciosInfo = [
  {
    titulo: "Iluminación laboral", norma: "Resolución SRT N° 84/2012",
    descripcion: "Estudio de los niveles de iluminación en los puestos de trabajo para verificar el cumplimiento de los valores mínimos establecidos por la normativa.",
    items: ["Medición de iluminancia (E) en lux con luxómetro calibrado","Verificación de E mínima, E máxima y E media por sector","Control de uniformidad: E mínima ≥ E media / 2","Clasificación por tipo: general, localizada, natural, artificial, mixta","Valores de referencia según tarea (ej: oficinas 300 lux, depósitos 100 lux)","Grilla de puntos de medición según método de la cavidad zonal"],
    cuando: "Obligatorio para todos los establecimientos. Se recomienda medir en el período de menor iluminación natural.",
  },
  {
    titulo: "Ruido y dosimetrías", norma: "Resolución SRT N° 85/2012",
    descripcion: "Evaluación de la exposición ocupacional al ruido para proteger la salud auditiva de los trabajadores.",
    items: ["Medición con sonómetro integrador Clase 2 (ponderación A, respuesta lenta)","Dosimetrías con dosímetro personal en puestos variables","Nivel de presión acústica continuo equivalente (LAeq,Te)","Evaluación de ruido de impulso: nivel pico ponderado C (LCpico)","Cálculo de fracción de dosis y dosis acumulada (%)","Límite: 85 dBA para 8hs, 140 dBC para impulso"],
    cuando: "Obligatorio cuando existen fuentes de ruido en el establecimiento. El técnico debe medir con la maquinaria en condiciones normales de operación.",
  },
  {
    titulo: "Carga térmica", norma: "Resolución SRT N° 30/2023",
    descripcion: "Evaluación del estrés por calor en puestos de trabajo con exposición a ambientes calurosos o fuentes de calor radiante.",
    items: ["Medición de TGBH (Temperatura de Globo y Bulbo Húmedo)","Determinación de la Tasa Metabólica (TM en Watts)","Cálculo de TGBH ponderado para ciclos trabajo/descanso","Verificación de VLA (Valor Límite de Acción) y VLP (Valor Límite Permisible)","Evaluación de aclimatación del trabajador","Aplicación de VAR (Valor de Ajuste por Ropa)"],
    cuando: "Obligatorio en tareas con exposición a calor. Debe realizarse en el período de mayor carga térmica del año (verano) y con las fuentes de calor operativas.",
  },
  {
    titulo: "Estrés por frío", norma: "Resolución MTEySS N° 295/2003",
    descripcion: "Evaluación de la exposición a ambientes fríos en tareas en cámaras frigoríficas, depósitos refrigerados o exteriores en invierno.",
    items: ["Medición de Temperatura de Bulbo Seco (TBS)","Medición de velocidad del viento (m/s)","Cálculo de Temperatura Equivalente de Enfriamiento (TEE)","Determinación de rangos de peligro según TEE","Evaluación de ciclos de exposición y recuperación","Recomendaciones de ropa de abrigo y equipos de protección"],
    cuando: "Aplicable en trabajos en cámaras frigoríficas, depósitos de frío, trabajos en exteriores en invierno y cualquier tarea con exposición a bajas temperaturas.",
  },
  {
    titulo: "Puesta a tierra", norma: "Resolución SRT N° 900/2015",
    descripcion: "Verificación de la continuidad eléctrica de las masas y ensayo de dispositivos de corte automático (disyuntores diferenciales).",
    items: ["Medición de resistencia de puesta a tierra (en Ohms)","Ensayo de continuidad eléctrica de las masas metálicas","Verificación de disyuntores diferenciales (corriente de disparo y tiempo)","Control de tensión de contacto (no debe superar 24V en locales húmedos)","Inspección visual de tableros y conexiones","Certificado según Anexo VI del Dec. 351/79"],
    cuando: "Obligatorio anualmente para todos los establecimientos. Imprescindible para presentar ante la ART y organismos de control.",
  },
  {
    titulo: "Ventilación y aspiración", norma: "Decreto 351/79 — Anexo II",
    descripcion: "Evaluación de los sistemas de ventilación general y aspiración localizada para garantizar calidad de aire y confort térmico.",
    items: ["Medición de caudales de aire (m³/h) con anemómetro","Verificación de velocidades de aire en bocas y ductos","Control de renovaciones de aire por hora según actividad","Evaluación de campanas de extracción localizada","Medición de temperatura y humedad relativa del aire","Verificación de presiones negativas en zonas contaminadas"],
    cuando: "Aplicable en industrias con generación de polvo, vapores, gases o donde se requiera control de temperatura y calidad de aire.",
  },
  {
    titulo: "Agentes químicos", norma: "Resolución MTEySS N° 295/2003",
    descripcion: "Evaluación de la exposición ocupacional a contaminantes químicos en el ambiente de trabajo.",
    items: ["Muestreo de COVs (Compuestos Orgánicos Volátiles)","Determinación de plomo en aire y superficies","Análisis de BTEX (Benceno, Tolueno, Etilbenceno, Xileno)","Medición de hidrocarburos alifáticos y aromáticos","Comparación con TLVs (Valores Límite de Umbral — ACGIH)","Recomendaciones de EPP y controles de ingeniería"],
    cuando: "Obligatorio cuando los trabajadores están expuestos a solventes, pinturas, adhesivos, combustibles u otros productos químicos en su jornada laboral.",
  },
  {
    titulo: "Espesores por ultrasonido", norma: "ASME Section VIII — Código API 510",
    descripcion: "Medición de espesores de recipientes a presión, cañerías y estructuras metálicas mediante ultrasonido para detectar corrosión.",
    items: ["Medición de espesores con equipo de ultrasonido calibrado","Detección de zonas de corrosión interna y externa","Comparación con espesores originales o mínimos admisibles","Evaluación de velocidad de corrosión (mm/año)","Aplicable en recipientes a presión, calderas, tanques y cañerías","Informe con mapa de puntos y recomendación de vida útil"],
    cuando: "Obligatorio para recipientes sometidos a presión según SRT. Se recomienda cada 1-3 años según condiciones de operación y resultados previos.",
  },
  {
    titulo: "Ergonomía y vibraciones", norma: "Resolución MTEySS N° 295/2003",
    descripcion: "Evaluación de la exposición a vibraciones mecánicas transmitidas al sistema mano-brazo y cuerpo entero.",
    items: ["Medición de vibraciones mano-brazo (herramientas vibrantes)","Medición de vibraciones cuerpo entero (vehículos, plataformas)","Cálculo de valor de exposición diario A(8) en m/s²","Comparación con Valor de Acción (2,5 m/s²) y Valor Límite (5 m/s²)","Evaluación ergonómica de posturas y movimientos repetitivos","Recomendaciones de rediseño de puestos y EPP antivibratorio"],
    cuando: "Aplicable cuando los trabajadores utilizan herramientas vibrantes (amoladoras, martillos neumáticos, etc.) o trabajan sobre superficies vibrantes (montacargas, tractores).",
  },
];

/* ─── COMPONENT ─── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [showNormativa, setShowNormativa] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", empresa: "", email: "", telefono: "", estudio: "", mensaje: "" });
  const [formSent, setFormSent] = useState(false);
  const [formSending, setFormSending] = useState(false);

  const contactRef = useRef<HTMLElement>(null);
  const serviciosRef = useRef<HTMLElement>(null);

  // Nav scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Slider auto
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Modal body lock
  useEffect(() => {
    document.body.style.overflow = modalIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalIndex]);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => (e: React.MouseEvent) => {
    e.preventDefault();
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  const scrollToId = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSending(true);
    try {
      await fetch("/api/budget-requests", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origen: "web-form",
          nombre: formData.nombre,
          empresa: formData.empresa,
          email: formData.email,
          telefono: formData.telefono,
          estudio: formData.estudio,
          mensaje: formData.mensaje,
        }),
      });
    } catch { /* falla silenciosamente */ }
    setFormSending(false);
    setFormSent(true);
    setFormData({ nombre: "", empresa: "", email: "", telefono: "", estudio: "", mensaje: "" });
  };

  const activeService = modalIndex !== null ? serviciosInfo[modalIndex] : null;
  const NAV_H = 36 + 80; // topbar + header

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css"/>

      {/* ── TOPBAR ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1100, backgroundColor: "#1a2744", height: 36, display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          {/* Mail */}
          <a href="mailto:contacto@envexar.com" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}>
            <i className="ti ti-mail" style={{ fontSize: 14 }}/> contacto@envexar.com
          </a>
          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {[
              { icon: "ti-brand-facebook", href: "https://facebook.com" },
              { icon: "ti-brand-instagram", href: "https://instagram.com" },
              { icon: "ti-brand-linkedin", href: "https://linkedin.com" },
            ].map(({ icon, href }) => (
              <a key={icon} href={href} target="_blank" rel="noreferrer"
                style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}>
                <i className={`ti ${icon}`}/>
              </a>
            ))}
            <span style={{ width: 1, height: 16, backgroundColor: "rgba(255,255,255,0.2)", display: "inline-block" }}/>
            <a href="/portal" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}>
              <i className="ti ti-lock" style={{ fontSize: 13 }}/> Acceso clientes
            </a>
          </div>
        </div>
      </div>

      {/* ── HEADER PRINCIPAL ── */}
      <header style={{
        position: "fixed", top: 36, left: 0, right: 0, zIndex: 1000,
        backgroundColor: "#fff",
        borderBottom: "1px solid #e8edf2",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        height: 80,
      }}>
        <style>{`
          .eea-nav-link {
            font-size: 14px; font-weight: 600; color: #1a2744;
            text-decoration: none; padding-bottom: 3px;
            border-bottom: 2px solid transparent;
            transition: color 0.2s, border-color 0.2s;
          }
          .eea-nav-link:hover { color: #3a7d2c; border-bottom-color: #3a7d2c; }
          .eea-cta-btn {
            background: #3a7d2c; color: white; border: none; cursor: pointer;
            padding: 9px 18px; border-radius: 6px; font-size: 14px; font-weight: 600;
            text-decoration: none; white-space: nowrap; transition: background 0.2s;
          }
          .eea-cta-btn:hover { background: #2f6624; }
          .eea-hamburger { display: none !important; }
          .logo img { height: 60px; mix-blend-mode: multiply; }
          @media (max-width: 768px) {
            .eea-nav-links { display: none !important; }
            .eea-cta-desktop { display: none !important; }
            .eea-hamburger { display: flex !important; }
          }
        `}</style>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: "100%", gap: 20 }}>

          {/* IZQUIERDA: Logo + divisor + texto empresa */}
          <a href="#" onClick={scrollToId("hero")} style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", flexShrink: 0 }}>
            <span className="logo">
              <img
                src="/logo.jpeg"
                alt="EEA"
                style={{ width: "auto", display: "block" }}
              />
            </span>
            <span style={{ width: 2, height: 48, backgroundColor: "#3a7d2c", borderRadius: 1, flexShrink: 0 }}/>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#1a2744", lineHeight: 1.2, letterSpacing: "0.01em" }}>
                Environmental Express Argentina
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#5f7a3a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Higiene Ocupacional y Medio Ambiente
              </span>
            </span>
          </a>

          {/* CENTRO: Nav links */}
          <nav className="eea-nav-links" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 32 }}>
            {[
              { label: "Inicio", action: scrollToId("hero") },
              { label: "Servicios", action: scrollTo(serviciosRef as React.RefObject<HTMLElement>) },
              { label: "Nosotros", action: scrollToId("por-que") },
              { label: "Contacto", action: scrollTo(contactRef as React.RefObject<HTMLElement>) },
            ].map(({ label, action }) => (
              <a key={label} href="#" onClick={action} className="eea-nav-link">{label}</a>
            ))}
          </nav>

          {/* DERECHA: CTA */}
          <a href="#" onClick={scrollTo(contactRef as React.RefObject<HTMLElement>)}
            className="eea-cta-btn eea-cta-desktop">
            Solicitar presupuesto
          </a>

          {/* MOBILE: Hamburguesa */}
          <button className="eea-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#1a2744", fontSize: 26, padding: 4, display: "flex", alignItems: "center" }}>
            <i className={menuOpen ? "ti ti-x" : "ti ti-menu-2"}/>
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div style={{ backgroundColor: "white", borderTop: "1px solid #e8edf2", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            {[
              { label: "Inicio", action: scrollToId("hero") },
              { label: "Servicios", action: scrollTo(serviciosRef as React.RefObject<HTMLElement>) },
              { label: "Nosotros", action: scrollToId("por-que") },
              { label: "Contacto", action: scrollTo(contactRef as React.RefObject<HTMLElement>) },
            ].map(({ label, action }) => (
              <a key={label} href="#" onClick={(e) => { action(e); setMenuOpen(false); }}
                style={{ fontSize: 15, fontWeight: 600, color: "#1a2744", textDecoration: "none" }}>{label}</a>
            ))}
            <a href="#" onClick={(e) => { scrollTo(contactRef as React.RefObject<HTMLElement>)(e); setMenuOpen(false); }}
              className="eea-cta-btn" style={{ textAlign: "center" }}>
              Solicitar presupuesto
            </a>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <style>{`
        .eea-hero { display: grid; grid-template-columns: 1fr 1.6fr; }
        @media (max-width: 768px) { .eea-hero { grid-template-columns: 1fr; } }
      `}</style>
      <section id="hero" className="eea-hero" style={{ marginTop: NAV_H, minHeight: 340, backgroundColor: "#0d1b2e" }}>

        {/* ── COLUMNA IZQUIERDA: Logo ── */}
        <div style={{
          backgroundColor: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 40,
        }}>
          <img src="/logo.jpeg" alt="EEA" style={{ height: 360, width: "auto", objectFit: "contain", display: "block" }} />
        </div>

        {/* ── COLUMNA DERECHA: Carrusel ── */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: 340 }}>
          {/* Slides background */}
          {slides.map((s, i) => (
            <div key={i} style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${s.img})`,
              backgroundSize: "cover", backgroundPosition: "center",
              filter: "brightness(55%)",
              opacity: i === slide ? 1 : 0,
              transition: "opacity 0.8s ease",
            }} />
          ))}

          {/* Slide content */}
          <div style={{ position: "relative", zIndex: 1, minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 40px 64px" }}>
            <div style={{ display: "inline-block", alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.9)", borderRadius: 20, fontSize: 11, fontWeight: 600, padding: "4px 14px", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
              Tucumán, Argentina
            </div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, lineHeight: 1.3, maxWidth: 480, margin: "0 0 10px", padding: 0 }}>
              {slides[slide]?.title}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.7, maxWidth: 420, margin: "0 0 24px" }}>
              {slides[slide]?.sub}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              <a href="#" onClick={scrollTo(contactRef as React.RefObject<HTMLElement>)}
                style={{ backgroundColor: "#3a7d2c", color: "#fff", padding: "10px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2f6624")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3a7d2c")}>
                Solicitar presupuesto
              </a>
              <a href="#" onClick={scrollTo(serviciosRef as React.RefObject<HTMLElement>)}
                style={{ backgroundColor: "transparent", color: "#fff", padding: "10px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.45)", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                Ver servicios
              </a>
            </div>
            {/* Dots */}
            <div style={{ display: "flex", gap: 6 }}>
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)}
                  style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, backgroundColor: i === slide ? "white" : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", transition: "width 0.3s", padding: 0 }} />
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2, backgroundColor: "rgba(0,0,0,0.38)", borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex" }}>
            {[
              { val: "+30", lbl: "Tipos de estudios" },
              { val: "100%", lbl: "Normativa SRT" },
              { val: "Nacional", lbl: "Cobertura" },
            ].map(({ val, lbl }, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", padding: "12px 8px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "white", lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 3, letterSpacing: "0.04em", textTransform: "uppercase" }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          {[{ dir: -1, label: "‹" }, { dir: 1, label: "›" }].map(({ dir, label }) => (
            <button key={dir} onClick={() => setSlide((s) => (s + dir + slides.length) % slides.length)}
              style={{ position: "absolute", top: "45%", [dir === -1 ? "left" : "right"]: 12, transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", color: "white", fontSize: 22, width: 34, height: 34, borderRadius: "50%", cursor: "pointer", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── QUICK CARDS ── */}
      <div style={{ backgroundColor: "white", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, borderTop: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
          {quickCards.map(({ icon, title, desc }, i) => (
            <div key={i} style={{ padding: "28px 28px", backgroundColor: "white", borderRight: i < 2 ? "1px solid #e5e7eb" : "none", cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0fdf4")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
              onClick={title === "Ver normativa" ? () => setShowNormativa(true) : undefined}>
              <i className={`ti ${icon}`} style={{ fontSize: 32, color: "#166534", display: "block", marginBottom: 10 }}/>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICIOS ── */}
      <section ref={serviciosRef as React.RefObject<HTMLElement>} style={{ backgroundColor: "#f8fafc", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "#1e3a5f", marginBottom: 10 }}>
              Estudios y mediciones certificadas
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, margin: "0 auto" }}>
              Protocolos oficiales SRT para todos los agentes de riesgo
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {services.map(({ icon, name, norm, desc }, i) => (
              <div key={i} onClick={() => setModalIndex(i)}
                style={{ backgroundColor: "white", borderRadius: 8, padding: "28px 24px", border: "1px solid #e5e7eb", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#f0fdf4", border: "1.5px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <i className={`ti ${icon}`} style={{ fontSize: 22, color: "#166534" }}/>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 12, color: "#166534", fontWeight: 600, marginBottom: 8 }}>{norm}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 14 }}>{desc}</div>
                <div style={{ fontSize: 13, color: "#166534", fontWeight: 700 }}>Ver más →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ backgroundColor: "#1e3a5f", padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
          {stats.map(({ value, label }, i) => (
            <div key={i} style={{ textAlign: "center", padding: "16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
              <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "white", marginBottom: 6 }}>{value}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRNOS ── */}
      <section id="por-que" style={{ backgroundColor: "white" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 420 }}>
          <div style={{ position: "relative", backgroundImage: "url(https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80)", backgroundSize: "cover", backgroundPosition: "center", minHeight: 380 }}>
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(10,20,40,0.45)" }}/>
            <div style={{ position: "absolute", bottom: 24, left: 24, backgroundColor: "#166534", color: "white", padding: "8px 18px", borderRadius: 4, fontSize: 14, fontWeight: 700 }}>
              +30 tipos de estudios
            </div>
          </div>
          <div style={{ padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: "#1e3a5f", marginBottom: 32, lineHeight: 1.3 }}>
              Profesionales matriculados. Resultados confiables.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {whyItems.map(({ icon, text }) => (
                <div key={icon} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#f0fdf4", border: "1.5px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`ti ${icon}`} style={{ fontSize: 17, color: "#166534" }}/>
                  </div>
                  <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.6, marginTop: 6 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section ref={contactRef} style={{ backgroundColor: "#f8fafc", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, backgroundColor: "white", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          {/* Left */}
          <div style={{ backgroundColor: "#1e3a5f", padding: "48px 40px" }}>
            <h2 style={{ fontSize: "clamp(22px, 2.5vw, 28px)", fontWeight: 800, color: "white", marginBottom: 12 }}>Contacto</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", marginBottom: 36, lineHeight: 1.65 }}>
              Coordinamos la visita técnica y entregamos informes certificados en tiempo récord.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { icon: "ti-mail", label: "EMAIL", value: "contacto@envexar.com" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`ti ${icon}`} style={{ fontSize: 18, color: "#86efac" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2, fontWeight: 700, letterSpacing: "0.06em" }}>{label}</div>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.88)" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {formSent ? (
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
                <h3 style={{ color: "#166534", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>¡Solicitud enviada!</h3>
                <p style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.7 }}>
                  Recibimos tu pedido y te contactaremos a la brevedad al email{" "}
                  <strong>{formData.email || "registrado"}</strong>.
                </p>
                <button onClick={() => setFormSent(false)}
                  style={{ marginTop: 20, background: "none", border: "1px solid #166534", color: "#166534", padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", marginBottom: 24 }}>Solicitar estudio</h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Nombre completo *</label>
                      <input required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} placeholder="Juan García" style={inputStyle}/>
                    </div>
                    <div>
                      <label style={labelStyle}>Empresa</label>
                      <input value={formData.empresa} onChange={(e) => setFormData({ ...formData, empresa: e.target.value })} placeholder="Empresa S.A." style={inputStyle}/>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Email corporativo *</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="juan@empresa.com" style={inputStyle}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Teléfono</label>
                    <input value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} placeholder="+54 381 000 0000" style={inputStyle}/>
                  </div>
                  <div>
                    <label style={labelStyle}>¿Qué estudio necesitás? *</label>
                    <select required value={formData.estudio} onChange={(e) => setFormData({ ...formData, estudio: e.target.value })} style={{ ...inputStyle, color: formData.estudio ? "#111827" : "#9ca3af" }}>
                      <option value="" disabled>Seleccioná un estudio</option>
                      {studyOptions.map((o) => <option key={o} value={o} style={{ color: "#111827" }}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Mensaje</label>
                    <textarea value={formData.mensaje} onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })} placeholder="Describí brevemente tu necesidad..." rows={3} style={{ ...inputStyle, resize: "vertical" }}/>
                  </div>
                  <button type="submit" disabled={formSending}
                    style={{ backgroundColor: formSending ? "#4ade80" : "#166534", color: "white", border: "none", padding: "13px 24px", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: formSending ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}
                    onMouseEnter={(e) => { if (!formSending) e.currentTarget.style.backgroundColor = "#14532d"; }}
                    onMouseLeave={(e) => { if (!formSending) e.currentTarget.style.backgroundColor = "#166534"; }}>
                    <i className={`ti ${formSending ? "ti-loader-2" : "ti-send"}`} style={{ fontSize: 16 }}/>
                    {formSending ? "Enviando..." : "Enviar solicitud"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#1e3a5f", padding: "48px 24px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            {/* Col 1 */}
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "white", lineHeight: 1.3 }}>Environmental Express Argentina</div>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                Especialistas en higiene ocupacional y medio ambiente. Mediciones certificadas en todo el país.
              </p>
            </div>
            {/* Col 2 */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Links rápidos</div>
              {[
                { label: "Inicio", action: scrollToId("hero") },
                { label: "Servicios", action: scrollTo(serviciosRef as React.RefObject<HTMLElement>) },
                { label: "Contacto", action: scrollTo(contactRef as React.RefObject<HTMLElement>) },
              ].map(({ label, action }) => (
                <a key={label} href="#" onClick={action}
                  style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.7)", textDecoration: "none", marginBottom: 10 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#86efac")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}>
                  {label}
                </a>
              ))}
            </div>
            {/* Col 3 */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Contacto</div>
              {[
                { icon: "ti-mail", text: "contacto@envexar.com" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
                  <i className={`ti ${icon}`} style={{ fontSize: 16, color: "#86efac" }}/>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>© 2026 Environmental Express Argentina · envexar.com</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Tucumán, Argentina</span>
          </div>
        </div>
      </footer>


      {/* ── MODAL ── */}
      {activeService && (
        <div onClick={() => setModalIndex(null)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "white", borderRadius: 12, maxWidth: 560, width: "100%", maxHeight: "82vh", overflowY: "auto", padding: 32, position: "relative" }}>
            <button onClick={() => setModalIndex(null)}
              style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748b", lineHeight: 1 }}>×</button>
            <div style={{ marginBottom: 16 }}>
              <span style={{ backgroundColor: "#dcfce7", color: "#166534", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.07em" }}>{activeService.norma}</span>
            </div>
            <h2 style={{ color: "#1e3a5f", fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{activeService.titulo}</h2>
            <p style={{ color: "#4b5563", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{activeService.descripcion}</p>
            <h4 style={{ color: "#1e293b", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>¿Qué incluye el estudio?</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, padding: 0 }}>
              {activeService.items.map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: "#374151" }}>
                  <span style={{ color: "#166534", fontSize: 14, flexShrink: 0, lineHeight: 1.4 }}>✓</span>{item}
                </li>
              ))}
            </ul>
            <div style={{ backgroundColor: "#f0fdf4", borderLeft: "3px solid #16a34a", padding: "12px 14px", borderRadius: "0 8px 8px 0" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "0.05em" }}>¿Cuándo es obligatorio?</span>
              <p style={{ fontSize: 12, color: "#374151", marginTop: 4, lineHeight: 1.6, margin: "4px 0 0" }}>{activeService.cuando}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL NORMATIVA ── */}
      {showNormativa && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setShowNormativa(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 14, maxWidth: 600, width: "90%", maxHeight: "85vh", overflowY: "auto", padding: 32, position: "relative" }}>
            <button onClick={() => setShowNormativa(false)}
              style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748b" }}>×</button>

            <div style={{ marginBottom: 20 }}>
              <span style={{ background: "#dcfce7", color: "#166534", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.07em" }}>Normativa vigente</span>
              <h2 style={{ color: "#1e3a5f", fontSize: 18, fontWeight: 800, marginTop: 10 }}>Resoluciones SRT aplicables</h2>
              <p style={{ color: "#64748b", fontSize: 12.5, marginTop: 4 }}>Marco normativo que rige las mediciones ambientales en Argentina</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { num: "Resol. SRT N° 84/2012", title: "Iluminación en el Ambiente Laboral", desc: "Establece los valores mínimos de iluminancia según el tipo de tarea. Obliga a realizar mediciones con protocolo específico y presentar informe ante la ART." },
                { num: "Resol. SRT N° 85/2012", title: "Ruido en el Ambiente Laboral", desc: "Regula la exposición ocupacional al ruido. Límite de 85 dBA para 8 horas. Requiere medición con sonómetro Clase 2 y dosimetría en puestos variables." },
                { num: "Resol. SRT N° 30/2023", title: "Estrés por Calor en el Ambiente Laboral", desc: "Actualiza los criterios de evaluación de carga térmica. Incorpora VLA y VLP. Obliga a declarar trabajadores expuestos ante la ART mediante ESOP 80001." },
                { num: "Resol. SRT N° 900/2015", title: "Puesta a Tierra y Protecciones Eléctricas", desc: "Obliga a verificar continuidad eléctrica de masas y disyuntores diferenciales. Certificado obligatorio anual para todos los establecimientos." },
                { num: "Resol. MTEySS N° 295/2003", title: "Especificaciones Técnicas sobre Ergonomía y Procedimientos", desc: "Marco normativo para estrés por frío, agentes químicos, vibraciones, ergonomía y ruido de impulso. Incorpora los TLVs de ACGIH como valores de referencia." },
                { num: "Ley N° 19.587 / Decreto 351/79", title: "Ley de Higiene y Seguridad en el Trabajo", desc: "Ley madre de la higiene laboral en Argentina. El Decreto 351/79 reglamenta las condiciones de ventilación, iluminación, temperatura y contaminantes en los lugares de trabajo." },
                { num: "Ley N° 24.557 — SRT", title: "Ley de Riesgos del Trabajo", desc: "Establece el sistema de ART y las obligaciones del empleador en materia de prevención. Las mediciones ambientales son parte del Plan de Mejoramiento exigido por la ART." },
              ].map(({ num, title, desc }) => (
                <div key={num} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", borderLeft: "4px solid #166534" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#1e3a5f" }}>{num}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: "4px 0 2px" }}>{title}</div>
                  <div style={{ fontSize: 11.5, color: "#6b7280" }}>{desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
              <p style={{ fontSize: 11.5, color: "#94a3b8" }}>¿Necesitás más información sobre alguna normativa específica?</p>
              <a href="#contacto" onClick={() => setShowNormativa(false)}
                style={{ display: "inline-block", marginTop: 10, background: "#166534", color: "#fff", padding: "9px 20px", borderRadius: 7, fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
                Consultanos
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── RESPONSIVE ── */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger-btn { display: flex !important; align-items: center; }
        }
        @media (max-width: 640px) {
          #por-que > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1.5px solid #d1d5db", borderRadius: 4, fontSize: 14, color: "#111827", backgroundColor: "white", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" };
