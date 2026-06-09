import { useState, useEffect, useRef } from "react";

interface PortalUser {
  id: number;
  email: string;
  nombre: string;
  empresa?: string;
  activo: boolean;
  creadoEn: string;
}

interface AllReport {
  id: number;
  titulo: string;
  tipoEstudio?: string;
  fechaEstudio?: string;
  notificacionEnviada: boolean;
  creadoEn: string;
  userId: number;
  userNombre?: string;
  userEmpresa?: string;
}

const TIPOS_ESTUDIO = [
  "Iluminación", "Ruido", "Dosimetría de ruido", "Carga térmica", "Estrés por frío",
  "Puesta a tierra", "Vibraciones", "Ventilación", "Contaminantes químicos",
  "Material particulado", "Ergonomía", "PAT / Riesgo eléctrico", "Otro",
];

export default function PortalAdmin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("portal_admin_token") ?? "");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<"users" | "reports">("users");

  const [users, setUsers] = useState<PortalUser[]>([]);
  const [allReports, setAllReports] = useState<AllReport[]>([]);
  const [loading, setLoading] = useState(false);

  const [newUserModal, setNewUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: "", email: "", empresa: "" });
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [savingUser, setSavingUser] = useState(false);

  const [uploadModal, setUploadModal] = useState<PortalUser | null>(null);
  const [uploadData, setUploadData] = useState({ titulo: "", tipoEstudio: "", fechaEstudio: "", descripcion: "" });
  const [pdfFile, setPdfFile] = useState<{ base64: string; nombre: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const tryAuth = async (t: string) => {
    setAuthError("");
    const r = await fetch("/api/portal-users", { headers: { Authorization: `Bearer ${t}` } });
    if (r.ok) {
      sessionStorage.setItem("portal_admin_token", t);
      setAuthed(true);
      setUsers(await r.json());
    } else {
      setAuthError("Token incorrecto");
    }
  };

  useEffect(() => {
    if (token) tryAuth(token);
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [u, r] = await Promise.all([
      fetch("/api/portal-users", { headers }).then((x) => x.json()),
      fetch("/api/portal-reports-all", { headers }).then((x) => x.json()),
    ]);
    setUsers(u);
    setAllReports(r);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) loadData();
  }, [authed]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingUser(true);
    const r = await fetch("/api/portal-users", {
      method: "POST",
      headers,
      body: JSON.stringify(newUser),
    });
    if (r.ok) {
      const d = await r.json();
      setCreatedPassword(d.passwordGenerada);
      loadData();
    }
    setSavingUser(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      setPdfFile({ base64, nombre: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadModal || !pdfFile) return;
    setUploading(true);
    const r = await fetch(`/api/portal-users/${uploadModal.id}/reports`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...uploadData, pdfBase64: pdfFile.base64, pdfNombre: pdfFile.nombre }),
    });
    if (r.ok) {
      setUploadDone(true);
      loadData();
    }
    setUploading(false);
  };

  const deactivate = async (id: number) => {
    if (!confirm("¿Desactivar este acceso?")) return;
    await fetch(`/api/portal-users/${id}`, { method: "DELETE", headers });
    loadData();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });

  const inp: React.CSSProperties = {
    width: "100%", padding: "9px 11px", border: "1.5px solid #e5e7eb", borderRadius: 7,
    fontSize: 13, color: "#1e293b", outline: "none", boxSizing: "border-box",
  };
  const btn: React.CSSProperties = {
    background: "#166534", color: "#fff", border: "none", padding: "10px 20px",
    borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer",
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
        <div style={{ background: "#fff", padding: 36, borderRadius: 14, maxWidth: 360, width: "100%", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, background: "#fef3c7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
              <i className="ti ti-shield-lock" style={{ fontSize: 22, color: "#d97706" }} />
            </div>
            <h2 style={{ color: "#0D2F5E", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Panel administrativo</h2>
            <p style={{ color: "#64748b", fontSize: 12.5 }}>Ingresá el token de administrador</p>
          </div>
          {authError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 12, padding: "8px 11px", borderRadius: 7, marginBottom: 10 }}>
              {authError}
            </div>
          )}
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token de administrador"
            style={{ ...inp, marginBottom: 12 }}
            onKeyDown={(e) => e.key === "Enter" && tryAuth(token)}
          />
          <button onClick={() => tryAuth(token)} style={{ ...btn, width: "100%" }}>
            Acceder →
          </button>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <a href="/" style={{ color: "#94a3b8", fontSize: 12, textDecoration: "none" }}>
              ← Volver al sitio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
      <style>{`
        .admin-table th { background:#f8fafc; color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; padding:10px 14px; text-align:left; border-bottom:1px solid #e2e8f0; }
        .admin-table td { padding:12px 14px; font-size:13px; color:#1e293b; border-bottom:1px solid #f1f5f9; vertical-align:middle; }
        .admin-table tr:last-child td { border-bottom:none; }
        .admin-table tr:hover td { background:#f8fafc; }
      `}</style>

      <nav style={{ background: "#0D2F5E", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
          <i className="ti ti-shield" style={{ marginRight: 8, color: "#7EC8A0" }} />
          EEA · Panel Portal
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={loadData} style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>
            <i className="ti ti-refresh" /> Actualizar
          </button>
          <button
            onClick={() => { sessionStorage.removeItem("portal_admin_token"); setAuthed(false); setToken(""); }}
            style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
          >
            <i className="ti ti-logout" /> Salir
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {/* TABS */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid #e2e8f0" }}>
          {(["users", "reports"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ padding: "10px 20px", border: "none", background: "none", fontSize: 13.5, fontWeight: 600, cursor: "pointer", color: tab === t ? "#166534" : "#64748b", borderBottom: `2px solid ${tab === t ? "#166534" : "transparent"}`, marginBottom: -1 }}
            >
              <i className={`ti ${t === "users" ? "ti-users" : "ti-files"}`} style={{ marginRight: 7 }} />
              {t === "users" ? "Clientes del portal" : "Informes subidos"}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: "#94a3b8", fontSize: 13 }}>Cargando…</p>}

        {/* TAB: USERS */}
        {tab === "users" && !loading && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ color: "#0D2F5E", fontSize: 17, fontWeight: 800 }}>Accesos activos</h2>
                <p style={{ color: "#64748b", fontSize: 12.5, marginTop: 2 }}>{users.length} cliente{users.length !== 1 ? "s" : ""} registrado{users.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => { setNewUserModal(true); setCreatedPassword(null); setNewUser({ nombre: "", email: "", empresa: "" }); }} style={btn}>
                <i className="ti ti-user-plus" style={{ marginRight: 6 }} /> Nuevo acceso
              </button>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
              <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Empresa</th>
                    <th>Estado</th>
                    <th>Informes</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8", padding: 28 }}>Sin clientes registrados</td></tr>
                  ) : users.map((u) => {
                    const count = allReports.filter((r) => r.userId === u.id).length;
                    return (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 600 }}>{u.nombre}</td>
                        <td style={{ color: "#64748b" }}>{u.email}</td>
                        <td style={{ color: "#64748b" }}>{u.empresa ?? "—"}</td>
                        <td>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: u.activo ? "#dcfce7" : "#f1f5f9", color: u.activo ? "#166534" : "#94a3b8", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: u.activo ? "#22c55e" : "#cbd5e1", display: "inline-block" }} />
                            {u.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: "#64748b", fontSize: 12 }}>
                            {count} informe{count !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={() => { setUploadModal(u); setUploadData({ titulo: "", tipoEstudio: "", fechaEstudio: "", descripcion: "" }); setPdfFile(null); setUploadDone(false); if (fileRef.current) fileRef.current.value = ""; }}
                              style={{ background: "#0D2F5E", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                            >
                              <i className="ti ti-upload" /> Subir informe
                            </button>
                            {u.activo && (
                              <button
                                onClick={() => deactivate(u.id)}
                                style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "7px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                              >
                                <i className="ti ti-user-off" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* TAB: REPORTS */}
        {tab === "reports" && !loading && (
          <>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ color: "#0D2F5E", fontSize: 17, fontWeight: 800 }}>Todos los informes</h2>
              <p style={{ color: "#64748b", fontSize: 12.5, marginTop: 2 }}>{allReports.length} informe{allReports.length !== 1 ? "s" : ""} cargado{allReports.length !== 1 ? "s" : ""}</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
              <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Fecha estudio</th>
                    <th>Notificación</th>
                    <th>Cargado</th>
                  </tr>
                </thead>
                <tbody>
                  {allReports.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8", padding: 28 }}>Sin informes cargados</td></tr>
                  ) : allReports.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.userNombre ?? "—"}</div>
                        {r.userEmpresa && <div style={{ color: "#64748b", fontSize: 11 }}>{r.userEmpresa}</div>}
                      </td>
                      <td style={{ fontWeight: 500 }}>{r.titulo}</td>
                      <td>
                        {r.tipoEstudio ? (
                          <span style={{ background: "#dcfce7", color: "#166534", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20 }}>{r.tipoEstudio}</span>
                        ) : "—"}
                      </td>
                      <td style={{ color: "#64748b" }}>{r.fechaEstudio ?? "—"}</td>
                      <td>
                        <span style={{ color: r.notificacionEnviada ? "#166534" : "#94a3b8", fontSize: 12, fontWeight: 600 }}>
                          <i className={`ti ${r.notificacionEnviada ? "ti-mail-check" : "ti-mail-off"}`} style={{ marginRight: 4 }} />
                          {r.notificacionEnviada ? "Enviada" : "Pendiente"}
                        </span>
                      </td>
                      <td style={{ color: "#64748b" }}>{formatDate(r.creadoEn)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* MODAL: NUEVO USUARIO */}
      {newUserModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            {createdPassword ? (
              <>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <i className="ti ti-check" style={{ fontSize: 24, color: "#166534" }} />
                  </div>
                  <h3 style={{ color: "#0D2F5E", fontSize: 16, fontWeight: 800 }}>Acceso creado</h3>
                  <p style={{ color: "#64748b", fontSize: 12.5, marginTop: 4 }}>Guardá esta contraseña — no se vuelve a mostrar</p>
                </div>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 18px", marginBottom: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Contraseña generada</div>
                  <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 3, color: "#0D2F5E", fontFamily: "monospace" }}>{createdPassword}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
                    {process.env.NODE_ENV === "development" ? "(en producción se envía automáticamente por email)" : "El cliente la recibirá por email si SMTP está configurado"}
                  </div>
                </div>
                <button onClick={() => { setNewUserModal(false); setCreatedPassword(null); }} style={{ ...btn, width: "100%" }}>
                  Listo
                </button>
              </>
            ) : (
              <>
                <h3 style={{ color: "#0D2F5E", fontSize: 16, fontWeight: 800, marginBottom: 16 }}>
                  <i className="ti ti-user-plus" style={{ marginRight: 8 }} />Nuevo acceso al portal
                </h3>
                <form onSubmit={handleCreateUser}>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Nombre del contacto *</label>
                    <input value={newUser.nombre} onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })} required style={inp} placeholder="Ej: Juan García" />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Email *</label>
                    <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required style={inp} placeholder="cliente@empresa.com" />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Empresa</label>
                    <input value={newUser.empresa} onChange={(e) => setNewUser({ ...newUser, empresa: e.target.value })} style={inp} placeholder="Opcional" />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="button" onClick={() => setNewUserModal(false)} style={{ flex: 1, background: "#f1f5f9", color: "#374151", border: "none", padding: "10px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Cancelar
                    </button>
                    <button type="submit" disabled={savingUser} style={{ ...btn, flex: 2 }}>
                      {savingUser ? "Creando…" : "Crear acceso"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL: SUBIR INFORME */}
      {uploadModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, maxWidth: 460, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}>
            {uploadDone ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ width: 52, height: 52, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <i className="ti ti-check" style={{ fontSize: 28, color: "#166534" }} />
                </div>
                <h3 style={{ color: "#0D2F5E", fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Informe subido</h3>
                <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
                  El cliente puede verlo ahora en su portal.
                  {uploadModal?.email && <><br />Se envió notificación a <strong>{uploadModal.email}</strong>.</>}
                </p>
                <button onClick={() => setUploadModal(null)} style={{ ...btn, width: "100%" }}>Listo</button>
              </div>
            ) : (
              <>
                <h3 style={{ color: "#0D2F5E", fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
                  <i className="ti ti-upload" style={{ marginRight: 8 }} />Subir informe
                </h3>
                <p style={{ color: "#64748b", fontSize: 12.5, marginBottom: 18 }}>Para: <strong>{uploadModal.nombre}</strong> {uploadModal.empresa ? `(${uploadModal.empresa})` : ""}</p>
                <form onSubmit={handleUpload}>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Título del informe *</label>
                    <input value={uploadData.titulo} onChange={(e) => setUploadData({ ...uploadData, titulo: e.target.value })} required style={inp} placeholder="Ej: Medición de Iluminación — Planta Sur" />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Tipo de estudio</label>
                    <select value={uploadData.tipoEstudio} onChange={(e) => setUploadData({ ...uploadData, tipoEstudio: e.target.value })} style={{ ...inp }}>
                      <option value="">Seleccionar…</option>
                      {TIPOS_ESTUDIO.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Fecha del estudio</label>
                    <input type="date" value={uploadData.fechaEstudio} onChange={(e) => setUploadData({ ...uploadData, fechaEstudio: e.target.value })} style={inp} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Descripción / observaciones</label>
                    <textarea value={uploadData.descripcion} onChange={(e) => setUploadData({ ...uploadData, descripcion: e.target.value })} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Opcional" />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Archivo PDF *</label>
                    <input ref={fileRef} type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} required={!pdfFile} style={{ ...inp, padding: "7px 11px" }} />
                    {pdfFile && (
                      <div style={{ marginTop: 6, fontSize: 12, color: "#166534", display: "flex", alignItems: "center", gap: 5 }}>
                        <i className="ti ti-file-check" /> {pdfFile.nombre}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="button" onClick={() => setUploadModal(null)} style={{ flex: 1, background: "#f1f5f9", color: "#374151", border: "none", padding: "10px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Cancelar
                    </button>
                    <button type="submit" disabled={uploading || !pdfFile} style={{ ...btn, flex: 2, opacity: !pdfFile ? 0.7 : 1 }}>
                      {uploading ? <><i className="ti ti-loader-2" style={{ marginRight: 6 }} />Subiendo…</> : "Subir informe"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
