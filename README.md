
# MSID Films – Gestionnaire de Films (Projet React)

Bienvenue dans **MSID Films**, une application Web construite avec **React.js** et **Vite** dans le cadre du module **Développement Web & Mobile (DWM)** du Master MSID.

## Réalisé par :
**Mamouni Mohamed**  
Master MSID – Semestre 2  
LinkedIn : [linkedin.com/in/mohamed-mamouni](https://www.linkedin.com/in/mohamed-mamouni/)  
GitHub : [github.com/omis-mamouni](https://github.com/omis-mamouni)

---

##  Description du projet

Cette application permet de :

-  Rechercher des films via l’API **TMDb**
-  Consulter les **films populaires** et les **films top-rated**
-  Ajouter ses **propres films personnalisés**
-  Voir les **détails complets** d’un film
-  Bénéficier d’une interface sombre type **Netflix-like**

---

##  Fonctionnalités principales

| Fonction                          | Description |
|-----------------------------------|-------------|
|  Recherche                      | Saisie libre avec résultats dynamiques |
|  Affichage par carte           | Posters, titres, survols animés |
|  Ajout de films personnalisés   | Formulaire avec image locale ou lien |
|  Détails de chaque film        | Synopsis, date, note, budget, production |
|  Chargement dynamique           | Scroll infini avec React Query |
|  Routing                        | Navigation fluide sans rechargement |

---

## Technologies & Outils

| Catégorie          | Technologie                     |
|--------------------|----------------------------------|
| Frontend           | React.js + Vite                 |
| Routage            | React Router DOM               |
| Appels API         | @tanstack/react-query          |
| Formulaire         | React Hook Form                |
| Validation         | (Validation personnalisée sans YUP) |
| API externe        | The Movie Database (TMDb)      |
| Persistance        | localStorage / sessionStorage  |
| UI/UX              | CSS personnalisé Netflix-style |
| Versioning         | Git + GitHub (repo privé)      |

---

##  Installation du projet

```bash
# 1. Cloner le dépôt
git clone https://github.com/omis-mamouni/FilmsMamouni.git
cd FilmsMamouni

# 2. Installer les dépendances
npm install

# 3. Lancer le projet en local
npm run dev
```

---

##  Déploiement

L’application est déployée sur GitHub Pages via GitHub Actions.

 [Lien vers l’application en ligne](https://omis-mamouni.github.io/FilmsMamouni)

---

##  API utilisée

- **TMDb (The Movie Database)**  
Site officiel : [https://www.themoviedb.org/](https://www.themoviedb.org/)  
Documentation : [https://developer.themoviedb.org/docs](https://developer.themoviedb.org/docs)

---

##  Structure du projet

```
FilmsMamouni/
│
├── public/
├── src/
│   ├── components/
│   │   ├── Accueil/
│   │   ├── AjouterFilm/
│   │   ├── CarteFilm/
│   │   ├── DetailsFilm/
│   │   ├── Navigation/
│   │   ├── Recherche/
│   │   └── Footer/
│   ├── services/
│   ├── config/
│   ├── App.jsx
│   ├── main.jsx
├── .env
├── package.json
└── README.md
```

---

## Connaissances mises en pratique

- Composants réutilisables avec **props**
- Hooks React : `useState`, `useEffect`, `useNavigate`
- Requêtes API REST + gestion de cache avec **React Query**
- Formulaire avec gestion d’état + prévisualisation image
- Stockage local (localStorage/sessionStorage)
- Déploiement avec GitHub Pages

---

## Licence

Projet réalisé dans un but pédagogique.  
Tous droits réservés © Mamouni Mohamed – Master MSID.
