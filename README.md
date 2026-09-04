# Crédit Agricole Languedoc — Vanilla Fullstack

Cette version utilise un frontend **HTML/CSS/JavaScript vanilla** et un serveur **Node.js/Express**. Le parcours est simulé : loading initial, identifiant, code personnel, loading de connexion, puis page de bienvenue.

## Structure principale

```text
client/
  index.html
  src/
    main.js
    index.css
server/
  index.ts
package.json
```

Le backend expose deux routes simples :

- `GET /api/health` : vérification de disponibilité ;
- `POST /api/demo-session` : crée un identifiant de session temporaire pour la démonstration.

Le code personnel n’est pas transmis au backend, stocké ou envoyé à un service externe.

## Installation et démarrage

```bash
pnpm install
pnpm dev
```

Pour générer la version de production :

```bash
pnpm build
NODE_ENV=production PORT=3000 node dist/index.js
```

Le serveur sert alors le frontend compilé depuis `dist/public/` et l’API depuis `/api/*`.

## Déploiement sur un serveur distant

Transférer le projet sans `node_modules/`, puis lancer :

```bash
pnpm install --prod=false
pnpm build
NODE_ENV=production PORT=3000 node dist/index.js
```

Pour un service permanent, utiliser PM2 ou systemd devant un reverse proxy HTTPS comme Nginx.
