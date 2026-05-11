import { useEffect, useState } from "react"
import axios from "axios"
import { Plus, Trash2, Search } from "lucide-react"

const API = "http://localhost:8000"
const VILLES = ["", "Douala", "Yaoundé", "Bafoussam", "Kribi", "Limbe"]
const COLORS = ["#7c6af7", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]

const inp = {
  background: "#0f1117", border: "1px solid #1e2535",
  borderRadius: 8, padding: "8px 12px",
  color: "#e2e8f0", fontSize: 13, width: "100%"
}
const btn = (c = "#7c6af7") => ({
  background: c, border: "none", borderRadius: 8,
  padding: "8px 16px", color: "#fff", cursor: "pointer",
  fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6
})

export default function Utilisateurs() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [ville, setVille] = useState("")
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ id: "", nom: "", age: "", ville: "Douala" })

  const load = () =>
    axios.get(`${API}/utilisateurs/`, { params: { search, ville } })
      .then(r => setUsers(r.data))
      .catch(() => setUsers([]))

  useEffect(() => { load() }, [search, ville])

  const openModal = () => {
    setForm({ id: `u${Date.now()}`, nom: "", age: "", ville: "Douala" })
    setModal(true)
  }

  const save = async () => {
    await axios.post(`${API}/utilisateurs/`, { ...form, age: parseInt(form.age) })
    setModal(false)
    load()
  }

  const del = async (id) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      await axios.delete(`${API}/utilisateurs/${id}`)
      load()
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Utilisateurs</h1>
        <button style={btn()} onClick={openModal}>
          <Plus size={14} />Nouvel utilisateur
        </button>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: "#64748b" }} />
          <input
            style={{ ...inp, paddingLeft: 32 }}
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select style={{ ...inp, width: "auto" }} value={ville} onChange={e => setVille(e.target.value)}>
          {VILLES.map(v => <option key={v} value={v}>{v || "Toutes les villes"}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {users.length === 0 && (
          <div style={{ color: "#475569", fontSize: 13 }}>Aucun utilisateur trouvé.</div>
        )}
        {users.map((u, i) => (
          <div key={u.id} style={{ background: "#161b27", border: "1px solid #1e2535", borderRadius: 12, padding: 16, width: 200, position: "relative" }}>
            <button onClick={() => del(u.id)}
              style={{ position: "absolute", top: 10, right: 10, background: "transparent", border: "none", cursor: "pointer", color: "#ef4444" }}>
              <Trash2 size={14} />
            </button>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS[i % COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
              {u.nom[0]}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{u.nom}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{u.age} ans · {u.ville}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#7c6af7", fontWeight: 600 }}>{u.nb_achats} achats</div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#161b27", border: "1px solid #1e2535", borderRadius: 16, padding: 32, width: 380 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18 }}>Nouvel utilisateur</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input style={inp} placeholder="Nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
              <input style={inp} placeholder="Âge" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
              <select style={inp} value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })}>
                {VILLES.filter(Boolean).map(v => <option key={v}>{v}</option>)}
              </select>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button style={btn("#1e2535")} onClick={() => setModal(false)}>Annuler</button>
                <button style={btn()} onClick={save}>Créer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}