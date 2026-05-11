import { useEffect, useState } from "react"
import axios from "axios"
import { Heart, Check, User } from "lucide-react"

const API = "http://localhost:8000"
const btn = (c = "#7c6af7") => ({
  background: c, border: "none", borderRadius: 6,
  padding: "4px 10px", color: "#fff", cursor: "pointer",
  fontSize: 12, fontWeight: 600
})

export default function Amities() {
  const [amities, setAmities] = useState([])
  const [statut, setStatut] = useState("")
  const [reco, setReco] = useState([])
  const [recoUser, setRecoUser] = useState("Alice")

  const load = () =>
    axios.get(`${API}/amities/`, { params: { statut } })
      .then(r => setAmities(r.data))
      .catch(() => setAmities([]))

  const loadReco = () =>
    axios.get(`${API}/amities/recommandations/${recoUser}`)
      .then(r => setReco(r.data))
      .catch(() => setReco([]))

  useEffect(() => { load() }, [statut])
  useEffect(() => { loadReco() }, [recoUser])

  const updateStatut = async (de, vers, s) => {
    await axios.put(`${API}/amities/statut`, null, { params: { de, vers, statut: s } })
    load()
  }

  const statuts = [
    { key: "", label: "Toutes", color: "#64748b" },
    { key: "accepte", label: "Acceptées", color: "#10b981" },
    { key: "en_attente", label: "En attente", color: "#f59e0b" },
  ]

  const USERS = ["Alice","Bob","Claire","David","Eva","Frank","Grace","Henri","Iris","Jules"]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Réseau social &amp; Amitiés</h1>

      <div style={{ display: "flex", gap: 8 }}>
        {statuts.map(s => (
          <button key={s.key} onClick={() => setStatut(s.key)}
            style={{ ...btn(statut === s.key ? s.color : "#1e2535") }}>
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 2, minWidth: 300, background: "#161b27", border: "1px solid #1e2535", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", marginBottom: 12 }}>
            Relations ({amities.length})
          </div>
          {amities.length === 0 && (
            <div style={{ color: "#475569", fontSize: 13 }}>Aucune relation trouvée.</div>
          )}
          {amities.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2535" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <User size={14} style={{ color: "#7c6af7" }} />
                <span style={{ fontSize: 13, color: "#e2e8f0" }}>{a.de}</span>
                <span style={{ fontSize: 12, color: "#475569" }}>→</span>
                <span style={{ fontSize: 13, color: "#e2e8f0" }}>{a.vers}</span>
                <span style={{ fontSize: 11, color: "#475569" }}>{a.depuis}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 6,
                  background: a.statut === "accepte" ? "#052e16" : "#431407",
                  color: a.statut === "accepte" ? "#10b981" : "#f59e0b"
                }}>
                  {a.statut === "accepte" ? "✓ Acceptée" : "⏳ En attente"}
                </span>
                {a.statut === "en_attente" && (
                  <button style={btn("#10b981")} onClick={() => updateStatut(a.de, a.vers, "accepte")}>
                    <Check size={11} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 260, background: "#161b27", border: "1px solid #1e2535", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Heart size={14} style={{ color: "#ef4444" }} />
            Recommandations
          </div>
          <select
            value={recoUser}
            onChange={e => setRecoUser(e.target.value)}
            style={{ background: "#0f1117", border: "1px solid #1e2535", borderRadius: 8, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, width: "100%", marginBottom: 12 }}>
            {USERS.map(n => <option key={n}>{n}</option>)}
          </select>
          {reco.length === 0 && (
            <div style={{ color: "#475569", fontSize: 13 }}>Aucune recommandation.</div>
          )}
          {reco.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e2535" }}>
              <span style={{ fontSize: 13, color: "#cbd5e1" }}>{r.produit}</span>
              <span style={{ fontSize: 12, color: "#7c6af7", fontWeight: 600 }}>Score {r.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}