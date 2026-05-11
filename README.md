# 🔗 Exploration et Analyse de Données avec Neo4j

> Système de recommandation e-commerce modélisé avec une base de données orientée graphe Neo4j, exposé via une API FastAPI et visualisé avec React — déployé entièrement avec Docker.

![Neo4j](https://img.shields.io/badge/Neo4j-2026.03.1-008CC1?style=flat&logo=neo4j&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Comparison-4169E1?style=flat&logo=postgresql&logoColor=white)

---

## 📋 Table des matières

- [Aperçu du projet](#-aperçu-du-projet)
- [Objectifs](#-objectifs)
- [Architecture technique](#-architecture-technique)
- [Modélisation du graphe](#-modélisation-du-graphe)
- [Prérequis](#-prérequis)
- [Installation et démarrage](#-installation-et-démarrage)
- [Import des données](#-import-des-données)
- [Requêtes Cypher avancées](#-requêtes-cypher-avancées)
- [Application web](#-application-web)
- [Comparaison Neo4j vs PostgreSQL](#-comparaison-neo4j-vs-postgresql)
- [Structure du projet](#-structure-du-projet)
- [Auteur](#-auteur)

---

## 📖 Aperçu du projet

Ce projet explore les capacités des **bases de données orientées graphe** à travers un cas d'usage concret : un **système de recommandation e-commerce**. Il couvre l'ensemble du cycle de vie d'un système basé sur Neo4j — de la modélisation du graphe jusqu'au déploiement d'une application web complète.

Une comparaison de performances avec **PostgreSQL** (approche relationnelle classique) est également réalisée pour mettre en évidence les avantages de chaque approche selon le type de requête.

---

## 🎯 Objectifs

- ✅ Comprendre le fonctionnement et les avantages des bases de données orientées graphe
- ✅ Modéliser un jeu de données e-commerce sous forme de graphe (Graph Data Modeling)
- ✅ Mettre en place Neo4j via Docker
- ✅ Importer et structurer des données depuis des fichiers CSV
- ✅ Réaliser des requêtes avancées : recommandation, chemin optimal, centralité, communautés
- ✅ Comparer les performances Neo4j vs PostgreSQL
- ✅ Développer une application web de visualisation (FastAPI + React)

---

## 🏗️ Architecture technique

```
┌──────────────────────────────────────────────────┐
│                  Docker Compose                  │
│                                                  │
│  ┌─────────────┐   ┌─────────────┐  ┌─────────┐ │
│  │    React    │   │   FastAPI   │  │  Neo4j  │ │
│  │  + Recharts │──▶│   Python    │──▶│  Graph  │ │
│  │   :5173     │   │   :8000     │  │  :7474  │ │
│  └─────────────┘   └─────────────┘  │  :7687  │ │
│                                     └─────────┘ │
│                    ┌─────────────┐              │
│                    │ PostgreSQL  │ (comparaison) │
│                    │   :5432     │              │
│                    └─────────────┘              │
└──────────────────────────────────────────────────┘
```

| Couche | Technologie | Port | Rôle |
|--------|-------------|------|------|
| Frontend | React + Vite + Recharts | 5173 | Interface utilisateur et visualisation |
| Backend | FastAPI (Python) | 8000 | API REST, logique métier, requêtes Cypher |
| Base de données | Neo4j 2026.03.1 | 7474 / 7687 | Stockage et traitement graphe |
| Comparaison | PostgreSQL | 5432 | Benchmark approche relationnelle |

---

## 🗺️ Modélisation du graphe

### Nœuds

| Label | Rôle | Propriétés |
|-------|------|------------|
| `:Utilisateur` | Personne qui achète sur la plateforme | `id`, `nom`, `age`, `ville` |
| `:Produit` | Article disponible à l'achat | `id`, `nom`, `prix`, `stock` |
| `:Categorie` | Famille de produits | `id`, `nom` |

### Relations

| Relation | De → Vers | Propriétés | Signification |
|----------|-----------|------------|---------------|
| `A_ACHETE` | Utilisateur → Produit | `date`, `quantite` | Un utilisateur a passé commande |
| `A_NOTE` | Utilisateur → Produit | `note` (1 à 5) | Un utilisateur a laissé un avis |
| `APPARTIENT_A` | Produit → Catégorie | — | Classification du produit |
| `EST_AMI_DE` | Utilisateur → Utilisateur | `statut`, `depuis`, `initie_par` | Lien social avec statut d'amitié |

### Méthode de modélisation (Graph Data Modeling)

| Étape | Action | Résultat pour ce projet |
|-------|--------|------------------------|
| 1 | Définir les questions métier | Recommandation, centralité, chemins, communautés |
| 2 | Identifier les substantifs → Nœuds | Utilisateur, Produit, Catégorie |
| 3 | Identifier les verbes → Relations | A_ACHETE, A_NOTE, APPARTIENT_A, EST_AMI_DE |
| 4 | Attribuer les propriétés | Propriétés sur nœuds et sur relations |
| 5 | Valider par les requêtes | Les requêtes Cypher se lisent naturellement |

---

## ✅ Prérequis

- [Docker](https://www.docker.com/) ≥ 20.x
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2.x
- Git

---

## 🚀 Installation et démarrage

### 1. Cloner le dépôt

```bash
git clone https://github.com/<votre-username>/<nom-du-repo>.git
cd <nom-du-repo>
```

### 2. Démarrer tous les services

```bash
docker compose up -d
```

### 3. Accéder aux interfaces

| Interface | URL |
|-----------|-----|
| Application React | http://localhost:5173 |
| API FastAPI (docs Swagger) | http://localhost:8000/docs |
| Neo4j Browser | http://localhost:7474 |

**Credentials Neo4j :** login `neo4j` / mot de passe `password123`

### 4. Arrêter les services

```bash
docker compose down
```

---

## 📥 Import des données

Les données sont structurées en 4 fichiers CSV placés dans `data/` :

| Fichier | Description | Volume |
|---------|-------------|--------|
| `utilisateurs.csv` | Profils des utilisateurs de la plateforme | 20 utilisateurs |
| `categories.csv` | Catégories de produits disponibles | 5 catégories |
| `produits.csv` | Catalogue complet des produits | 20 produits |
| `achats.csv` | Historique des achats et notations | 100 lignes |

### Lancer l'import

```bash
# Via cypher-shell dans le conteneur
docker exec -it neo4j-ecommerce cypher-shell -u neo4j -p password123 -f /import/import.cypher
```

Ou directement dans le **Neo4j Browser** (http://localhost:7474), en exécutant les blocs du fichier `import/import.cypher`.

### Scripts d'import Cypher

```cypher
-- Catégories
LOAD CSV WITH HEADERS FROM 'file:///categories.csv' AS row
CREATE (:Categorie {id: row.id, nom: row.nom})

-- Utilisateurs
LOAD CSV WITH HEADERS FROM 'file:///utilisateurs.csv' AS row
CREATE (:Utilisateur {id: row.id, nom: row.nom, age: toInteger(row.age), ville: row.ville})

-- Produits avec liaison aux catégories
LOAD CSV WITH HEADERS FROM 'file:///produits.csv' AS row
MATCH (c:Categorie {id: row.categorie_id})
CREATE (p:Produit {id: row.id, nom: row.nom, prix: toFloat(row.prix), stock: toInteger(row.stock)})
CREATE (p)-[:APPARTIENT_A]->(c)

-- Achats et notes
LOAD CSV WITH HEADERS FROM 'file:///achats.csv' AS row
MATCH (u:Utilisateur {id: row.user_id})
MATCH (p:Produit {id: row.product_id})
CREATE (u)-[:A_ACHETE {date: row.date, quantite: toInteger(row.quantite)}]->(p)
CREATE (u)-[:A_NOTE {note: toInteger(row.note)}]->(p)
```

### Validation de l'import

```cypher
MATCH (n) RETURN labels(n) AS type, count(n) AS total
```

| Type de nœud | Nombre importé |
|--------------|---------------|
| Utilisateur | 20 |
| Produit | 20 |
| Catégorie | 5 |

---

## 🔍 Requêtes Cypher avancées

### Recommandation de produits (via réseau social)

Traverse en une seule requête trois niveaux de relations : utilisateur → ami → produit acheté, avec filtre sur les produits non encore achetés.

```cypher
MATCH (alice:Utilisateur {nom:'Alice'})-[r:EST_AMI_DE]-(ami)-[:A_ACHETE]->(p:Produit)
WHERE r.statut = 'accepte' AND NOT (alice)-[:A_ACHETE]->(p)
RETURN p.nom AS produit_recommande, ami.nom AS recommande_par
```

### Chemin le plus court entre deux utilisateurs

```cypher
MATCH path = shortestPath(
  (a:Utilisateur {nom:'Alice'})-[:EST_AMI_DE*..5]-(b:Utilisateur {nom:'Eva'})
)
WHERE ALL(r IN relationships(path) WHERE r.statut = 'accepte')
RETURN path
```

### Calcul de centralité (portée dans le réseau)

```cypher
MATCH (u:Utilisateur)-[:EST_AMI_DE*1..3]-(autre:Utilisateur)
RETURN u.nom AS utilisateur, count(DISTINCT autre) AS portee
ORDER BY portee DESC
```

### Détection de communautés (par ville et catégorie préférée)

```cypher
MATCH (u:Utilisateur)-[:A_ACHETE]->(p:Produit)-[:APPARTIENT_A]->(c:Categorie)
RETURN u.ville AS ville, c.nom AS categorie_preferee, count(*) AS achats
ORDER BY achats DESC
```

### Produits les mieux notés par catégorie

```cypher
MATCH (u:Utilisateur)-[r:A_NOTE]->(p:Produit)-[:APPARTIENT_A]->(c:Categorie)
RETURN c.nom AS categorie, p.nom AS produit, round(avg(r.note), 2) AS note_moyenne
ORDER BY categorie, note_moyenne DESC
```

---

## 🖥️ Application web

### Fonctionnalités

**Dashboard** — Indicateurs clés (nombre d'utilisateurs, produits, catégories, achats), graphique en barres des produits les plus vendus, graphique circulaire de répartition par catégorie.

**Gestion des produits** — CRUD complet avec recherche textuelle en temps réel, filtrage par catégorie, alerte visuelle pour les stocks faibles (< 50 unités).

**Gestion des utilisateurs** — Affichage en cartes avec avatar, ville, âge et nombre d'achats. Recherche par nom et filtrage par ville.

**Réseau social** — Liste des amitiés avec filtrage par statut (accepté / en attente), acceptation de demandes en un clic, recommandations de produits par utilisateur.

**Terminal Cypher** — 7 requêtes prédéfinies couvrant tous les objectifs du projet, éditeur de requêtes libre (Ctrl+Entrée pour exécuter), affichage tabulaire des résultats avec temps d'exécution.

### Routes API (FastAPI)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/dashboard/stats` | Statistiques générales agrégées |
| GET | `/produits/` | Liste des produits (`search`, `categorie`) |
| POST | `/produits/` | Créer un nouveau produit |
| PUT | `/produits/{id}` | Modifier un produit existant |
| DELETE | `/produits/{id}` | Supprimer un produit |
| GET | `/utilisateurs/` | Liste des utilisateurs avec filtres |
| GET | `/amities/` | Liste des amitiés (filtre : `statut`) |
| GET | `/amities/recommandations/{nom}` | Produits recommandés pour un utilisateur |
| PUT | `/amities/statut` | Mettre à jour le statut d'une amitié |
| GET | `/cypher/predefinies/{nom}` | Exécuter une requête prédéfinie |
| POST | `/cypher/executer` | Exécuter une requête Cypher libre |

---

## ⚖️ Comparaison Neo4j vs PostgreSQL

Les mêmes données ont été importées dans PostgreSQL (via Docker) avec un schéma relationnel classique en 6 tables pour une comparaison objective.

| Requête | Neo4j (Cypher) | PostgreSQL (SQL) | Vainqueur | Raison |
|---------|---------------|------------------|-----------|--------|
| Recommandation | ~3–10 ms | ~10–30 ms | **Neo4j** | Traversée directe sans jointures |
| Chemin le plus court | ~2–8 ms | ~20–60 ms | **Neo4j** | Algorithme BFS natif |
| Notes par catégorie | ~5–12 ms | ~0.3–1 ms | **PostgreSQL** | Agrégation simple optimisée |
| Communautés | ~3–8 ms | ~10–25 ms | **Neo4j** | Relations multi-niveaux naturelles |

**Conclusion :** Neo4j est optimal pour les systèmes où les relations entre données sont centrales (réseaux sociaux, recommandations, détection de fraude). PostgreSQL reste supérieur pour les agrégations tabulaires simples. L'avantage de Neo4j devient exponentiel à grande échelle, là où les jointures SQL se dégradent exponentiellement avec la profondeur des relations.

---

## 📁 Structure du projet

```
nosql-dashboard/
.
├── docker-compose.yml          # Orchestration des services
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── routers/
│   │   ├── dashboard.py
│   │   ├── produits.py
│   │   ├── utilisateurs.py
│   │   ├── amities.py
│   │   └── cypher.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Produits.jsx
    │   │   ├── Utilisateurs.jsx
    │   │   ├── Amities.jsx
    │   │   └── Terminal.jsx
    │   └── components/
    │       ├── Sidebar.jsx
    │       └── StatCard.jsx
    └── package.json
└── README.md
```

---

## 👤 Auteur

Projet réalisé par **Rayan NGUEBOU TEMGOUA** dans le cadre du cours **NoSQL — Bases de données orientées graphe** (2025–2026).

---

*Neo4j version : 2026.03.1 · Cypher 5*
