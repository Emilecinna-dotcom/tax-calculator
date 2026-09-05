# Journal des sessions

Historique daté de ce qui a été fait sur le projet, et pourquoi. Le détail technique à jour vit dans les documents thématiques ; ce journal garde la trace du contexte et des décisions.

## Construction initiale

- **Objectif posé** : aider un auto-entrepreneur français à savoir, en temps réel, ce qu'il doit payer (cotisations, impôt, TVA, CFE) avec les taux **2026**.
- **Ce qui a été construit** :
  - Sélecteur d'activité (BIC vente, BIC services, BNC libérale, BNC CIPAV, location meublée), chacune avec ses propres taux.
  - Saisie du chiffre d'affaires + charges → calcul instantané.
  - Options : ACRE (taux réduits en début d'activité), versement libératoire, nombre de parts (quotient familial).
  - Cartes de résultats : cotisations URSSAF, versement libératoire / IR au barème, statut TVA, CFE.
  - Interface shadcn/ui réactive.
- **Décisions d'architecture** : séparation stricte **données (`constants`) / calcul (`lib`) / état (`hook`) / affichage (composants)**, pour mettre à jour les taux d'une année sur l'autre sans toucher au reste. Voir [02-architecture.md](02-architecture.md).
- **Taux 2026 intégrés**, dont le **nouveau 25,6 %** pour les BNC libérales non-CIPAV.
- **Déploiement** : Vercel (https://tax-calculator-dusky-ten.vercel.app), référencé au portfolio.

## 2026-07-21

- Passage de la documentation au **format complet** (modèle du projet remote_ctrl) : découpage de l'ancien trio README/journal/glossaire en une doc structurée — vue d'ensemble, architecture, calculs fiscaux, interface, journal, glossaire, workflows Mermaid, diagnostic, lancer/déployer. Aucun changement de code applicatif à cette occasion.

## À reprendre l'année suivante

Mettre à jour uniquement `src/lib/constants.ts` (taux, seuils, plafonds) et vérifier les libellés dans `taxCalculations.ts`. Le reste ne bouge pas.
