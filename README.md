# Scout App - Application Multifonctionnelle pour le Scoutisme

## 📱 Vue d'ensemble

Application mobile complète (React Native + Expo) dédiée à la gestion administrative, pédagogique et sociale des groupes de scoutisme.

## 🎯 Modules Principaux

### 1. Module Exécutif
- Gestion des procédures administratives
- Autorisation de camper
- Fiches techniques d'activité
- Fiches de suivi
- Fiches d'évaluation
- Rapports financiers
- Système de notifications et rappels
- Validation par cachet numérique

### 2. Module Pédagogique
- Documents par branche (Louveteaux, Éclaireurs, Routier)
- Ressources audio (chants scouts)
- Téléchargement et consultation

### 3. Module Adultes & Programmes Jeunes
- Politiques mondiales et nationales
- Sujets de devoirs (badges)
- Documents du programme jeunes

### 4. Module États Nominatifs
- Gestion des membres par groupe
- Classification automatique par âge et branche
- Gestion des fonctions et numéros d'assurance

### 5. Module Documentaire
- Statuts juridiques
- Règlements intérieurs
- Procédures administratives et financières

### 6. Module Chat
- Discussions de groupe et individuelles
- Partage de fichiers
- Appels et vidéoconférences
- Envoi de vocaux et vidéos

## 🏗️ Architecture Technique

### Frontend
- **React Native** + Expo
- Navigation: React Navigation
- State Management: Redux Toolkit
- UI: React Native Paper

### Backend
- **Node.js** + Express
- **PostgreSQL** pour la base de données
- **Socket.io** pour le chat temps réel
- **JWT** pour l'authentification

### Sécurité
- Authentification JWT
- Hachage des mots de passe (bcrypt)
- RGPD et protection des données personnelles

## 📋 Installation

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📁 Structure du Projet

```
SDS-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── migrations/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   ├── redux/
│   │   └── components/
│   ├── app.json
│   └── package.json
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   └── SETUP.md
└── README.md
```

## 👨‍💻 Contributeurs

- @districtjappo-design
