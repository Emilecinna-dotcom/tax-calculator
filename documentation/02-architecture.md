# Architecture

L'app suit une séparation stricte **données → calcul → état → affichage**. Chaque couche ne connaît que la précédente, ce qui rend la mise à jour annuelle des taux triviale (on ne touche qu'à `constants.ts`).

## Les quatre couches

### 1. Données — `src/lib/constants.ts`
Toutes les valeurs chiffrées de la loi, isolées au même endroit :
- `COTISATIONS_RATES` et `COTISATIONS_RATES_ACRE` (taux réduits ACRE) par activité ;
- `VERSEMENT_LIBERATOIRE_RATES` par activité ;
- `TVA_THRESHOLDS` (seuils de franchise) ;
- `CA_PLAFONDS` (plafonds du régime micro) ;
- `CFE_EXEMPT_CA`, `CFE_MIN_ESTIMATE`, `CFE_MAX_ESTIMATE` ;
- `ACTIVITY_LABELS` (libellés lisibles).

### 2. Calcul — `src/lib/taxCalculations.ts`
Fonctions **pures** (mêmes entrées → mêmes sorties, sans effet de bord) :
- `computeCotisationsSociales(revenue, activityType, hasAcre)` — cotisation = `CA × taux`, plus une décomposition indicative (maladie, retraite, CSG-CRDS…).
- `computeImpotRevenu(revenue, activityType, hasVersementLiberatoire, numberOfParts)` — soit `CA × taux VL`, soit le **barème progressif** appliqué au revenu imposable (`CA × (1 − abattement)`), divisé/multiplié par le **nombre de parts**.
- Calcul du statut **TVA** et de la **CFE**.
- `computeTaxes(inputs)` — l'agrégateur appelé par le hook, qui renvoie un `TaxResult` complet.

### 3. État — `src/hooks/useTaxCalculator.ts`
Le hook `useTaxCalculator` centralise :
- `inputs` (état des saisies : `revenue`, `activityType`, `declarationPeriod`, `hasAcre`, `acreYear`, `hasVersementLiberatoire`, `numberOfParts`, `expenses`, `isFirstYear`) ;
- `result` — recalculé via `useMemo` à chaque changement d'`inputs` (donc « en temps réel »), `null` tant que `revenue ≤ 0` ;
- `caPlafond` / `caExceedsPlafond` — alerte si on dépasse le plafond micro ;
- les mutateurs `updateInputs`, `addExpense`, `removeExpense`.

### 4. Affichage — `src/components/`
- `components/calculator/` : les composants métier — `TaxCalculatorApp` (assemble tout), `ActivitySelector`, `RevenueForm`, `ExpensesSection`, `ResultsSummary`, et les cartes `CotisationsCard`, `ImpotCard`, `TVACard`, `CFECard`.
- `components/ui/` : les composants **shadcn/ui** génériques (button, card, input, select, tabs, tooltip…).

Les composants lisent `inputs`/`result` du hook et appellent ses mutateurs : ils ne contiennent **aucune logique fiscale**.

## Types — `src/types/index.ts`
Tout est typé strictement : `ActivityType`, `TaxInputs`, `TaxResult`, `CotisationsSociales`, `ImpotRevenu`, `TVAInfo`, `CFEInfo`, `Expense`. C'est le contrat partagé entre les couches.

## Flux de données (résumé)

`Saisie utilisateur → updateInputs → inputs → useMemo(computeTaxes) → result → cartes de résultats`

Voir [07-workflows.md](07-workflows.md) pour les diagrammes.
