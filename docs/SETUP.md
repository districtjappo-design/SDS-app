# Setup Guide - Scout App

## Prérequis
- Node.js v16+
- npm ou yarn
- PostgreSQL
- Expo CLI (pour le frontend mobile)

## Installation Backend

### 1. Accédez au dossier backend
```bash
cd backend
```

### 2. Installez les dépendances
```bash
npm install
```

### 3. Créez le fichier `.env`
```bash
cp .env.example .env
```

### 4. Configurez votre base de données PostgreSQL
Modifiez le fichier `.env` avec vos paramètres :
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scout_app
DB_USER=scout_user
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_clé_secrète
PORT=5000
NODE_ENV=development
```

### 5. Lancez les migrations SQL
Exécutez le fichier SQL `backend/src/migrations/001_initial_schema.sql` dans PostgreSQL :
```sql
psql -U scout_user -d scout_app -f backend/src/migrations/001_initial_schema.sql
```

### 6. Démarrez le serveur
```bash
npm run dev
```

Le backend sera disponible sur `http://localhost:5000`

## Installation Frontend

### 1. Accédez au dossier frontend
```bash
cd frontend
```

### 2. Installez les dépendances
```bash
npm install
```

### 3. Démarrez l'application Expo
```bash
npm start
```

### 4. Pour Android
```bash
npm run android
```

### 5. Pour iOS
```bash
npm run ios
```

### 6. Pour web
```bash
npm run web
```

## Configuration

### Backend (.env)
```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scout_app
DB_USER=scout_user
DB_PASSWORD=password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_api_key

# Server
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
```

### Frontend
L'API URL est déjà configurée pour `http://localhost:5000` en développement.

## Déploiement

### Backend
- Utiliser Heroku, AWS, ou un serveur VPS
- Configurer les variables d'environnement
- Utiliser un service PostgreSQL géré (AWS RDS, Heroku PostgreSQL)

### Frontend
- Utiliser Expo Snack ou construire un APK/IPA
- Ou déployer comme PWA sur Vercel/Netlify

## Dépannage

### Base de données ne se connecte pas
- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez les identifiants dans le fichier `.env`
- Assurez-vous que la base de données existe

### Port 5000 déjà utilisé
- Changez le PORT dans le fichier `.env`
- Ou tuez le processus utilisant le port : `lsof -i :5000`

### Expo ne démarre pas
- Réinstallez les dépendances : `npm install`
- Effacez le cache Expo : `expo start --clear`

## Support
Pour toute question ou problème, veuillez consulter la documentation officielle :
- [Expo Documentation](https://docs.expo.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
