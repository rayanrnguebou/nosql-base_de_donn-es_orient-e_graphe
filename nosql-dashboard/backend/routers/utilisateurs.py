from fastapi import APIRouter
from database import get_session
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class Utilisateur(BaseModel):
    id: str
    nom: str
    age: int
    ville: str

@router.get("/")
def get_utilisateurs(search: str = "", ville: str = ""):
    with get_session() as session:
        result = session.run("""
            MATCH (u:Utilisateur)
            WHERE ($search = '' OR toLower(u.nom) CONTAINS toLower($search))
            AND ($ville = '' OR u.ville = $ville)
            OPTIONAL MATCH (u)-[:A_ACHETE]->(p:Produit)
            RETURN u.id AS id, u.nom AS nom, u.age AS age,
                   u.ville AS ville, count(p) AS nb_achats
            ORDER BY u.nom
        """, search=search, ville=ville)
        return [dict(r) for r in result]

@router.post("/")
def create_utilisateur(u: Utilisateur):
    with get_session() as session:
        session.run("""
            CREATE (:Utilisateur {id: $id, nom: $nom, age: $age, ville: $ville})
        """, **u.dict())
        return {"message": "Utilisateur créé"}

@router.delete("/{user_id}")
def delete_utilisateur(user_id: str):
    with get_session() as session:
        session.run("MATCH (u:Utilisateur {id: $id}) DETACH DELETE u", id=user_id)
        return {"message": "Utilisateur supprimé"}