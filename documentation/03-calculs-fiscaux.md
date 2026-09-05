# Les calculs fiscaux (le cœur métier)

Détail de ce que calcule `src/lib/taxCalculations.ts`, avec les taux **2026** de `src/lib/constants.ts`. C'est la partie à mettre à jour chaque année.

## Types d'activité gérés

| Activité (`ActivityType`) | Cotisations 2026 | Versement libératoire | Abattement IR |
|---|---|---|---|
| BIC vente (`bic_vente`) | 12,3 % | 1 % | 71 % |
| BIC services (`bic_service`) | 21,2 % | 1,7 % | 50 % |
| BNC libérale non-CIPAV (`bnc_liberale`) | 25,6 % *(nouveau 2026)* | 2,2 % | 34 % |
| BNC CIPAV (`bnc_cipav`) | 23,2 % | 2,2 % | 34 % |
| Location meublée (`location_meublee`) | 6 % | 1 % | 71 % |

## 1. Cotisations sociales

`cotisation = chiffre d'affaires × taux de l'activité`.

- Si **ACRE** est actif (`hasAcre`), on utilise les taux réduits `COTISATIONS_RATES_ACRE` (exonération partielle en début d'activité) au lieu des taux pleins.
- Une **décomposition indicative** est fournie (maladie, retraite de base, retraite complémentaire, invalidité-décès, allocations familiales, formation professionnelle, CSG-CRDS), au prorata du total. Elle est **approximative**, à titre informatif.

## 2. Impôt sur le revenu

Deux modes, selon l'option de l'utilisateur :

**a) Versement libératoire** (`hasVersementLiberatoire = true`)
`IR = chiffre d'affaires × taux VL`. L'impôt est payé au fil de l'eau avec les cotisations.

**b) Barème progressif** (par défaut)
1. Revenu imposable = `CA × (1 − abattement forfaitaire)` (l'abattement dépend de l'activité, cf. tableau).
2. On applique le **barème progressif** de l'IR au **quotient familial** : `barème(revenu imposable / nombre de parts) × nombre de parts`.
3. Le `nombre de parts` (`numberOfParts`) modélise la situation familiale (au moins 1).

## 3. TVA

Comparaison du chiffre d'affaires aux **seuils de franchise en base** (`TVA_THRESHOLDS`) :
- **Services** : 37 500 €.
- **Vente** : 85 000 €.

Sous le seuil → **franchise** (pas de TVA facturée). Au-dessus → **assujetti** (TVA à facturer et reverser).

## 4. CFE (cotisation foncière des entreprises)

Impôt local estimé par une fourchette :
- CA sous `CFE_EXEMPT_CA` → exonéré (montant 0).
- Sinon → estimation entre `CFE_MIN_ESTIMATE` et `CFE_MAX_ESTIMATE` (la CFE réelle dépend de la commune, d'où une fourchette).

## 5. Plafond du régime micro

`CA_PLAFONDS` par activité (ex. 83 600 € services / 203 100 € vente). Si le CA dépasse, le hook lève `caExceedsPlafond` et l'UI alerte : au-delà, le régime micro n'est plus applicable.

## Note de fiabilité

Les cotisations et la TVA sont des calculs **exacts** (taux × base, seuils). L'IR au barème progressif et la CFE sont des **estimations** (le barème réel dépend de l'ensemble des revenus du foyer ; la CFE dépend de la commune). L'app le signale.
