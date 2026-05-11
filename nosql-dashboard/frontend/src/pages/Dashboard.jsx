import { useEffect, useState } from "react"
import axios from "axios"
import StatCard from "../components/StatCard"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const API = "http://localhost:8000"
const COLORS = ["#7c6af7", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    axios.get(`${API}/dashboard/stats`).then(r => setStats(r.data))
  }, [])

  if (!stats) return <div style={{ color: "#64748b" }}>Chargement...</div>

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Dashboard</h1>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <StatCard label="Utilisateurs" value={stats.Utilisateur} color="#7c6af7" />
        <StatCard label="Produits" value={stats.Produit} color="#06b6d4" />
        <StatCard label="Catégories" value={stats.Categorie} color="#10b981" />
        <StatCard label="Total achats" value={stats.ventes_categorie?.reduce((a, b) => a + b.ventes, 0)} color="#f59e0b" />
      </div>

      {/* Graphiques */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

        {/* Top produits */}
        <div style={{ flex: 2, minWidth: 300, background: "#161b27", border: "1px solid #1e2535", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#94a3b8" }}>Produits les plus vendus</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.top_produits} layout="vertical">
              <XAxis type="number" tick={{ fill: "#475569", fontSize: 11 }} />
              <YAxis dataKey="produit" type="category" width={140} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1e2535", border: "none", color: "#e2e8f0" }} />
              <Bar dataKey="ventes" fill="#7c6af7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ventes par catégorie */}
        <div style={{ flex: 1, minWidth: 260, background: "#161b27", border: "1px solid #1e2535", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#94a3b8" }}>Ventes par catégorie</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats.ventes_categorie} dataKey="ventes" nameKey="categorie" cx="50%" cy="50%" outerRadius={80} label={({ categorie, percent }) => `${categorie} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {stats.ventes_categorie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e2535", border: "none", color: "#e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top notes & utilisateurs */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

        {/* Top notes */}
        <div style={{ flex: 1, minWidth: 260, background: "#161b27", border: "1px solid #1e2535", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#94a3b8" }}>Meilleures notes</div>
          {stats.top_notes.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e2535" }}>
              <span style={{ fontSize: 13, color: "#cbd5e1" }}>{item.produit}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b" }}>★ {item.note}</span>
            </div>
          ))}
        </div>

        {/* Top utilisateurs */}
        <div style={{ flex: 1, minWidth: 260, background: "#161b27", border: "1px solid #1e2535", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#94a3b8" }}>Utilisateurs les plus actifs</div>
          {stats.top_utilisateurs.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e2535" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLORS[i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  {item.utilisateur[0]}
                </div>
                <span style={{ fontSize: 13, color: "#cbd5e1" }}>{item.utilisateur}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#06b6d4" }}>{item.achats} achats</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}