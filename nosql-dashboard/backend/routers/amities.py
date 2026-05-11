from fastapi import APIRouter
from database import get_session

router = APIRouter()

@router.get("/")
def get_amities(statut: str = ""):
    with get_session() as session:
        result = session.run("""
            MATCH (a:Utilisateur)-[r:EST_AMI_DE]->(b:Utilisateur)
            WHERE $statut = '' OR r.statut = $statut
            RETURN a.nom AS de, b.nom AS vers,
                   r.statut AS statut, r.depuis AS depuis,
                   r.initie_par AS initie_par
            ORDER BY r.depuis DESC
        """, statut=statut)
        return [dict(r) for r in result]

@router.get("/recommandations/{nom}")
def get_recommandations(nom: str):
    with get_session() as session:
        result = session.run("""
            MATCH (u:Utilisateur {nom: $nom})-[r:EST_AMI_DE]-(ami)-[:A_ACHETE]->(p:Produit)
            WHERE r.statut = 'accepte' AND NOT (u)-[:A_ACHETE]->(p)
            RETURN p.nom AS produit, count(ami) AS score
            ORDER BY score DESC LIMIT 10
        """, nom=nom)
        return [dict(r) for r in result]

@router.put("/statut")
def update_statut(de: str, vers: str, statut: str):
    with get_session() as session:
        session.run("""
            MATCH (a:Utilisateur {nom: $de})-[r:EST_AMI_DE]->(b:Utilisateur {nom: $vers})
            SET r.statut = $statut
        """, de=de, vers=vers, statut=statut)
        return {"message": f"Statut mis à jour : {statut}"}