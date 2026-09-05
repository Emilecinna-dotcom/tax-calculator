# Lancer et déployer

## Prérequis

- Node.js (version récente) et npm.

## En développement

```bash
npm install      # installe les dépendances
npm run dev      # serveur de dev Vite (rechargement à chaud)
```

## Vérification / build

```bash
npm run lint     # ESLint
npm run build    # build de production dans dist/
npm run preview  # sert le build de production en local pour vérifier
```

## Déploiement

- Hébergé sur **Vercel** : https://tax-calculator-dusky-ten.vercel.app
- Vercel build automatiquement à partir de `npm run build` (sortie `dist/`).
- Un push sur la branche connectée redéclenche le déploiement.

## Mise à jour annuelle des taux

Le seul fichier à modifier pour une nouvelle année fiscale : `src/lib/constants.ts` (taux de cotisations, taux de versement libératoire, seuils TVA, plafonds de CA, fourchettes CFE). Rebuild + redeploy, rien d'autre à changer.
