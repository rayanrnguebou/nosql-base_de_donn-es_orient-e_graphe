from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import dashboard, produits, utilisateurs, amities, cypher

app = FastAPI(title="Neo4j Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router,    prefix="/dashboard")
app.include_router(produits.router,     prefix="/produits")
app.include_router(utilisateurs.router, prefix="/utilisateurs")
app.include_router(amities.router,      prefix="/amities")
app.include_router(cypher.router,       prefix="/cypher")