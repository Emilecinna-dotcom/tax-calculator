# Interface (composants)

Tous les composants métier sont dans `src/components/calculator/` et n'affichent que les données du hook `useTaxCalculator`. Les composants génériques (`src/components/ui/`) sont ceux de **shadcn/ui**.

## Composant racine

- **`TaxCalculatorApp`** — assemble toute la page : la colonne de saisie (activité, CA, charges, options) et la colonne de résultats (les cartes). C'est lui qui appelle `useTaxCalculator` et distribue `inputs`/`result` + mutateurs aux enfants.

## Saisie

- **`ActivitySelector`** — choix du type d'activité (BIC vente, BIC services, BNC libérale, BNC CIPAV, location meublée). Change les taux appliqués.
- **`RevenueForm`** — saisie du chiffre d'affaires, période de déclaration, et options : ACRE (+ année), versement libératoire, nombre de parts, première année.
- **`ExpensesSection`** — ajout/suppression de charges (`addExpense`/`removeExpense`).

## Résultats

Une carte par poste, mise à jour en temps réel :
- **`CotisationsCard`** — montant des cotisations URSSAF + décomposition indicative.
- **`ImpotCard`** — impôt sur le revenu (versement libératoire ou barème progressif, avec le libellé de la méthode).
- **`TVACard`** — statut TVA (franchise / assujetti) selon les seuils.
- **`CFECard`** — estimation de la CFE (ou exonération).
- **`ResultsSummary`** — synthèse globale (total des prélèvements, net estimé).

## Style

- **shadcn/ui** + **Tailwind CSS 4** : cartes, badges, tabs, tooltips, select, switch.
- **framer-motion** : transitions/animations à l'affichage des résultats.
- Police **Geist** (`@fontsource-variable/geist`).

## Règle de séparation

Aucun composant ne contient de calcul fiscal : ils lisent `result` (déjà calculé par la couche `lib`) et appellent les mutateurs du hook. Pour changer un calcul, on touche à `lib/`, jamais à un composant.
