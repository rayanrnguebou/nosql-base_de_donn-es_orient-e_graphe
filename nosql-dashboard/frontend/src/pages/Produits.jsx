import { useEffect, useState } from "react"
import axios from "axios"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

const API = "http://localhost:8000"
const CATEGORIES = ["", "Electronique", "Livres", "Mode", "Alimentation", "Sport"]
const CAT_IDS = { Electronique: "c1", Livres: "c2", Mode: "c3", Alimentation: "c4", Sport: "c5" }

const inp = {
  background: "#0f1117", border: "1px solid #1e2535",
  borderRadius: 8, padding: "8px 12px",
  color: "#e2e8f0", fontSize: 13, width: "100%"
}
const btn = (c = "#7c6af7") => ({
  background: c, border: "none", borderRadius: 8,
  padding: "8px 16px", color: "#fff", cursor: "pointer",
  fontSize: 13, fontWeight: 600, display: "flex",
  alignItems: "center", gap: 6
})

export default function Produits() {
  const [produits, setProduits] = useState([])
  const [search, setSearch] = useState("")
  const [categorie, setCategorie] = useState("")
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ id: "", nom: "", prix: "", stock: "", categorie_id: "c1" })

  const load = () =>
    axios.get(`${API}/produits/`, { params: { search, categorie } })
      .then(r => setProduits(r.data))
      .catch(() => setProduits([]))

  useEffect(() => { load() }, [search, categorie])

  const openCreate = () => {
    setForm({ id: `p${Date.now()}`, nom: "", prix: "", stock: "", categorie_id: "c1" })
    setModal("create")
  }

  const openEdit = (p) => {
    setForm({ id: p.id, nom: p.nom, prix: p.prix, stock: p.stock, categorie_id: CAT_IDS[p.categorie] || "c1" })
    setModal("edit")
  }

  const save = async () => {
    if (modal === "create") {
      await axios.post(`${API}/produits/`, { ...form, prix: parseFloat(form.prix), stock: parseInt(form.stock) })
    } else {
      await axios.put(`${API}/produits/${form.id}`, { nom: form.nom, prix: parseFloat(form.prix), stock: parseInt(form.stock) })
    }
    setModal(null)
    load()
  }

  const del = async (id) => {
    if (window.confirm("Supprimer ce produit ?")) {
      await axios.delete(`${API}/produits/${id}`)
      load()
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Produits</h1>
        <button style={btn()} onClick={openCreate}>
          <Plus size={14} />Nouveau produit
        </button>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: "#64748b" }} />
          <input
            style={{ ...inp, paddingLeft: 32 }}
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select style={{ ...inp, width: "auto" }} value={categorie} onChange={e => setCategorie(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || "Toutes catégories"}</option>)}
        </select>
      </div>

      <div style={{ background: "#161b27", border: "1px solid #1e2535", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e2535" }}>
              {["Nom", "Catégorie", "Prix (FCFA)", "Stock", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#64748b", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {produits.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #1e2535", background: i % 2 === 0 ? "transparent" : "#0f1117" }}>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#e2e8f0" }}>{p.nom}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ background: "#1e2535", borderRadius: 6, padding: "2px 8px", fontSize: 12, color: "#7c6af7" }}>{p.categorie}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#10b981" }}>{Number(p.prix).toLocaleString()}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: p.stock < 50 ? "#ef4444" : "#94a3b8" }}>{p.stock}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(p)} style={{ ...btn("#1e2535"), padding: "6px 10px" }}><Pencil size={13} /></button>
                    <button onClick={() => del(p.id)} style={{ ...btn("#ef4444"), padding: "6px 10px" }}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {produits.length === 0 && (
          <div style={{ padding: 24, textAlign: "center", color: "#475569", fontSize: 13 }}>Aucun produit trouvé.</div>
        )}
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#161b27", border: "1px solid #1e2535", borderRadius: 16, padding: 32, width: 420 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18 }}>
              {modal === "create" ? "Nouveau produit" : "Modifier le produit"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input style={inp} placeholder="Nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
              <input style={inp} placeholder="Prix (FCFA)" type="number" value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} />
              <input style={inp} placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              {modal === "create" && (
                <select style={inp} value={form.categorie_id} onChange={e => setForm({ ...form, categorie_id: e.target.value })}>
                  {Object.entries(CAT_IDS).map(([nom, id]) => <option key={id} value={id}>{nom}</option>)}
                </select>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                <button style={btn("#1e2535")} onClick={() => setModal(null)}>Annuler</button>
                <button style={btn()} onClick={save}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}