from fastapi import APIRouter
from database import get_session

router = APIRouter()

@router.get("/stats")
def get_stats():
    with get_session() as session:
        stats = {}

        # Totaux
        r = session.run("MATCH (n) RETURN labels(n)[0] AS type, count(n) AS total")
        for rec in r:
            stats[rec["type"]] = rec["total"]

        # Produits les plus vendus
        r = session.run("""
            MATCH (u:Utilisateur)-[:A_ACHETE]->(p:Produit)
            RETURN p.nom AS produit, count(u) AS ventes
            ORDER BY ventes DESC LIMIT 5
        """)
        stats["top_produits"] = [{"produit": rec["produit"], "ventes": rec["ventes"]} for rec in r]

        # Meilleures notes
        r = session.run("""
            MATCH (u:Utilisateur)-[n:A_NOTE]->(p:Produit)
            RETURN p.nom AS produit, round(avg(n.note), 2) AS note
            ORDER BY note DESC LIMIT 5
        """)
        stats["top_notes"] = [{"produit": rec["produit"], "note": rec["note"]} for rec in r]

        # Ventes par catégorie
        r = session.run("""
            MATCH (u:Utilisateur)-[:A_ACHETE]->(p:Produit)-[:APPARTIENT_A]->(c:Categorie)
            RETURN c.nom AS categorie, count(*) AS ventes
            ORDER BY ventes DESC
        """)
        stats["ventes_categorie"] = [{"categorie": rec["categorie"], "ventes": rec["ventes"]} for rec in r]

        # Utilisateurs les plus actifs
        r = session.run("""
            MATCH (u:Utilisateur)-[:A_ACHETE]->(p:Produit)
            RETURN u.nom AS utilisateur, count(p) AS achats
            ORDER BY achats DESC LIMIT 5
        """)
        stats["top_utilisateurs"] = [{"utilisateur": rec["utilisateur"], "achats": rec["achats"]} for rec in r]

        return stats