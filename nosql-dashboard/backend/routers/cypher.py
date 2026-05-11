from fastapi import APIRouter
from database import get_session
from pydantic import BaseModel

router = APIRouter()

REQUETES_PREDEFINIES = {
    "top_produits": "MATCH (u:Utilisateur)-[:A_ACHETE]->(p:Produit) RETURN p.nom AS produit, count(u) AS ventes ORDER BY ventes DESC LIMIT 10",
    "top_notes": "MATCH (u)-[r:A_NOTE]->(p:Produit) RETURN p.nom AS produit, round(avg(r.note),2) AS note ORDER BY note DESC",
    "chemin_alice_eva": "MATCH path = shortestPath((a:Utilisateur {nom:'Alice'})-[:EST_AMI_DE*..5]-(b:Utilisateur {nom:'Eva'})) RETURN [n IN nodes(path) | n.nom] AS chemin",
    "communautes": "MATCH (u:Utilisateur)-[:A_ACHETE]->(p)-[:APPARTIENT_A]->(c:Categorie) RETURN u.ville AS ville, c.nom AS categorie, count(*) AS achats ORDER BY achats DESC",
    "centralite": "MATCH (u:Utilisateur)-[:EST_AMI_DE*1..3]-(autre) RETURN u.nom AS utilisateur, count(DISTINCT autre) AS portee ORDER BY portee DESC",
    "stock_faible": "MATCH (p:Produit) WHERE p.stock < 50 RETURN p.nom AS produit, p.stock AS stock ORDER BY stock ASC",
    "amities_en_attente": "MATCH (a)-[r:EST_AMI_DE]->(b) WHERE r.statut='en_attente' RETURN a.nom AS de, b.nom AS vers, r.depuis AS depuis",
}

class Query(BaseModel):
    cypher: str

@router.get("/predefinies")
def get_predefinies():
    return list(REQUETES_PREDEFINIES.keys())

@router.get("/predefinies/{nom}")
def executer_predefinie(nom: str):
    if nom not in REQUETES_PREDEFINIES:
        return {"error": "Requête inconnue"}
    with get_session() as session:
        result = session.run(REQUETES_PREDEFINIES[nom])
        return [dict(r) for r in result]

@router.post("/executer")
def executer_cypher(q: Query):
    try:
        with get_session() as session:
            result = session.run(q.cypher)
            return {"success": True, "data": [dict(r) for r in result]}
    except Exception as e:
        return {"success": False, "error": str(e)}