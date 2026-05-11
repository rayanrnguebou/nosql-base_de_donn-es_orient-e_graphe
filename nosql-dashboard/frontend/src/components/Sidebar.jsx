import { LayoutDashboard, Package, Users, Heart, Terminal as TermIcon } from "lucide-react"

const items = [
  { key: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { key: "produits",     label: "Produits",     icon: Package },
  { key: "utilisateurs", label: "Utilisateurs", icon: Users },
  { key: "amities",      label: "Amitiés",      icon: Heart },
  { key: "terminal",     label: "Terminal",      icon: TermIcon },
]

export default function Sidebar({ page, setPage }) {
  return (
    <aside style={{ width: 220, background: "#161b27", borderRight: "1px solid #1e2535", padding: "24px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ padding: "0 12px 24px", borderBottom: "1px solid #1e2535", marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#7c6af7" }}>Neo4j</div>
        <div style={{ fontSize: 12, color: "#64748b" }}>Dashboard e-commerce</div>
      </div>
      {items.map(({ key, label, icon: Icon }) => (
        <button key={key} onClick={() => setPage(key)} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
          borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left",
          background: page === key ? "#1e2535" : "transparent",
          color: page === key ? "#7c6af7" : "#94a3b8",
          fontSize: 14, fontWeight: page === key ? 600 : 400,
          transition: "all 0.15s"
        }}>
          <Icon size={16} />
          {label}
        </button>
      ))}
    </aside>
  )
}