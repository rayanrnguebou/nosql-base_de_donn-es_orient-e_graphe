import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Produits from "./pages/Produits"
import Utilisateurs from "./pages/Utilisateurs"
import Amities from "./pages/Amities"
import Terminal from "./pages/Terminal"

export default function App() {
  const [page, setPage] = useState("dashboard")

  const pages = {
    dashboard: <Dashboard />,
    produits: <Produits />,
    utilisateurs: <Utilisateurs />,
    amities: <Amities />,
    terminal: <Terminal />,
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f1117", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" }}>
      <Sidebar page={page} setPage={setPage} />
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {pages[page]}
      </main>
    </div>
  )
}