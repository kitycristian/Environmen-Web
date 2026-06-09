import { useState, useEffect, useRef } from "react";

interface Report {
  id: number;
  titulo: string;
  descripcion?: string;
  tipoEstudio?: string;
  fechaEstudio?: string;
  pdfNombre: string;
  creadoEn: string;
}

export default function Portal() {
  const [screen, setScreen] = useState<"loading" | "login" | "portal">("loading");
  const [userName, setUserName] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [pdfModal, setPdfModal] = useState<{ id: number; titulo: string } | null>(null);
  const passRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/portal/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setUserName(data.nombre);
          setScreen("portal");
          loadReports();
        } else {
          setScreen("login");
        }
      })
      .catch(() => setScreen("login"));
  }, []);

  const loadReports = async () => {
    const r = await fetch("/api/portal/reports", { credentials: "include" });
    if (r.ok) setReports(await r.json());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const r = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (r.ok) {
        const d = await r.json();
        setUserName(d.nombre);
        setScreen("portal");
        loadReports();
      } else {
        const d = await r.json();
        setLoginError(d.message ?? "Email o contraseña incorrectos");
      }
    } catch {
      setLoginError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/portal/logout", { method: "POST", credentials: "include" });
    setScreen("login");
    setReports([]);
    setEmail("");
    setPassword("");
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });

  if (screen === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#166534", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 13 }}>Verificando sesión…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />

      {/* NAV */}
      <nav style={{ background: "#0D2F5E", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="36" height="36" viewBox="0 0 110 110">
            <rect width="110" height="110" fill="#0D2F5E" rx="6" />
            <ellipse cx="55" cy="57" rx="34" ry="26" fill="none" stroke="#2E7D32" strokeWidth="2.5" />
            <ellipse cx="55" cy="57" rx="34" ry="10" fill="none" stroke="#2E7D32" strokeWidth="1.8" />
            <ellipse cx="55" cy="57" rx="13" ry="26" fill="none" stroke="#2E7D32" strokeWidth="1.8" />
            <circle cx="55" cy="57" r="19" fill="#0D2F5E" />
            <text x="55" y="64" textAnchor="middle" fontFamily="Arial Black" fontWeight="900" fontSize="18" fill="#fff">EEA</text>
            <circle cx="96" cy="96" r="10" fill="#2E7D32" />
            <text x="96" y="101" textAnchor="middle" fontFamily="Arial" fontSize="12" fill="#fff" fontWeight="900">✓</text>
          </svg>
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Environmental Express Argentina</div>
            <div style={{ color: "#7EC8A0", fontSize: 10 }}>Portal de Informes</div>
          </div>
        </div>
        <a href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <i className="ti ti-arrow-left" /> Volver al sitio
        </a>
      </nav>

      {/* LOGIN */}
      {screen === "login" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", padding: 24, background: "#f8fafc" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 36, maxWidth: 400, width: "100%", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <i className="ti ti-lock" style={{ fontSize: 22, color: "#166534" }} />
              </div>
              <h2 style={{ color: "#0D2F5E", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Acceso al portal</h2>
              <p style={{ color: "#64748b", fontSize: 13 }}>Ingresá con las credenciales que te enviamos</p>
            </div>
            <form onSubmit={handleLogin}>
              {loginError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 12.5, padding: "9px 12px", borderRadius: 7, marginBottom: 12 }}>
                  <i className="ti ti-alert-circle" style={{ marginRight: 6 }} />{loginError}
                </div>
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                onKeyDown={(e) => e.key === "Enter" && passRef.current?.focus()}
                style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13.5, color: "#1e293b", outline: "none", marginBottom: 10, boxSizing: "border-box" }}
              />
              <input
                ref={passRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13.5, color: "#1e293b", outline: "none", marginBottom: 14, boxSizing: "border-box" }}
              />
              <button
                type="submit"
                disabled={loginLoading}
                style={{ width: "100%", background: loginLoading ? "#15803d99" : "#166534", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loginLoading ? "not-allowed" : "pointer" }}
              >
                {loginLoading ? "Ingresando…" : "Ingresar →"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL */}
      {screen === "portal" && (
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "36px 24px", minHeight: "calc(100vh - 60px)", background: "#f8fafc" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <h1 style={{ color: "#0D2F5E", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Mis informes</h1>
              <p style={{ color: "#64748b", fontSize: 13 }}>Bienvenido/a, <strong>{userName}</strong>. Podés visualizar e imprimir tus informes desde acá.</p>
            </div>
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "1px solid #e2e8f0", color: "#64748b", padding: "8px 16px", borderRadius: 7, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
            >
              <i className="ti ti-logout" /> Cerrar sesión
            </button>
          </div>

          {reports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
              <i className="ti ti-file-off" style={{ fontSize: 52, display: "block", marginBottom: 14 }} />
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Aún no tenés informes disponibles</p>
              <p style={{ fontSize: 13 }}>Te notificaremos por email cuando tu informe esté listo.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reports.map((r) => (
                <div
                  key={r.id}
                  style={{ background: "#fff", border: "1px solid #e2e8f0", borderLeft: "4px solid #166534", borderRadius: 12, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {r.tipoEstudio && (
                      <span style={{ display: "inline-block", background: "#dcfce7", color: "#166534", fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginBottom: 6 }}>
                        {r.tipoEstudio}
                      </span>
                    )}
                    <div style={{ color: "#0D2F5E", fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{r.titulo}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      {r.fechaEstudio && <span>Estudio: {r.fechaEstudio}</span>}
                      {r.fechaEstudio && r.descripcion && <span> · </span>}
                      {r.descripcion && <span>{r.descripcion}</span>}
                      {!r.fechaEstudio && !r.descripcion && <span>Cargado el {formatDate(r.creadoEn)}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => setPdfModal({ id: r.id, titulo: r.titulo })}
                    style={{ background: "#0D2F5E", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", flexShrink: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#1e3a5f")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#0D2F5E")}
                  >
                    <i className="ti ti-printer" /> Ver e imprimir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PDF VIEWER MODAL */}
      {pdfModal && (
        <div style={{ position: "fixed", inset: 0, background: "#1e293b", zIndex: 1000, display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#0D2F5E", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{pdfModal.titulo}</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  const frame = document.getElementById("pdf-frame") as HTMLIFrameElement;
                  frame?.contentWindow?.print();
                }}
                style={{ background: "#166534", color: "#fff", border: "none", padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <i className="ti ti-printer" /> Imprimir
              </button>
              <button
                onClick={() => setPdfModal(null)}
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "9px 16px", borderRadius: 7, fontSize: 13, cursor: "pointer" }}
              >
                <i className="ti ti-x" /> Cerrar
              </button>
            </div>
          </div>
          <iframe
            id="pdf-frame"
            src={`/api/portal/reports/${pdfModal.id}/pdf`}
            style={{ flex: 1, border: "none", width: "100%" }}
          />
        </div>
      )}
    </>
  );
}
