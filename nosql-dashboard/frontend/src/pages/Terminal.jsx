import { useState } from "react"
import axios from "axios"
import { Play, ChevronRight } from "lucide-react"

const API = "http://localhost:8000"

const REQUETES = [
  { label: "Produits les plus vendus", key: "top_produits" },
  { label: "Meilleures notes", key: "top_notes" },
  { label: "Chemin Alice → Eva", key: "chemin_alice_eva" },
  { label: "Communautés par ville", key: "communautes" },
  { label: "Centralité utilisateurs", key: "centralite" },
  { label: "Stock faible (< 50)", key: "stock_faible" },
  { label: "Amitiés en attente", key: "amities_en_attente" },
]

export default function Terminal() {
  const [output, setOutput] = useState([])
  const [custom, setCustom] = useState("")
  const [loading, setLoading] = useState(false)

  const run = async (key) => {
    setLoading(true)
    try {
      const t0 = performance.now()
      const r = await axios.get(`${API}/cypher/predefinies/${key}`)
      const ms = (performance.now() - t0).toFixed(1)
      setOutput(prev => [{ key, data: r.data, ms, time: new Date().toLocaleTimeString() }, ...prev])
    } catch (e) {
      setOutput(prev => [{ key, data: [], error: String(e), ms: "—", time: new Date().toLocaleTimeString() }, ...prev])
    }
    setLoading(false)
  }

  const runCustom = async () => {
    if (!custom.trim()) return
    setLoading(true)
    try {
      const t0 = performance.now()
      const r = await axios.post(`${API}/cypher/executer`, { cypher: custom })
      const ms = (performance.now() - t0).toFixed(1)
      setOutput(prev => [{ key: "custom", cypher: custom, data: r.data.data || [], error: r.data.error, ms, time: new Date().toLocaleTimeString() }, ...prev])
    } catch (e) {
      setOutput(prev => [{ key: "custom", cypher: custom, data: [], error: String(e), ms: "—", time: new Date().toLocaleTimeString() }, ...prev])
    }
    setLoading(false)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Terminal Cypher</h1>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ width: 220, background: "#161b27", border: "1px solid #1e2535", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 10 }}>REQUÊTES PRÉDÉFINIES</div>
          {REQUETES.map(r => (
            <button key={r.key} onClick={() => run(r.key)}
              style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "8px 0", background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 13, textAlign: "left" }}>
              <ChevronRight size={12} style={{ color: "#7c6af7" }} />
              {r.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#161b27", border: "1px solid #1e2535", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>REQUÊTE PERSONNALISÉE</div>
            <textarea
              value={custom}
              onChange={e => setCustom(e.target.value)}
              placeholder="MATCH (n) RETURN labels(n), count(n)..."
              onKeyDown={e => { if (e.ctrlKey && e.key === "Enter") runCustom() }}
              style={{ width: "100%", minHeight: 80, background: "#0f1117", border: "1px solid #1e2535", borderRadius: 8, padding: 12, color: "#10b981", fontSize: 13, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "#475569" }}>Ctrl+Entrée pour exécuter</span>
              <button onClick={runCustom} disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "#7c6af7", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                <Play size={13} />{loading ? "Chargement..." : "Exécuter"}
              </button>
            </div>
          </div>

          {output.map((o, i) => (
            <div key={i} style={{ background: "#0f1117", border: "1px solid #1e2535", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#7c6af7", fontWeight: 600 }}>
                  {o.key === "custom" ? "Requête personnalisée" : REQUETES.find(r => r.key === o.key)?.label}
                </span>
                <span style={{ fontSize: 11, color: "#475569" }}>{o.time} · {o.ms} ms</span>
              </div>
              {o.error && <div style={{ color: "#ef4444", fontSize: 12, fontFamily: "monospace" }}>Erreur : {o.error}</div>}
              {o.data && o.data.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr>
                        {Object.keys(o.data[0]).map(k => (
                          <th key={k} style={{ padding: "4px 10px", textAlign: "left", color: "#64748b", borderBottom: "1px solid #1e2535" }}>{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {o.data.map((row, j) => (
                        <tr key={j} style={{ borderBottom: "1px solid #1e2535" }}>
                          {Object.values(row).map((v, k) => (
                            <td key={k} style={{ padding: "4px 10px", color: "#10b981", fontFamily: "monospace" }}>
                              {Array.isArray(v) ? v.join(" → ") : String(v ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {o.data && o.data.length === 0 && !o.error && (
                <div style={{ color: "#475569", fontSize: 12 }}>Aucun résultat.</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}