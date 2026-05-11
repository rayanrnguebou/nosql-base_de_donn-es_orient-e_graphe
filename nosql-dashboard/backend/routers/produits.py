from fastapi import APIRouter
from database import get_session
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class Produit(BaseModel):
    id: str
    nom: str
    prix: float
    stock: int
    categorie_id: str

class ProduitUpdate(BaseModel):
    nom: Optional[str] = None
    prix: Optional[float] = None
    stock: Optional[int] = None

@router.get("/")
def get_produits(search: str = "", categorie: str = ""):
    with get_session() as session:
        query = """
            MATCH (p:Produit)-[:APPARTIENT_A]->(c:Categorie)
            WHERE ($search = '' OR toLower(p.nom) CONTAINS toLower($search))
            AND ($categorie = '' OR c.nom = $categorie)
            RETURN p.id AS id, p.nom AS nom, p.prix AS prix,
                   p.stock AS stock, c.nom AS categorie
            ORDER BY p.nom
        """
        result = session.run(query, search=search, categorie=categorie)
        return [dict(r) for r in result]

@router.post("/")
def create_produit(p: Produit):
    with get_session() as session:
        session.run("""
            MATCH (c:Categorie {id: $categorie_id})
            CREATE (p:Produit {id: $id, nom: $nom, prix: $prix, stock: $stock})
            CREATE (p)-[:APPARTIENT_A]->(c)
        """, **p.dict())
        return {"message": "Produit créé", "id": p.id}

@router.put("/{produit_id}")
def update_produit(produit_id: str, p: ProduitUpdate):
    with get_session() as session:
        updates = {k: v for k, v in p.dict().items() if v is not None}
        for key, value in updates.items():
            session.run(f"MATCH (p:Produit {{id: $id}}) SET p.{key} = $value",
                        id=produit_id, value=value)
        return {"message": "Produit mis à jour"}

@router.delete("/{produit_id}")
def delete_produit(produit_id: str):
    with get_session() as session:
        session.run("MATCH (p:Produit {id: $id}) DETACH DELETE p", id=produit_id)
        return {"message": "Produit supprimé"}