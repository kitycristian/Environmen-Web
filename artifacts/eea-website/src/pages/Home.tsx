import { useState, useEffect, useRef } from "react";

const LogoSVG = () => (
  <svg width="36" height="36" viewBox="0 0 110 110">
    <circle cx="55" cy="55" r="52" fill="#1e3a5f"/>
    <circle cx="55" cy="55" r="48" fill="none" stroke="#166534" strokeWidth="3.5"/>
    <ellipse cx="55" cy="55" rx="48" ry="20" fill="none" stroke="#166534" strokeWidth="2" opacity="0.55"/>
    <ellipse cx="55" cy="55" rx="20" ry="48" fill="none" stroke="#166534" strokeWidth="2" opacity="0.55"/>
    <circle cx="55" cy="55" r="27" fill="#1e3a5f" stroke="#166534" strokeWidth="2"/>
    <text x="55" y="62" textAnchor="middle" fontFamily="Arial Black" fontWeight="900" fontSize="19" fill="#fff">EEA</text>
    <circle cx="87" cy="82" r="10" fill="#166534"/>
    <text x="87" y="86.5" textAnchor="middle" fontFamily="Arial" fontSize="12" fill="#fff" fontWeight="900">✓</text>
  </svg>
);

const services = [
  { num: "01", icon: "ti-sun", name: "Iluminación laboral", norm: "Resol. SRT 84/2012" },
  { num: "02", icon: "ti-volume", name: "Ruido y dosimetrías", norm: "Resol. SRT 85/2012" },
  { num: "03", icon: "ti-temperature", name: "Carga térmica", norm: "Resol. SRT 30/2023" },
  { num: "04", icon: "ti-snowflake", name: "Estrés por frío", norm: "MTEySS 295/2003" },
  { num: "05", icon: "ti-bolt", name: "Puesta a tierra", norm: "Resol. SRT 900/2015" },
  { num: "06", icon: "ti-wind", name: "Ventilación y aspiración", norm: "Caudales y velocidades" },
  { num: "07", icon: "ti-atom", name: "Agentes químicos", norm: "COVs, plomo, BTEX" },
  { num: "08", icon: "ti-ruler-measure", name: "Espesores por ultrasonido", norm: "ASME Section VIII" },
  { num: "09", icon: "ti-activity", name: "Ergonomía y vibraciones", norm: "Mano-brazo y cuerpo entero" },
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

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    estudio: "",
    mensaje: "",
  });

  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Gracias! Te contactaremos a la brevedad.");
    setFormData({ nombre: "", empresa: "", email: "", telefono: "", estudio: "", mensaje: "" });
  };

  return (
    <>
      {/* Tabler Icons CDN */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css"
      />

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "white",
          borderBottom: scrolled ? "1px solid #e5e7eb" : "1px solid #f3f4f6",
          boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.07)" : "none",
          transition: "box-shadow 0.2s, border-color 0.2s",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          {/* Logo + Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LogoSVG />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", lineHeight: 1.2 }}>Environmental Express Argentina</div>
              <div style={{ fontSize: 11, color: "#166534", fontWeight: 500, letterSpacing: "0.02em" }}>Higiene Ocupacional y Medio Ambiente</div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <a href="#inicio" onClick={scrollToSection("hero")} style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", textDecoration: "none", letterSpacing: "0.05em" }}>INICIO</a>
            <a href="#servicios" onClick={scrollToSection("servicios")} style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", textDecoration: "none", letterSpacing: "0.05em" }}>SERVICIOS</a>
            <a href="#clientes" onClick={scrollToSection("por-que")} style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", textDecoration: "none", letterSpacing: "0.05em" }}>CLIENTES</a>
            <a href="#contacto" onClick={scrollToContact} style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", textDecoration: "none", letterSpacing: "0.05em" }}>CONTACTO</a>

            {/* Icon Buttons */}
            <a href="mailto:contacto@envexar.com" style={{ color: "#1e3a5f", fontSize: 20, textDecoration: "none", lineHeight: 1 }} title="Email">
              <i className="ti ti-mail" />
            </a>
            <a href="tel:+5493814000000" style={{ color: "#1e3a5f", fontSize: 20, textDecoration: "none", lineHeight: 1 }} title="Teléfono">
              <i className="ti ti-phone" />
            </a>

            {/* Virtual Office Button */}
            <a
              href="#contacto"
              onClick={scrollToContact}
              style={{
                backgroundColor: "#1e3a5f",
                color: "white",
                padding: "8px 16px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
              }}
            >
              OFICINA VIRTUAL
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#1e3a5f", fontSize: 24 }}
          >
            <i className={menuOpen ? "ti ti-x" : "ti ti-menu-2"} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="mobile-menu"
            style={{
              backgroundColor: "white",
              borderTop: "1px solid #e5e7eb",
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {["INICIO", "SERVICIOS", "CLIENTES"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={scrollToSection(label === "CLIENTES" ? "por-que" : label === "INICIO" ? "hero" : "servicios")}
                style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f", textDecoration: "none" }}
              >
                {label}
              </a>
            ))}
            <a href="#contacto" onClick={scrollToContact} style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f", textDecoration: "none" }}>CONTACTO</a>
            <a
              href="#contacto"
              onClick={scrollToContact}
              style={{
                backgroundColor: "#1e3a5f",
                color: "white",
                padding: "10px 20px",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              OFICINA VIRTUAL
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        id="hero"
        style={{
          marginTop: 64,
          height: 480,
          position: "relative",
          backgroundImage: "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(10,20,40,0.56)" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 800 }}>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 38px)", fontWeight: 700, color: "white", marginBottom: 16, lineHeight: 1.25 }}>
            Especialistas en Higiene y Seguridad en el Trabajo
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(255,255,255,0.88)", marginBottom: 28, lineHeight: 1.65, maxWidth: 640, margin: "0 auto 28px" }}>
            Mediciones ambientales, protocolos SRT y estudios de riesgo laboral. Más de 30 tipos de estudios para empresas de todo el país.
          </p>

          {/* Social Icons */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 32 }}>
            {[
              { icon: "ti-brand-facebook", href: "#", label: "Facebook" },
              { icon: "ti-brand-instagram", href: "#", label: "Instagram" },
              { icon: "ti-brand-linkedin", href: "#", label: "LinkedIn" },
            ].map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  width: 40,
                  height: 40,
                  border: "1.5px solid rgba(255,255,255,0.5)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 18,
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <i className={`ti ${icon}`} />
              </a>
            ))}
          </div>

          {/* Decorative dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: i === 0 ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === 0 ? "white" : "rgba(255,255,255,0.4)",
                  transition: "width 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ backgroundColor: "#f8fafc", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: "#1e3a5f", marginBottom: 10 }}>
              Estudios y mediciones certificadas
            </h2>
            <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 520, margin: "0 auto" }}>
              Protocolos oficiales SRT para todos los agentes de riesgo
            </p>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              backgroundColor: "#e5e7eb",
            }}
          >
            {services.map(({ num, icon, name, norm }) => (
              <div
                key={num}
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "28px 24px",
                  cursor: "default",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0fdf4")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", marginBottom: 12 }}>{num}</div>
                <i className={`ti ${icon}`} style={{ fontSize: 28, color: "#166534", display: "block", marginBottom: 10 }} />
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1e3a5f", marginBottom: 6 }}>{name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{norm}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section id="por-que" style={{ backgroundColor: "white" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: 400,
          }}
        >
          {/* Left: Image */}
          <div
            style={{
              position: "relative",
              backgroundImage: "url(https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: 380,
            }}
          >
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(10,20,40,0.45)" }} />
            {/* Badge */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                backgroundColor: "#166534",
                color: "white",
                padding: "8px 16px",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              +30 tipos de estudios
            </div>
          </div>

          {/* Right: Content */}
          <div style={{ padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700, color: "#1e3a5f", marginBottom: 32, lineHeight: 1.3 }}>
              Profesionales matriculados. Resultados confiables.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {whyItems.map(({ icon, text }) => (
                <div key={icon} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "#f0fdf4",
                      border: "1.5px solid #bbf7d0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i className={`ti ${icon}`} style={{ fontSize: 18, color: "#166534" }} />
                  </div>
                  <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.6, marginTop: 6 }}>{text}</p>
                </div>
              ))}
            </div>

            {/* AHRA Badge */}
            <div
              style={{
                marginTop: 32,
                padding: "14px 20px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "#1e3a5f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: "0.05em",
                }}
              >
                AHRA
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>Asociación de Higienistas Industriales de Argentina</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Profesionales matriculados y habilitados</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section
        id="contacto"
        ref={contactRef}
        style={{ backgroundColor: "#1e3a5f" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {/* Left: Contact Info */}
          <div style={{ padding: "56px 48px" }}>
            <h2 style={{ fontSize: "clamp(22px, 2.5vw, 30px)", fontWeight: 700, color: "white", marginBottom: 12 }}>
              Contacto
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", marginBottom: 40, lineHeight: 1.65, maxWidth: 340 }}>
              Coordinamos la visita técnica y entregamos informes certificados en tiempo récord. Consultanos sin compromiso.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { icon: "ti-map-pin", label: "Dirección", value: "Monteagudo 511, Piso 2 Of. D\nSan Miguel de Tucumán, Argentina" },
                { icon: "ti-mail", label: "Email", value: "contacto@envexar.com" },
                { icon: "ti-brand-whatsapp", label: "WhatsApp", value: "Consultas rápidas" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", gap: 14 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i className={`ti ${icon}`} style={{ fontSize: 18, color: "#86efac" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 2, fontWeight: 600, letterSpacing: "0.05em" }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 1.5, whiteSpace: "pre-line" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div style={{ backgroundColor: "#f8fafc", padding: "56px 48px" }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", marginBottom: 28 }}>Solicitar estudio</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Row: Nombre + Empresa */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Nombre completo *</label>
                  <input
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Juan García"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Empresa</label>
                  <input
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    placeholder="Nombre de empresa"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Email corporativo *</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="juan@empresa.com"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Teléfono / WhatsApp</label>
                <input
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+54 381 000 0000"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>¿Qué estudio necesitás? *</label>
                <select
                  required
                  value={formData.estudio}
                  onChange={(e) => setFormData({ ...formData, estudio: e.target.value })}
                  style={{ ...inputStyle, color: formData.estudio ? "#111827" : "#9ca3af" }}
                >
                  <option value="" disabled>Seleccioná un estudio</option>
                  {studyOptions.map((opt) => (
                    <option key={opt} value={opt} style={{ color: "#111827" }}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Mensaje</label>
                <textarea
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  placeholder="Describí brevemente tu necesidad..."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: "#1e3a5f",
                  color: "white",
                  border: "none",
                  padding: "13px 24px",
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  letterSpacing: "0.03em",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#162d4a")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e3a5f")}
              >
                <i className="ti ti-send" style={{ fontSize: 16 }} />
                Enviar solicitud
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#111827", padding: "20px 24px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 13, color: "#9ca3af" }}>
            © 2026 Environmental Express Argentina · envexar.com
          </div>
          <div style={{ fontSize: 13, color: "#9ca3af" }}>
            Tucumán, Argentina · contacto@envexar.com
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/5493814000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          backgroundColor: "#25d366",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          boxShadow: "0 4px 16px rgba(37,211,102,0.4)",
          zIndex: 999,
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,211,102,0.55)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,211,102,0.4)";
        }}
      >
        <i className="ti ti-brand-whatsapp" />
      </a>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger-btn { display: flex !important; align-items: center; }
        }
        @media (max-width: 640px) {
          #servicios > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
          #por-que > div {
            grid-template-columns: 1fr !important;
          }
          #contacto > div {
            grid-template-columns: 1fr !important;
          }
          #contacto > div > div:first-child {
            padding: 40px 24px !important;
          }
          #contacto > div > div:last-child {
            padding: 40px 24px !important;
          }
          #por-que > div > div:last-child {
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1.5px solid #d1d5db",
  borderRadius: 4,
  fontSize: 14,
  color: "#111827",
  backgroundColor: "white",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};
